import type { NextPage, NextPageContext } from "next";
import { withSsrSession } from "@libs/server/withSession";
import { Chat, ChatMessage, Product, User } from "@prisma/client";
import { convertTime } from "@libs/client/utils";
import { useRouter } from "next/router";
import noImage from "public/no-image.png";
import Layout from "@components/layout";
import client from "@libs/server/client";
import useUser from "@libs/client/useUser";
import Image from "next/image";

interface ChatWithUserProduct extends Chat {
  seller: User;
  purchaser: User;
  product: Product;
  newMessages: number;
  chatMessages: ChatMessage[];
}

interface ProductsChatsResponse extends Chat {
  productChats: ChatWithUserProduct[];
}

const Chats: NextPage<ProductsChatsResponse> = ({ productChats }) => {
  const { user } = useUser();
  const router = useRouter();
  const handleClick = (productId: number) => {
    router.push({
      pathname: `/products/${productId}/chat`,
      query: { productId },
    });
  };
  return (
    <Layout hasTabBar title="채팅">
      {productChats.length > 0 ? (
        productChats.map((productChat, i) => (
          <div
            key={i}
            onClick={() => handleClick(productChat?.product.id)}
            className="py-3 px-5 border-b flex items-center space-x-3 cursor-pointer first:mt-2 "
          >
            <div className="w-full flex justify-between space-x-7">
              <div className="flex justify-start items-center space-x-4">
                <Image
                  width={48}
                  height={48}
                  src={
                    productChat.sellerId === user?.id
                      ? productChat.purchaser.avatar
                        ? `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${productChat.purchaser.avatar}/avatar`
                        : noImage
                      : productChat.seller.avatar
                      ? `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${productChat.seller.avatar}/avatar`
                      : noImage
                  }
                  className="w-12 h-12 rounded-full bg-slate-300"
                />
                <div className="flex flex-col justify-center items-start ">
                  <p className="font-semibold">
                    {productChat.sellerId === user?.id
                      ? productChat.purchaser.name
                      : productChat.seller.name}
                    <span className="ml-1 text-sm text-gray-400 font-normal">
                      {" "}
                      춘의동 ∙{" "}
                      {convertTime(
                        productChat.chatMessages[0]?.createdAt.toString()
                      )}
                    </span>
                  </p>
                  <p className="text-sm">
                    {productChat.chatMessages[0]?.content}
                  </p>
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

  const chats: any = await client.chat.findMany({
    where: {
      OR: [
        {
          purchaserId: userId,
        },
        {
          sellerId: userId,
        },
      ],
    },
    include: {
      product: {
        include: {
          user: true,
        },
      },
      seller: {
        select: {
          name: true,
          avatar: true,
        },
      },
      purchaser: {
        select: {
          name: true,
          avatar: true,
        },
      },
      chatMessages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  for (let chat of chats) {
    const newMessages = await client.chatMessage.count({
      where: {
        chatId: chat.id,
        read: false,
        userId: {
          not: userId,
        },
      },
    });

    chat.newMessages = newMessages;
  }

  chats.sort((a: any, b: any) => {
    return (
      new Date(b.chatMessages[0]?.createdAt).getTime() -
      new Date(a.chatMessages[0]?.createdAt).getTime()
    );
  });

  return {
    props: {
      productChats: JSON.parse(JSON.stringify(chats)),
    },
  };
});

export default Chats;
