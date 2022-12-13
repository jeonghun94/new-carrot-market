import type { NextPage, NextPageContext } from "next";
import { Category, Chat, ChatMessage, Product, User } from "@prisma/client";
import client from "@libs/server/client";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import Link from "next/link";
import { withSsrSession } from "@libs/server/withSession";
import useUser from "@libs/client/useUser";
import Image from "next/image";
import { convertTime } from "@libs/client/utils";

interface ChatResponse extends Chat {
  purchaser: User;
  chatMessages: ChatMessage[];
}

interface PageResponse {
  product: Product;
  productChat: ChatResponse[];
}

const Reservation: NextPage<PageResponse> = ({ product, productChat }) => {
  const router = useRouter();
  const { user } = useUser();

  const hasChat = productChat.length > 0;

  return (
    <Layout canGoBack seoTitle={`${product.name}`} title="예약자 선택">
      <div className="h-screen -mb-10">
        <div className="flex justify-start items-center h-0.5/4 p-4 space-x-3 bg-gray-100 mt-2">
          <Image
            className="rounded-md"
            src={`https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${
              product.image.split(",")[0]
            }/public`}
            width={56}
            height={56}
          />
          <div className="flex flex-col justify-between items-start gap-2">
            <p className="text-sm text-gray-400">거래할 상품</p>
            <p className="text-md justify-items-end">{product.name}</p>
          </div>
        </div>
        <div
          className={`flex  flex-col ${
            !hasChat ? "items-center justify-center" : null
          } h-3/4`}
        >
          {!hasChat ? (
            <div className="flex flex-col justify-center items-center gap-2 text-gray-400">
              <p>이 게시글에서 대화한 이웃이 없어요.</p>
            </div>
          ) : (
            productChat.map((chat, index) => (
              <label
                className="flex justify-start items-center w-full p-3 border-b border-gray-200"
                htmlFor={`radio${index}`}
              >
                <input
                  id={`radio${index}`}
                  type="radio"
                  name="radioButton"
                  value={chat.purchaser.id}
                  defaultChecked={index === 0 ? true : false}
                  className="w-6 h-6 text-orange-600 bg-gray-100 border-gray-300 focus:ring-orange-500 mr-2"
                />
                {chat.purchaser.avatar ? (
                  <Image
                    width={48}
                    height={48}
                    className="rounded-full"
                    src={`https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${chat.purchaser.avatar}/avatar`}
                  />
                ) : (
                  <div className="w-12 h-12  flex justify-center items-center rounded-full bg-gray-300 text-4xl">
                    🙎🏻‍♂️
                  </div>
                )}
                <div className="flex flex-col space-y-1">
                  <p className="ml-2 text-md font-bold ">
                    {chat.purchaser.name}
                  </p>
                  <p className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    마지막 대화{" "}
                    {convertTime(chat.chatMessages[0].createdAt.toString())}
                  </p>
                </div>
              </label>
            ))
          )}
          <p
            className={`flex justify-center text-gray-400 underline ${
              hasChat ? "mt-10" : null
            }`}
          >
            최근 채팅 목록에서 예약자 찾기
          </p>
        </div>
        <div className="border-t border-gray-200 h-0.5/4 p-4 pb-8">
          <button
            disabled={!hasChat ? true : false}
            className={`w-full py-3 rounded-md bg-${
              hasChat ? "orange-500 text-white" : "gray-100 text-gray-400"
            }  text-lg cursor-${!hasChat ? "not-allowed" : "pointer"} `}
          >
            예약자 선택
          </button>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
  query,
}: NextPageContext) {
  const product = await client.product.findUnique({
    where: {
      id: Number(query.id),
    },
  });

  const productChat = await client.chat.findMany({
    where: {
      productId: product?.id,
      exit: false,
    },
    select: {
      purchaser: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      chatMessages: {
        select: {
          createdAt: true,
        },
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      productChat: JSON.parse(JSON.stringify(productChat)),
    },
  };
});

export default Reservation;
