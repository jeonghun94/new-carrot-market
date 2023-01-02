import type { NextPage, NextPageContext } from "next";
import useMutation from "@libs/client/useMutation";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Post, PostCategory } from "@prisma/client";
import { useRouter } from "next/router";
import useCoords from "@libs/client/useCoords";
import Image from "next/image";

interface WriteForm {
  content: string;
  photo: FileList;
}

interface WriteResponse {
  ok: boolean;
  post: Post;
}

interface PageResponse extends PostCategory {
  categories: PostCategory[];
}

const Write: NextPage<PageResponse> = ({ categories }) => {
  const router = useRouter();
  const { latitude, longitude } = useCoords();
  const { register, handleSubmit, watch } = useForm<WriteForm>();
  const [post, { loading, data }] = useMutation<WriteResponse>("/api/posts");
  const onValid = async (data: WriteForm) => {
    if (loading) return;
    const photoIds = [];
    if (photo.length > 0) {
      for (let i = 0; i < photo.length; i++) {
        const form = new FormData();
        const { uploadURL } = await (await fetch(`/api/files`)).json();
        form.append("file", photo[i], "community");
        const {
          result: { id },
        } = await (
          await fetch(uploadURL, { method: "POST", body: form })
        ).json();
        photoIds.push(id);
      }
    }

    post({
      ...data,
      latitude,
      longitude,
      postCategoryId: category.id,
      image: photoIds.join(","),
    });
  };
  const [category, setCategory] = useState({
    id: 0,
    name: "게시글의 주제를 선택해 주세요.",
  });

  const content = watch("content");

  const photo = watch("photo");
  const [photos, setPhotos] = useState(0);
  const [photoPreview, setPhotoPreview] = useState("");

  const [notice, setNotice] = useState(true);
  const [fade, setFade] = useState(false);
  const fadeInOut = () => setFade(!fade);

  const categoryClick = (category: any) => {
    setCategory(category);
    // setValue("categoryId", category.id);
    fadeInOut();
  };

  const removePhoto = (idx: number) => {
    const newPhotoPreview = photoPreview.split(",");
    newPhotoPreview.splice(idx, 1);
    setPhotos(photos - 1);
    setPhotoPreview(newPhotoPreview.toString());
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/community/${data.post.id}`);
    }
  }, [data, router]);

  useEffect(() => {
    const files = [];
    if (photo && photo.length > 0) {
      for (let i = 0; i < photo.length; i++) {
        files.push(URL.createObjectURL(photo[i]));
      }
      setPhotos(photo.length);
      setPhotoPreview(files.toString());
    }
  }, [photo]);

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
                loading || category.id === 0 || !content
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
            <div
              className={`mx-4 my-6 ${
                photoPreview ? `-mb-1` : null
              }  p-5 rounded-md bg-orange-50 text-sm`}
            >
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
            {photoPreview ? (
              <div className="flex my-5 items-center ml-3 gap-3">
                {photoPreview.split(",").map((photo, idx) => (
                  <div className="w-20 h-20 mr-3 relative" key={idx}>
                    <Image
                      src={photo}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                    {idx === 0 && (
                      <div className="absolute w-full h-6 bottom-0 flex justify-center items-center text-sm bg-black text-white rounded-bl-md rounded-br-md">
                        대표 사진
                      </div>
                    )}
                    <div
                      className="absolute w-6 h-6 flex justify-center items-center text-xs rounded-full -top-2 -right-3 border-gray-300 cursor-pointer bg-gray-700 
                    "
                      onClick={() => removePhoto(idx)}
                    >
                      <svg
                        className="w-5 h-5 text-white"
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
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            <textarea
              {...register("content", {
                required: "제목을 입력해주세요.",
                maxLength: {
                  value: 500,
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
      <div className="fixed bottom-0 w-full p-5 border-t">
        <label className="text-gray-600 cursor-pointer">
          <div className="flex justify-start items-center gap-1">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p>{photos}/10</p>
          </div>
          <input
            {...register("photo")}
            multiple
            accept="image/*"
            className="hidden"
            type="file"
          />
        </label>
      </div>
    </>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const categories = await client?.postCategory.findMany();

  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
};

export default Write;
