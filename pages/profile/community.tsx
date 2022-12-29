import { NextPage, NextPageContext } from "next";
import { withSsrSession } from "@libs/server/withSession";
import { Answer, Post, PostCategory } from "@prisma/client";
import { convertTime } from "@libs/client/utils";
import { useRouter } from "next/router";
import { useState } from "react";
import client from "@libs/server/client";
import EmptyLayout from "@components/empty-layout";
import Layout from "@components/layout";

interface PostWithCategory extends Post {
  postCategory: PostCategory;
  _count: {
    answers: number;
  };
}

interface AnswerWithPost extends Answer {
  post: Post;
}

interface PageResponse {
  posts: PostWithCategory[];
  answers: AnswerWithPost[];
}

const History: NextPage<PageResponse> = ({ posts, answers }) => {
  const [tab, setTab] = useState(1);
  const router = useRouter();

  const foucsTab = (tab: number, index: number) => {
    const foucs =
      tab === index
        ? "text-black  border-b-2 border-black"
        : "text-gray-500  border-b border-gray-300";

    return (
      "text-sm font-bold uppercase px-5 py-3 block leading-normal " + foucs
    );
  };

  const li = (tab: number, index: number, menu: string) => {
    return (
      <li className="flex-auto text-center  bg-white z-30">
        <a
          className={foucsTab(tab, index)}
          onClick={(e) => {
            e.preventDefault();
            setTab(index);
          }}
          data-toggle="tab"
          href={`#link${index}`}
          role="tablist"
        >
          {menu}
        </a>
      </li>
    );
  };

  return (
    <Layout canGoBack title="내 글 목록">
      <div className="flex flex-wrap ">
        <div className="w-full ">
          <ul
            className="flex mt-2 list-none flex-wrap flex-row "
            role="tablist"
          >
            {li(tab, 1, "게시글")}
            {li(tab, 2, "댓글")}
          </ul>
        </div>

        <div className="relative flex flex-col  break-words bg-gray-100 w-full ">
          {tab === 1 && posts.length > 0 ? (
            <div className="tab-content tab-space">
              {posts.map((post, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start justify-center gap-3 h-32  border-b-[8px] border-gray-100 px-3 bg-white cursor-pointer"
                  onClick={() => {
                    router.push(`/community/${post.id}`);
                  }}
                >
                  <div className=" flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-gray-100 text-gray-800">
                    {post.postCategory.name}
                  </div>
                  <div className="flex">
                    <p className="text-orange-500 font-medium">
                      Q.{" "}
                      <span className="text-black text-sm">
                        {Number(post.content?.length) > 50 ? (
                          <>{post.content?.slice(0, 50) + "..."}</>
                        ) : (
                          post.content
                        )}
                      </span>
                    </p>{" "}
                  </div>
                  <p className="text-sm text-gray-500">
                    답변 {post._count.answers}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            tab === 1 && (
              <EmptyLayout comment="작성한 게시글이 없어요." color="gray-100" />
            )
          )}
          {tab === 2 && answers.length > 0 ? (
            <div className="tab-content tab-space">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start justify-center gap-2 h-20  border-b-[8px] border-gray-100 px-3 bg-white cursor-pointer"
                  onClick={() => {
                    router.push(`/community/${answer.post.id}`);
                  }}
                >
                  <div className="flex">
                    <p className="text-orange-500 font-medium">
                      <span className="text-black text-sm">
                        {answer.answer.length > 50 ? (
                          <>{answer.answer?.slice(0, 50) + "..."}</>
                        ) : (
                          answer.answer
                        )}
                      </span>
                    </p>{" "}
                  </div>
                  <p className="text-sm text-gray-500">
                    &#96;
                    {Number(answer.post.content?.length) > 20
                      ? `${answer.post.content?.slice(0, 20)}...`
                      : answer.post.content}
                    <span>
                      &#96;
                      {" 에서 " +
                        convertTime(answer.createdAt.toString()) +
                        " 작성"}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            tab === 2 && (
              <EmptyLayout comment="작성한 댓글이 없어요." color="gray-100" />
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
}: NextPageContext) {
  const userId = req?.session?.user?.id;

  const posts = await client.post.findMany({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          name: true,
          avatar: true,
        },
      },
      postCategory: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          answers: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const answers = await client.answer.findMany({
    where: {
      userId,
    },
    include: {
      post: {
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    props: {
      answers: JSON.parse(JSON.stringify(answers)),
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
});

export default History;
