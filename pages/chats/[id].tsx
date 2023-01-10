import type { NextApiRequest, NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import { NextRequest } from "next/server";
import { Chat, Product, User } from "@prisma/client";
import useUser from "@libs/client/useUser";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import Image from "next/image";
import { convertPrice } from "@libs/client/utils";
import NewLayout from "@components/newLayout";
dayjs.locale("ko");

interface ChatWithUser extends Chat {
  user: User;
}

interface ChatWithUserDay {
  message: ChatWithUser[];
  day: string;
}

interface ProductWithUser extends Product {
  user: User;
}

interface ChatResponse {
  product: ProductWithUser;
  chats: ChatWithUserDay[];
}

const ChatDetail: NextPage<ChatResponse> = ({ chats, product }) => {
  const { user } = useUser();

  const CustomTitle = () => {
    const temperature = product?.user?.temperature || 0;
    const bg = temperature > 40 ? "bg-orange-100" : "bg-green-100";
    const text = temperature > 40 ? "text-orange-500" : "text-green-500";

    return (
      <div className="flex items-center space-x-1">
        <span className="">{product?.user?.name}</span>
        <span
          className={`flex items-center text-[0.5rem] font-bold rounded-md px-1 h-[15px] ${bg} ${text}`}
        >
          {product?.user?.temperature}℃
        </span>
      </div>
    );
  };

  return (
    <NewLayout title={<CustomTitle />} actionBar backBtn>
      <div className="w-full border-b p-4 space-y-3">
        <div className="flex gap-3 w-full ">
          <Image
            alt={`${product?.name}`}
            width={48}
            height={48}
            src={`https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${
              product?.image.split(",")[0]
            }/public`}
            className="w-12 h-12 rounded-md bg-slate-300"
          />
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold">
              판매중{" "}
              <span className="text-sm font-normal text-gray-600">
                {product?.name}
              </span>
            </p>
            <p className="text-sm font-semibold">
              {convertPrice(product?.price)}
              <span className="font-normal text-xs text-gray-400">
                {product?.nego ? "" : " (가격제안불가)"}
              </span>
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex items-center gap-2 border rounded-md text-sm font-semibold px-3 py-1">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            약속 잡기
          </div>
        </div>
      </div>
      <div className="pt-4 px-4 space-y-1">
        {chats.map((chat, index) => (
          <>
            <div key={index} className="mt-2 text-center text-sm text-gray-400">
              {chat.day}
            </div>
            {/* {chat.message.map((m) => (
              <Message
                key={m.id}
                message={m.message}
                avatarUrl={m?.user?.avatar}
                reversed={m?.user?.id === user?.id}
                sendTime={m.createdAt.toLocaleString("ko-KR")}
              />
            ))} */}
          </>
        ))}
        <form className="fixed  flex justify-between items-center  py-2 pb-4 px-4 gap-4  bg-white  bottom-0 inset-x-0">
          <div className="flex place-content-center">
            <svg
              className="w-7 h-7 text-gray-400 font-extralight"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
          </div>
          <div
            className="flex max-w-full items-center w-full mx-auto  rounded-full 
            "
          >
            <input
              type="text"
              placeholder="메시지 보내기"
              className="shadow-sm py-2 px-3 rounded-full w-full bg-gray-100 border-gray-300 outline-none "
            />
          </div>
          <div className="flex place-content-center cursor-pointer">
            <svg
              className="w-6 h-6 text-gray-300 font-extralight rotate-90"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </div>
        </form>
      </div>
    </NewLayout>
  );
};

export const getServerSideProps = async (req: NextApiRequest) => {
  const {
    query: { productId, userId },
  } = req;

  const sellerId = await client?.product.findUnique({
    where: {
      id: Number(productId),
    },
    select: {
      userId: true,
    },
  });

  let chatDate = await client?.chat.findMany({
    select: {
      createdAt: true,
    },
    where: {
      productId: Number(productId),
      // OR: [
      //   {
      //     userId: Number(userId),
      //   },
      //   {
      //     userId: sellerId?.userId,
      //   },
      // ],
    },
  });

  const chatDays = chatDate?.map((chat) => {
    return dayjs(chat.createdAt).format("YYYY년MM월DD일");
  });

  let result = chatDays?.filter((v, i) => chatDays.indexOf(v) === i);

  const chats = await client?.chat.findMany({
    // include: {
    //   user: {
    //     select: {
    //       avatar: true,
    //       id: true,
    //     },
    //   },
    // },
    // where: {
    //   productId: Number(productId),
    //   userId: {
    //     in: [Number(userId), Number(sellerId?.userId)],
    //   },
    // },
  });

  const d = result?.map((day) => {
    return {
      day,
      message: chats?.filter((chat) => {
        return dayjs(chat.createdAt).format("YYYY년MM월DD일") === day;
      }),
    };
  });

  const product = await client?.product.findUnique({
    where: {
      id: Number(productId),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
          temperature: true,
        },
      },
    },
  });

  return {
    props: {
      chats: JSON.parse(JSON.stringify(d)),
      product: JSON.parse(JSON.stringify(product)),
    },
  };
};

export default ChatDetail;
