import type { NextPage, NextPageContext } from "next";
import { withSsrSession } from "@libs/server/withSession";
import { Product, User } from "@prisma/client";
import client from "@libs/server/client";

import UserAvartar from "@components/user-avatar";
import TabMenus from "@components/tab-menus";
import Layout from "@components/layout";
import ProductItems from "@components/product";
import { useEffect, useState } from "react";
import Link from "next/link";
import EmptyLayout from "@components/empty-layout";
import products from "pages/api/products";

export interface ProductWithCount extends Product {
  _count: {
    favs: number;
    chats: number;
  };
}

interface PageResponse {
  profile: User;
  products: ProductWithCount[];
}

const Sold: NextPage<PageResponse> = ({ profile, products }) => {
  const [tabNumber, setTabNumber] = useState(0);
  const [items, setItems] = useState(products);

  const saleProducts = items.filter(
    (product) => product.state === "Sale" || product.state === "Reservation"
  );
  const soldProducts = items.filter((product) => product.state === "Completed");
  const hideProducts = items.filter((product) => product.state === "Hide");

  const menus = [
    {
      id: 1,
      name: `판매중 ${saleProducts.length > 0 ? saleProducts.length : ""}`,
    },
    {
      id: 2,
      name: `거래완료 ${soldProducts.length > 0 ? soldProducts.length : ""}`,
    },
    {
      id: 3,
      name: `숨김 ${hideProducts.length > 0 ? hideProducts.length : ""}`,
    },
  ];

  const datas = [
    {
      id: 0,
      products: items.filter(
        (product) => product.state === "Sale" || product.state === "Reservation"
      ),
      comment: "판매중 게시글이 없어요.",
    },
    {
      id: 1,
      products: items.filter((product) => product.state === "Completed"),
      comment: "거래완료 게시글이 없어요.",
    },
    {
      id: 2,
      products: items.filter((product) => product.state === "Hide"),
      comment: "숨기기한 게시글이 없어요.",
    },
  ];

  useEffect(() => {
    console.log(items);
  }, [items]);

  return (
    <Layout canGoBack>
      <div className="flex justify-between items-center mt-2 p-3 h-24">
        <div className="flex flex-col items-start justify-between gap-2">
          <p className="font-semibold text-xl">나의 판매내역</p>
          <Link href={"/products/upload"}>
            <a className="px-3 py-1 bg-gray-100 rounded-sm text-sm font-semibold">
              글쓰기
            </a>
          </Link>
        </div>
        <div className="flex items-center">
          <UserAvartar
            avatar={profile.avatar + ""}
            imageSize={60}
            defaultImageSize={10}
          />
        </div>
      </div>

      <TabMenus
        menus={menus}
        tabNumber={tabNumber}
        setTabNumber={setTabNumber}
      />

      {/* {datas.map((data, index) => {
        tabNumber === index && data.products.length > 0
          ? data.products.map((product, index) => (
              <ProductItems
                key={index}
                id={product.id}
                image={product.image}
                name={product.name}
                createdAt={product.createdAt.toString()}
                price={product.price}
                isSoldTab
                chats={product._count.chats}
                favs={product._count.favs}
                state={product.state}
              />
            ))
          : tabNumber === index && (
              <EmptyLayout comment={data.comment} color="bg-gray-100" />
            );
      })} */}

      {tabNumber === 0 && saleProducts.length > 0
        ? saleProducts.map((product, index) => (
            <ProductItems
              key={index}
              id={product.id}
              image={product.image}
              name={product.name}
              createdAt={product.createdAt.toString()}
              price={product.price}
              isSoldTab
              chats={product._count.chats}
              favs={product._count.favs}
              state={product.state}
              setItems={setItems}
            />
          ))
        : tabNumber === 0 && (
            <EmptyLayout
              comment="판매중 게시글이 없어요."
              color="bg-gray-100"
            />
          )}

      {tabNumber === 1 && soldProducts.length > 0
        ? soldProducts.map((product, index) => (
            <ProductItems
              key={index}
              id={product.id}
              image={product.image}
              name={product.name}
              createdAt={product.createdAt.toString()}
              price={product.price}
              isSoldTab
              chats={product._count.chats}
              favs={product._count.favs}
              state={product.state}
              setItems={setItems}
            />
          ))
        : tabNumber === 1 && (
            <EmptyLayout
              comment="거래완료 게시글이 없어요."
              color="bg-gray-100"
            />
          )}

      {tabNumber === 2 && hideProducts.length > 0
        ? hideProducts.map((product, index) => (
            <ProductItems
              key={index}
              id={product.id}
              image={product.image}
              name={product.name}
              createdAt={product.createdAt.toString()}
              price={product.price}
              isSoldTab
              chats={product._count.chats}
              favs={product._count.favs}
              state={product.state}
              setItems={setItems}
            />
          ))
        : tabNumber === 2 && (
            <EmptyLayout
              comment="숨기기한 게시글이 없어요."
              color="bg-gray-100"
            />
          )}
    </Layout>
  );
};

export default Sold;

export const getServerSideProps = withSsrSession(async function ({
  req,
}: NextPageContext) {
  const userId = req?.session?.user?.id;

  const profile = await client.user.findUnique({
    where: { id: userId },
  });

  const products = await client.product.findMany({
    where: {
      userId,
    },

    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      createdAt: true,
      state: true,
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
      profile: JSON.parse(JSON.stringify(profile)),
      products: JSON.parse(JSON.stringify(products)),
    },
  };
});
