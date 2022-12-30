import type { NextPage, NextPageContext } from "next";
import { withSsrSession } from "@libs/server/withSession";
import { Product, User } from "@prisma/client";
import client from "@libs/server/client";

import UserAvartar from "@components/user-avatar";
import TabMenus from "@components/tab-menus";
import Layout from "@components/layout";
import ProductItems from "@components/product";

interface PageResponse {
  profile: User;
  products: Product[];
}

const Sold: NextPage<PageResponse> = ({ profile, products }) => {
  const saleProducts = products.filter((product) => product.state === "Sale");
  const soldProducts = products.filter(
    (product) => product.state === "Completed"
  );
  const hideProducts = products.filter((product) => product.state === "Hide");

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

  return (
    <Layout canGoBack>
      <div className="flex justify-between items-center mt-2 p-3 h-24">
        <div className="flex flex-col items-start justify-between gap-2">
          <p className="font-semibold text-xl">나의 판매내역</p>
          <button className="px-3 py-1 bg-gray-100 rounded-sm text-sm font-semibold">
            글쓰기
          </button>
        </div>
        <div className="flex items-center">
          <UserAvartar
            avatar={profile.avatar + ""}
            imageSize={60}
            defaultImageSize={10}
          />
        </div>
      </div>

      <TabMenus menus={menus} />
      {saleProducts.map((product, index) => (
        <ProductItems
          key={index}
          image={product.image}
          name={product.name}
          createdAt={product.createdAt.toString()}
          price={product.price}
          isSoldTab
        />
      ))}
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

  console.log(products);
  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
      products: JSON.parse(JSON.stringify(products)),
    },
  };
});
