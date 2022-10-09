import type { NextApiRequest, NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import { NextRequest } from "next/server";
import { Chat, User } from "@prisma/client";
import useUser from "@libs/client/useUser";

interface ChatWithUser extends Chat {
  user: User;
}

interface ChatResponse {
  chats: ChatWithUser[];
}

const ChatDetail: NextPage<ChatResponse> = ({ chats }) => {
  const { user } = useUser();

  console.log(chats);
  return (
    <Layout canGoBack title="Steve">
      <div className="py-10 pb-16 px-4 space-y-4">
        {chats.map((chat) => (
          <Message
            key={chat.id}
            message={chat.message}
            avatarUrl={chat?.user?.avatar}
            reversed={chat?.user?.id === user?.id}
          />
        ))}
        <form className="fixed  flex justify-between items-center  py-2 px-4 gap-4  bg-white  bottom-4 inset-x-0">
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
              className="shadow-sm py-2 px-3 rounded-full w-full bg-gray-100 border-gray-300 "
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
    </Layout>
  );
};

export const getServerSideProps = async (req: NextApiRequest) => {
  const {
    query: { productId, userId },
  } = req;

  const chats = await client?.chat.findMany({
    include: {
      user: true,
    },
    where: {
      productId: Number(productId),
      userId: Number(userId),
    },
  });

  // console.log(chats, "chats");

  return {
    props: {
      chats: JSON.parse(JSON.stringify(chats)),
    },
  };
};

export default ChatDetail;
