import type { NextPage, NextPageContext } from "next";
import { withSsrSession } from "@libs/server/withSession";
import { Product, User } from "@prisma/client";
import client from "@libs/server/client";
import { useState } from "react";

import UserAvartar from "@components/user-avatar";
import TabMenus from "@components/tab-menus";
import EmptyLayout from "@components/empty-layout";
import ProductItems from "@components/product";
import Link from "next/link";
import NewLayout from "@components/newLayout";

export interface ProductWithCount extends Product {
  _count: {
    favs: number;
    chats: number;
  };
}

interface PageResponse {
  isMe: boolean;
  profile: User;
  products: ProductWithCount[];
}

const Sold: NextPage<PageResponse> = ({ isMe, profile, products }) => {
  const [tabNumber, setTabNumber] = useState(0);
  const [items, setItems] = useState(products);

  const saleProducts = items.filter(
    (product) => product.state === "Sale" || product.state === "Reservation"
  );
  const soldProducts = items.filter((product) => product.state === "Completed");
  const hideProducts = items.filter((product) => product.state === "Hide");

  const menus = [
    {
      name: `판매중 ${saleProducts.length > 0 ? saleProducts.length : ""}`,
    },
    {
      name: `거래완료 ${soldProducts.length > 0 ? soldProducts.length : ""}`,
    },
    {
      name: `숨김 ${hideProducts.length > 0 ? hideProducts.length : ""}`,
    },
  ];

  const values = [
    {
      products: items.filter(
        (product) => product.state === "Sale" || product.state === "Reservation"
      ),
      comment: "판매중인",
    },
    {
      products: items.filter((product) => product.state === "Completed"),
      comment: "거래완료",
    },
    {
      products: items.filter((product) => product.state === "Hide"),
      comment: "숨기기한",
    },
  ];

  return (
    <NewLayout actionBar backBtn>
      <div className="flex justify-between items-center mt-2 p-3 h-24">
        <div className="flex flex-col items-start justify-between gap-2 font-semibold text-xl">
          {isMe ? (
            <>
              <p>나의 판매내역</p>
              <Link href={"/products/upload"}>
                <a className="px-3 py-1 bg-gray-100 rounded-sm text-sm font-semibold">
                  글쓰기
                </a>
              </Link>
            </>
          ) : (
            <p>{profile.name}님의 판매상품</p>
          )}
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

      {values.map((data, index) => {
        return (
          <div key={index}>
            {tabNumber === index && data.products.length > 0
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
                    setItems={setItems}
                  />
                ))
              : tabNumber === index && (
                  <EmptyLayout
                    comment={`${data.comment} 게시글이 없어요.`}
                    color="bg-gray-100"
                  />
                )}
          </div>
        );
      })}
    </NewLayout>
  );
};

export default Sold;

export const getServerSideProps = withSsrSession(async function ({
  req,
  query,
}: NextPageContext) {
  const userId = query.id ? Number(query.id) : req?.session?.user?.id;

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
      isMe: query.id ? false : true,
      profile: JSON.parse(JSON.stringify(profile)),
      products: JSON.parse(JSON.stringify(products)),
    },
  };
});
