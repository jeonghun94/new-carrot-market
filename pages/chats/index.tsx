import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";

const Chats: NextPage = () => {
  return (
    <Layout hasTabBar title="채팅">
      <div className="divide-y-[1px]">
        {[1].map((_, i) => (
          <Link href={`/chats/${i}`} key={i}>
            <a className="mt-2 py-3 px-5 flex items-center space-x-3 cursor-pointer border-b">
              <div className="w-full flex justify-between space-x-7">
                <div className="flex justify-start items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-slate-300" />
                  <div className="flex flex-col justify-center items-start ">
                    <p className="font-semibold">
                      Steve Jebs
                      <span className="ml-1 text-sm text-gray-400 font-normal">
                        춘의동 ∙ 1일 전
                      </span>
                    </p>
                    <p className="text-sm">
                      See you tomorrow in the corner at 2pm!
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className=" w-8 h-8 flex justify-center items-center bg-orange-500 text-sm text-white-400 text-white rounded-full">
                    1
                  </div>
                  <div className="w-12 h-12 bg-slate-300 rounded-md"></div>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
