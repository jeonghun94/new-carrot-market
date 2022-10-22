import type { NextApiRequest, NextPage, NextPageContext } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import { Product, User } from "@prisma/client";
import Image from "next/image";
import { convertTime } from "@libs/client/utils";

interface ProductChat extends Product, User {
  code: string;
  message: string;
  craetedAt: Date;
  read: boolean;
  user: User;
  product: Product;
  newMessages: number;
}
interface ProductsChatsResponse extends ProductChat {
  productChats: ProductChat[];
}

const Chats: NextPage<ProductsChatsResponse> = ({ productChats }) => {
  console.log(productChats);
  return (
    <Layout hasTabBar title="채팅">
      <div className="divide-y-[1px]">
        {productChats.map((productChat, i) => (
          <Link href={`/chats/${i}`} key={i}>
            <a className=" py-3 px-5 flex items-center space-x-3 cursor-pointer ">
              <div className="w-full flex justify-between space-x-7">
                <div className="flex justify-start items-center space-x-4">
                  <Image
                    width={48}
                    height={48}
                    src={`https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${productChat?.user?.avatar}/avatar`}
                    className="w-12 h-12 rounded-full bg-slate-300"
                  />
                  <div className="flex flex-col justify-center items-start ">
                    <p className="font-semibold">
                      {productChat?.user?.name}
                      <span className="ml-1 text-sm text-gray-400 font-normal">
                        춘의동 ∙{" "}
                        {convertTime(productChat?.createdAt.toString())}
                      </span>
                    </p>
                    <p className="text-sm">{productChat?.message}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  {productChat?.newMessages > 0 ? (
                    <div className=" w-8 h-8 flex justify-center mr-3 items-center bg-orange-500 text-sm text-white-400 text-white rounded-full">
                      {productChat?.newMessages}
                    </div>
                  ) : null}
                  <Image
                    width={52}
                    height={52}
                    src={`https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${productChat?.product?.image}/public`}
                    className="w-12 h-12 rounded-md bg-slate-300"
                  />
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
}: NextPageContext) {
  const productChats = [];

  const chats = await client.chat.findMany({
    distinct: ["code"],
    where: { userId: req?.session.user?.id, exit: false },
    select: {
      code: true,
      message: true,
      createdAt: true,
      read: true,
      product: {
        select: {
          image: true,
        },
      },
      user: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  for (const chat of chats) {
    const newMessge = await client.chat.findMany({
      where: {
        userId: req?.session.user?.id,
        exit: false,
        read: false,
        code: chats[0].code,
      },
    });
    productChats.push({ ...chat, newMessages: newMessge.length });
  }

  console.log(productChats);

  return {
    props: {
      productChats: JSON.parse(JSON.stringify(productChats)),
    },
  };
});

export default Chats;
