import type { NextPage } from "next";
import useMutation from "@libs/client/useMutation";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import useCoords from "@libs/client/useCoords";

interface WriteForm {
  content: string;
}

interface WriteResponse {
  ok: boolean;
  post: Post;
}

const categories = [
  { id: 1, name: "동네질문" },
  { id: 2, name: "동네사건사고" },
  { id: 3, name: "겨울간식" },
  { id: 4, name: "동네소식" },
  { id: 5, name: "동네맛집" },
  { id: 6, name: "취미생활" },
  { id: 7, name: "일상" },
  { id: 8, name: "분실/실종센터" },
  { id: 9, name: "해주세요" },
  { id: 10, name: "동네사진전" },
];

const Write: NextPage = () => {
  const { latitude, longitude } = useCoords();
  const router = useRouter();
  const { register, handleSubmit, getValues, watch } = useForm<WriteForm>();
  const [post, { loading, data }] = useMutation<WriteResponse>("/api/posts");
  const onValid = (data: WriteForm) => {
    if (loading) return;
    post({ ...data, latitude, longitude });
  };
  const [category, setCategory] = useState({
    id: 0,
    name: "게시글의 주제를 선택해 주세요.",
  });

  const content = watch("content");

  useEffect(() => {
    console.log(content);
  }, [content]);

  const [notice, setNotice] = useState(true);
  const [fade, setFade] = useState(false);
  const fadeInOut = () => setFade(!fade);

  const categoryClick = (category: any) => {
    setCategory(category);
    // setValue("categoryId", category.id);
    fadeInOut();
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/community/${data.post.id}`);
    }
  }, [data, router]);

  useEffect(() => {}, [category]);
  return (
    <>
      <Layout noActionBar>
        <form onSubmit={handleSubmit(onValid)}>
          <div className=" w-full h-14 flex justify-between items-center fixed top-0  text-lg font-medium text-gray-800  bg-white border-b px-5">
            <button onClick={() => router.back()}>
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
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <span className="font-semibold">동네생활 글쓰기</span>
            <button
              disabled={loading || category.id === 0 || !content}
              className={
                category.id === 0 || !content
                  ? `text-gray-300 cursor-not-allowed`
                  : `text-orange-500 cursor-pointer`
              }
            >
              {loading ? "Loading..." : "완료"}
            </button>
          </div>

          <div
            className="flex justify-between items-center w-full p-5 mt-2 border-b"
            onClick={fadeInOut}
          >
            <span className="font-normal">{category.name}</span>
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {notice && (
            <div className=" m-4 p-5 rounded-md bg-orange-50 text-sm">
              <div className="flex justify-between items-center">
                <p className=" font-semibold">글 작성하기 전에 알려드려요.</p>
                <svg
                  onClick={() => setNotice(false)}
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="my-2">
                중고거래 관련, 명예훼손, 광고/홍보 목적의 글은 올리실 수 없어요.
              </p>
              <p className="my-2 text-xs underline">동네생활 운영정책</p>
            </div>
          )}
          <div className="px-5 py-2">
            <textarea
              {...register("content", {
                required: "제목을 입력해주세요.",
                maxLength: {
                  value: 50,
                  message: "제목은 50자 이내로 입력해주세요.",
                },
              })}
              placeholder={`신월7동 우리 동네 관련된 질문이나 이야기를 해보세요.`}
              className="w-full outline-none resize-none placeholder:text-gray-300"
              rows={15}
            />
          </div>
        </form>
      </Layout>
      <div>
        {fade ? (
          <div
            className="fixed top-0 left-0 w-full h-screen bg-transparent  overflow-y-scroll z-10"
            onClick={fadeInOut}
          >
            <div className="h-1/3 bg-slate-500 opacity-40"></div>
            <div className="h-2/3 border-t-2 bg-white opacity-100 rounded-t-3xl">
              <div className="px-5 py-7 text-lg font-semibold">
                게시글의 주제를 선택해 주세요.
              </div>
              <div className="w-full px-5 py-2 bg-gray-100 text-sm text-gray-500 font-semibold">
                기본 주제
              </div>
              {categories.map((categorie, idx) =>
                idx < 2 ? (
                  <div
                    key={idx}
                    className="flex items-center space-x-3  px-5 py-4 cursor-pointer"
                    onClick={() => {
                      categoryClick(categorie);
                    }}
                  >
                    {categorie.id === category.id ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke={`${
                          categorie.id === category.id
                            ? "orange"
                            : "transparent"
                        }`}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    ) : null}
                    <div
                      className={`${
                        categorie.id === category.id ? "text-orange-500" : ""
                      }`}
                    >
                      {categorie.name}
                    </div>
                  </div>
                ) : null
              )}
              <div className="w-full px-5 py-2 bg-gray-100 text-sm text-gray-500 font-semibold">
                내 관심 주제
              </div>
              {categories.map((categorie, idx) =>
                idx > 2 ? (
                  <div
                    key={idx}
                    className="flex items-center space-x-3  px-5 py-4 cursor-pointer"
                    onClick={() => {
                      categoryClick(categorie);
                    }}
                  >
                    {categorie.id === category.id ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke={`${
                          categorie.id === category.id
                            ? "orange"
                            : "transparent"
                        }`}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    ) : null}
                    <div
                      className={`${
                        categorie.id === category.id ? "text-orange-500" : ""
                      }`}
                    >
                      {categorie.name}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Write;
