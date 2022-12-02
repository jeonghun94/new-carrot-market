import type { NextPage, NextPageContext } from "next";
import { withSsrSession } from "@libs/server/withSession";
import { Chat, Product, User } from "@prisma/client";
import { convertTime } from "@libs/client/utils";
import { useRouter } from "next/router";
import noImage from "public/no-image.png";
import Layout from "@components/layout";
import client from "@libs/server/client";
import Image from "next/image";

interface ProductWithUser extends Product {
  user: User;
}

interface ChatWithProductUser extends Chat {
  user: {
    name: string;
    id: number;
    avatar: string;
  };
  product: {
    name: string;
    id: number;
    image: string;
  };
}

interface ProductChat {
  code: string;
  message: string;
  createdAt: string;
  read: boolean;
  user: {
    name: string;
    avatar: string;
  };
  product: ProductWithUser;
  newMessages: number;
  lastChat: string;
}

interface ProductsChatsResponse extends ProductChat {
  productChats: ProductChat[];
}

const Chats: NextPage<ProductsChatsResponse> = ({ productChats }) => {
  const router = useRouter();
  const handleClick = (productId: number, sellerId: number, code: string) => {
    router.push({
      pathname: `/products/${productId}/chat`,
      query: { productId, sellerId, code },
    });
  };
  return (
    <Layout hasTabBar title="채팅">
      {productChats.length > 0 ? (
        productChats.map((productChat, i) => (
          <div
            key={i}
            onClick={() =>
              handleClick(
                productChat?.product.id,
                productChat?.product.userId,
                productChat?.code
              )
            }
            className="py-3 px-5 border-b flex items-center space-x-3 cursor-pointer first:mt-2 "
          >
            <div className="w-full flex justify-between space-x-7">
              <div className="flex justify-start items-center space-x-4">
                <Image
                  width={48}
                  height={48}
                  src={
                    productChat.user.avatar
                      ? `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${productChat.user.avatar}/avatar`
                      : noImage
                  }
                  className="w-12 h-12 rounded-full bg-slate-300"
                />
                <div className="flex flex-col justify-center items-start ">
                  <p className="font-semibold">
                    {productChat?.user.name}
                    <span className="ml-1 text-sm text-gray-400 font-normal">
                      {" "}
                      춘의동 ∙ {convertTime(productChat?.createdAt.toString())}
                      {productChat.product.userId}
                    </span>
                  </p>
                  <p className="text-sm">{productChat?.lastChat}</p>
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
          </div>
        ))
      ) : (
        <div className="min-w-max min-h-screen flex justify-center items-center -mt-12">
          <p>참여 중인 채팅이 없습니다.</p>
        </div>
      )}
    </Layout>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
}: NextPageContext) {
  const userId = req?.session.user?.id;
  const chats: any[] = [];
  const productChats = [];
  const products = await client.product.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  const seller = false;

  for (const product of products) {
    const myCode = `${product.id}/${userId}/${userId}`;

    const chatss = await client.chat.findMany({
      distinct: ["productId", "code"],
      where: seller
        ? {
            userId,
            exit: false,
          }
        : {
            productId: product.id,
            exit: false,
          },
      select: {
        code: true,
        message: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        product: {
          select: {
            id: true,
            userId: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    chatss.map((chat) => {
      // seller
      //   ? chats.push(chat)
      //   : chat.code !== myCode
      //   ? chats.push(chat)
      //   : null;
      if (chat.code !== myCode) {
        chats.push(chat);
      }
    });
  }
  console.log(chats);

  for (const chat of chats) {
    // 새로운 메세지 갯수
    const newMessages = await client.chat
      .findMany({
        select: {
          id: true,
        },
        where: {
          userId: chat.product.userId,
          productId: chat.product.id,
          exit: false,
          read: false,
        },
      })
      .then((res) => res.length);

    // 마지막 채팅 구하기
    const lastChat = await client.chat
      .findFirst({
        distinct: ["productId"],
        select: {
          message: true,
        },
        where: {
          productId: chat.product.id,
          code: {
            contains: chat.code,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
      .then((res) => res?.message);

    // 채팅 내용 재설정
    productChats.push({
      ...chat,
      newMessages,
      lastChat,
    });
  }

  console.log(productChats, "dsdsdsd");

  return {
    props: {
      productChats: JSON.parse(JSON.stringify(productChats)),
    },
  };
});

export default Chats;
