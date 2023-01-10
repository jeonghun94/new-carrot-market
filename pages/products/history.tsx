import { NextPage, NextPageContext } from "next";
import client from "@libs/server/client";
import Layout from "@components/layouts/layout";
import { useState } from "react";
import { Product, User } from "@prisma/client";
import { cls } from "@libs/client/utils";
import { useRouter } from "next/router";
import ProductItems from "@components/product";

interface ProductWithCount extends Product {
  user: User;
  _count: {
    favs: number;
    chats: number;
  };
}

interface SellerProduct {
  products: ProductWithCount[];
}

const History: NextPage<SellerProduct> = ({ products }) => {
  const [tab, setTab] = useState(1);
  const router = useRouter();

  const productDetail = (id: number) => {
    router.push(`/products/${id}`);
  };

  const saleProducts = products.filter(
    (product) => product.state === "Sale" || product.state === "Reservation"
  );
  const soldProducts = products.filter(
    (product) => product.state === "Completed"
  );

  const foucsTab = (tab: number, index: number) => {
    const foucs =
      tab === index
        ? "text-black  border-b-2 border-black"
        : "text-gray-500  border-b border-gray-300";

    return (
      "text-sm font-bold uppercase px-5 py-3 block leading-normal " + foucs
    );
  };

  const li = (tab: number, index: number, menu: string) => {
    return (
      <li className="flex-auto text-center">
        <a
          className={foucsTab(tab, index)}
          onClick={(e) => {
            e.preventDefault();
            setTab(index);
          }}
          data-toggle="tab"
          href={`#link${index}`}
          role="tablist"
        >
          {menu}
        </a>
      </li>
    );
  };

  const productsL = (products: ProductWithCount[], tabIndex: number) => {
    return products.map((product) => (
      <div
        key={product.id}
        className={`${cls(
          tab === tabIndex ? "block" : "hidden"
        )} w-full   bg-white`}
        onClick={() => productDetail(product.id)}
        id={`link${tabIndex}`}
      >
        <ProductItems
          key={product.id}
          id={product.id}
          image={product.image}
          name={product.name}
          price={product.price}
          createdAt={product.createdAt.toString()}
          favs={product._count.favs}
          chats={product._count.chats}
          state={product.state}
          setItems={() => console.log("setItems")}
          border
        />
      </div>
    ));
  };

  return (
    <Layout
      seoTitle={`${products[0].user.name}님의 판매 상품`}
      title="판매 상품 보기"
      actionBar
      backBtn
    >
      <div className="w-full ">
        <ul className="flex mt-2 list-none flex-wrap flex-row" role="tablist">
          {li(tab, 1, "전체")}
          {li(tab, 2, "거래중")}
          {li(tab, 3, "거래완료")}
        </ul>

        <div className="w-full h-screen flex flex-col bg-gray-100">
          {productsL(products, 1)}
          {productsL(saleProducts, 2)}
          {productsL(soldProducts, 3)}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { sellerId } = ctx.query;

  const products = await client.product.findMany({
    where: {
      userId: Number(sellerId),
    },
    include: {
      user: true,
      _count: {
        select: {
          favs: true,
          chats: true,
        },
      },
    },
  });

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
};

export default History;
