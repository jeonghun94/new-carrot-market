import type { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Answer, Post, PostCategory, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls, convertTime, scrollToBottom } from "@libs/client/utils";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Image from "next/image";
import client from "@libs/server/client";
import useUser from "@libs/client/useUser";
import Layout from "@components/layouts/layout";
import UserAvartar from "@components/user/avatar";

interface AnswerWithUser extends Answer {
  user: User;
}

interface PostWithUser extends Post {
  user: User;
  postCategory: PostCategory;
  answers: AnswerWithUser[];
  _count: {
    wondering: number;
    answers: number;
    hearts: number;
  };
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
  answer: AnswerWithUser;
}

interface CommunityWithCategory extends PostWithUser {
  post: PostWithUser;
}

const CommunityPostDetail: NextPage<CommunityWithCategory> = ({ post }) => {
  const router = useRouter();
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnswerForm>();
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

  const [answers, setAnswers] = useState(post.answers);
  const [orderBy, setOrderBy] = useState("asc");

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

  const onValid = (data: AnswerForm) => {
    if (answerLoading) return;
    sendAnswer(data);
  };

  const orderbyAnswer = async () => {
    await fetch(`/api/posts/${router.query.id}/answers/orderby`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderBy }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAnswers(data.answers);
      });
  };

  useEffect(() => {
    orderbyAnswer();
  }, [orderBy]);

  useEffect(() => {
    if (answerData && answerData.ok) {
      reset();
      mutate();
      setAnswers([...answers, answerData.answer]);
      scrollToBottom();
    }
  }, [answerData, reset, mutate]);

  return (
    <Layout seoTitle={`${post.content}`} actionBar backBtn homeBtn>
      <span className="inline-flex  ml-4 items-center px-2.5 py-1 mt-5 mb-2 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {post.postCategory.name}
      </span>
      <div className="flex mb-3 px-4 cursor-pointer pb-3  border-b items-center space-x-3">
        <UserAvartar
          avatar={String(data?.post?.user?.avatar)}
          defaultImageSize={10}
          imageSize={40}
        />
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
        <div className="flex justify-between px-7 mt-3 text-gray-700 py-2.5 border-t border-b w-full">
          <button
            onClick={onWonderClick}
            className={cls(
              "flex space-x-2 items-center text-sm",
              data?.isWondering ? "text-orange-600" : ""
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
                data?.isHeart ? "text-orange-600" : ""
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
        <div className="mb-20 ">
          {answers.length > 0 ? (
            <div className="pl-4 py-2 space-x-3 text-xs flex">
              {[
                {
                  id: 1,
                  name: "등록순",
                  value: "asc",
                },
                {
                  id: 2,
                  name: "최신순",
                  value: "desc",
                },
              ].map((order) => (
                <button
                  key={order.id}
                  className={cls(
                    "flex items-center outline-none",
                    orderBy === order.value ? "text-black" : "text-gray-300"
                  )}
                  onClick={() => setOrderBy(order.value)}
                >
                  <span
                    className={cls(
                      "mr-1 text-xl bordr",
                      orderBy === order.value
                        ? "text-orange-500"
                        : "text-gray-500"
                    )}
                  >
                    ·
                  </span>
                  <span className={"text-xs"}>{order.name}</span>
                </button>
              ))}
            </div>
          ) : null}
          {answers.length > 0 ? (
            answers.map((answer, index) => (
              <div key={index} className="w-full p-3 space-x-3 border">
                <div className="flex gap-3 items-start">
                  <div className="w-1/12">
                    {answer.user?.avatar ? (
                      <Image
                        alt="이미지를 불러올 수 없습니다:("
                        src={`https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${answer.user?.avatar}/avatar`}
                        className="w-16 h-16 rounded-full "
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div className="w-8 h-8 flex justify-center items-center rounded-full bg-gray-300 text-2xl">
                        🙎🏻‍♂️
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col w-11/12">
                    <p className="text-sm flex items-center">
                      {answer.user?.name}
                      {user?.id === answer.userId ? (
                        <span className="ml-1 px-1  border-[1.5px] rounded-sm text-xs text-gray-500">
                          작성자
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-gray-500">
                      신월동 · {convertTime(answer.createdAt.toString())}
                    </p>
                    <div>{answer.answer}</div>
                  </div>
                </div>
              </div>
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
              {...register("answer", {
                required: {
                  value: true,
                  message: "댓글 입력은 필수입니다.",
                },
                maxLength: {
                  value: 100,
                  message: "댓글은 100자 이내로 입력해주세요.",
                },
              })}
            />
            <button className="p-3 bg-orange-500  text-white rounded-full text-sm hover:bg-orange-600">
              {answerLoading ? (
                "Loading..."
              ) : (
                <svg
                  className="w-6 h-6 rounded-full"
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
          {errors.answer?.message && (
            <p className="text-red-500 text-sm text-center pt-3">
              {errors.answer?.message}
            </p>
          )}
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
      answers: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      _count: {
        select: {
          hearts: true,
          answers: true,
          wondering: true,
        },
      },
    },
  });

  if (post) {
    await client.post.update({
      where: {
        id: post.id,
      },
      data: {
        views: post.views + 1,
      },
    });
  }

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};
