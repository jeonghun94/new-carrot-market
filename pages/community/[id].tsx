import type { NextPage, NextPageContext } from "next";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Answer, Post, PostCategory, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls, convertTime } from "@libs/client/utils";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Image from "next/image";

import client from "@libs/server/client";

interface AnswerWithUser extends Answer {
  user: User;
}

interface PostWithUser extends Post {
  user: User;
  _count: {
    answers: number;
    wondering: number;
    hearts: number;
  };
  postCategory: PostCategory;
  answers: AnswerWithUser[];
}

interface CommunityPostResponse {
  ok: boolean;
  post: PostWithUser;
  isWondering: boolean;
  isHeart: boolean;
}

interface AnswerForm {
  answer: string;
}

interface AnswerResponse {
  ok: boolean;
  response: Answer;
}

interface CommunityWithCategory extends PostWithUser {
  post: PostWithUser;
}

const CommunityPostDetail: NextPage<CommunityWithCategory> = ({ post }) => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<AnswerForm>();
  const { data, mutate } = useSWR<CommunityPostResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null
  );
  const [wonder, { loading: wonderLoading }] = useMutation(
    `/api/posts/${router.query.id}/wonder`
  );

  const [heart, { loading: heartLoading }] = useMutation(
    `/api/posts/${router.query.id}/heart`
  );

  const [sendAnswer, { data: answerData, loading: answerLoading }] =
    useMutation<AnswerResponse>(`/api/posts/${router.query.id}/answers`);
  const onWonderClick = () => {
    if (!data) return;
    mutate(
      {
        ...data,
        post: {
          ...data.post,
          _count: {
            ...data.post._count,
            wondering: data.isWondering
              ? data?.post._count.wondering - 1
              : data?.post._count.wondering + 1,
          },
        },
        isWondering: !data.isWondering,
      },
      false
    );
    if (!wonderLoading) {
      wonder({});
    }
  };

  const onHeartClick = () => {
    if (!data) return;
    mutate(
      {
        ...data,
        post: {
          ...data.post,
          _count: {
            ...data.post._count,
            hearts: data.isHeart
              ? data?.post._count.hearts - 1
              : data?.post._count.hearts + 1,
          },
        },
        isHeart: !data.isHeart,
      },
      false
    );
    if (!heartLoading) {
      heart({});
    }
  };

  const onValid = (form: AnswerForm) => {
    if (answerLoading) return;
    sendAnswer(form);
  };
  useEffect(() => {
    if (answerData && answerData.ok) {
      reset();
      mutate();
    }
  }, [answerData, reset, mutate]);
  return (
    <Layout canGoBack>
      <span className="inline-flex  ml-4 items-center px-2.5 py-1 mt-5 mb-2 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {post.postCategory.name}
      </span>
      <div className="flex mb-3 px-4 cursor-pointer pb-3  border-b items-center space-x-3">
        {data?.post?.user?.avatar ? (
          <Image
            src={`https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${data?.post?.user?.avatar}/avatar`}
            className="w-10 h-10 bg-slate-500 rounded-full"
            width={30}
            height={30}
          />
        ) : (
          <div className="w-10 h-10 bg-slate-500 rounded-full" />
        )}
        <div>
          <p className="text-sm font-medium text-gray-700">
            {data?.post?.user?.name}
          </p>
          <p className="text-xs font-medium text-gray-500">
            <span>고강본동 인중 11회</span>{" "}
            {convertTime(post.createdAt.toString())}
          </p>
        </div>
      </div>
      <div>
        <div className="mt-2 px-4 text-gray-700">
          {data?.post?.content}
          {data?.post.image && data?.post?.image?.split(",").length > 0 ? (
            <div className="mt-3">
              <Image
                src={`https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${
                  data.post.image.split(",")[0]
                }/public`}
                alt="post image"
                className={`w-full rounded-md`}
                width={600}
                height={230}
              />
            </div>
          ) : null}

          <span className="text-sm text-gray-500">{`조회 수 ${post.views}`}</span>
        </div>
        <div className="flex justify-between px-3  mt-3 text-gray-700 py-2.5 border-t border-b w-full">
          <button
            onClick={onWonderClick}
            className={cls(
              "flex space-x-2 items-center text-sm",
              data?.isWondering ? "text-teal-600" : ""
            )}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              궁금해요{" "}
              {data?.post?._count?.wondering
                ? data?.post?._count?.wondering
                : null}
            </span>
          </button>
          <span className="flex space-x-2 items-center text-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
            <span>
              답변{" "}
              {data?.post?._count?.answers ? data?.post?._count?.answers : null}
            </span>
          </span>
          <span className="flex space-x-2 items-center text-sm">
            <button
              onClick={onHeartClick}
              className={cls(
                "flex space-x-2 items-center text-sm",
                data?.isHeart ? "text-red-600" : ""
              )}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>
                관심{" "}
                {data?.post?._count?.hearts ? data?.post?._count?.hearts : null}
              </span>
            </button>
          </span>
        </div>
        <div className="border-b-4">
          {post.answers.length > 0 ? (
            post.answers.map((answer) => (
              <div key={answer.id} className="flex items-start space-x-3"></div>
            ))
          ) : (
            <p className=" w-full mb-10 p-20  text-md text-gray-500 text-center">
              아직 답변이 없어요
              <br />
              가장 먼저 댓글을 남겨보세요.
            </p>
          )}
        </div>
        <div className="px-4 my-5 space-y-">
          {data?.post?.answers?.map((answer) => (
            <div key={answer.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full" />
              <div>
                <span className="text-sm block font-medium text-gray-700">
                  {answer.user.name}
                </span>
                <span className="text-xs text-gray-500 block ">
                  {answer.createdAt.toString()}
                </span>
                <p className="text-gray-700 mt-2">{answer.answer} </p>
              </div>
            </div>
          ))}
        </div>
        <form
          className="fixed bottom-0 pb-5 w-full p-4 border-t bg-white"
          onSubmit={handleSubmit(onValid)}
        >
          <div className="flex gap-3">
            <input
              className="w-full rounded-2xl p-3 border outline-none placeholder:text-md"
              type="text"
              placeholder="댓글을 입력해주세요."
            />
            <button className="p-3 bg-orange-500  text-white rounded-full text-sm hover:bg-orange-600">
              {answerLoading ? (
                "Loading..."
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CommunityPostDetail;

export const getServerSideProps = async (context: NextPageContext) => {
  const { id } = context.query;

  const post = await client.post.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: true,
      postCategory: true,
      wondering: true,
      answers: true,
      _count: {
        select: {
          hearts: true,
          answers: true,
          wondering: true,
        },
      },
    },
  });

  console.log(post);

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};
