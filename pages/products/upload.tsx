import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import Image from "next/image";
import client from "@libs/server/client";
import NewLayout from "@components/layouts/layout";

interface UploadProductForm {
  name: string;
  price: number;
  description: string;
  photo: FileList;
  nego: boolean;
  share: boolean;
  categoryId: number;
}

interface UploadProductMutation {
  ok: boolean;
  product: Product;
}

interface Category {
  id: number;
  name: string;
}

interface CategoryResponse {
  categories: Category[];
}

const Upload: NextPage<CategoryResponse> = ({ categories }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<UploadProductForm>({ mode: "onChange" });

  const [uploadProduct, { loading, data }] =
    useMutation<UploadProductMutation>("/api/products");
  const onValid = async ({
    name,
    price,
    description,
    nego,
    share,
    categoryId,
  }: UploadProductForm) => {
    if (loading) return;
    if (photo && photo.length > 0) {
      const photoIds = [];
      for (let i = 0; i < photo.length; i++) {
        const form = new FormData();
        const { uploadURL } = await (await fetch(`/api/files`)).json();
        form.append("file", photo[i], name);
        const {
          result: { id },
        } = await (
          await fetch(uploadURL, { method: "POST", body: form })
        ).json();
        photoIds.push(id);
      }
      uploadProduct({
        name,
        price,
        description,
        photoId: photoIds.join(","),
        nego,
        share,
        categoryId,
      });
    } else {
      alert("사진등록은 필수입니다.");
    }
  };
  useEffect(() => {
    if (data?.ok) {
      router.replace(`/products/${data.product.id}`);
    }
  }, [data, router]);
  const photo = watch("photo");
  const [photos, setPhotos] = useState(0);
  const [photoPreview, setPhotoPreview] = useState("");

  const [category, setCategory] = useState({ id: 0, name: "카테고리 선택" });
  const [fade, setFade] = useState(false);
  const fadeInOut = () => setFade(!fade);

  const categoryClick = (category: Category) => {
    setCategory(category);
    setValue("categoryId", category.id);
    fadeInOut();
  };

  const removePhoto = (idx: number) => {
    const newPhotoPreview = photoPreview.split(",");
    newPhotoPreview.splice(idx, 1);
    setPhotos(photos - 1);
    setPhotoPreview(newPhotoPreview.toString());
  };

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

  const content = watch("description");

  const actionBtn = () => {
    return (
      <>
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
      </>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onValid)}>
        <NewLayout
          seoTitle="상품등록"
          title="중고거래 글쓰기"
          actionBar
          backBtn
          actionBtn={actionBtn()}
        >
          <div className="p-4">
            <div className="w-full mb-5 flex overflow-y-hidden">
              <label className=" w-28 h-28 mt-2 cursor-pointer text-gray-600 flex items-center justify-center border border-gray-300 rounded-md">
                <div className="flex flex-col justify-center items-center gap-1">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
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
              {photoPreview ? (
                <div className="flex mt-2 items-center ml-3 gap-3">
                  {photoPreview.split(",").map((photo, idx) => (
                    <div className="w-28 h-28 relative" key={idx}>
                      <Image
                        alt="이미지를 불러올 수 없습니다:("
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
                        className="absolute w-6 h-6 flex justify-center items-center text-xs bg-white rounded-full -top-2 -right-3 border border-gray-300 cursor-pointer 
                    "
                        onClick={() => removePhoto(idx)}
                      >
                        <svg
                          className="w-5 h-5"
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
            </div>

            <div className="w-full border-0 border-t border-gray-300 py-5 px-2">
              <input
                type="text"
                className="outline-none w-full "
                placeholder="글 제목"
                {...register("name", {
                  required: {
                    value: true,
                    message: "제목을 입력해주세요.",
                  },
                  minLength: {
                    value: 5,
                    message: "제목은 5자 이상 입력해주세요.",
                  },
                  maxLength: {
                    value: 50,
                    message: "제목은 50자 이하로 입력해주세요.",
                  },
                })}
              />

              {errors.name?.message && (
                <span className="text-red-500 text-sm">
                  {errors.name?.message}
                </span>
              )}
            </div>
            <div
              className="w-full border-0 border-t border-gray-300 py-5 px-2 flex justify-between"
              onClick={fadeInOut}
            >
              <span className="font-semibold">{category.name}</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>

            <div className="w-full border-0 border-t border-gray-300 py-5 px-2 flex  justify-between">
              <div className="flex flex-col">
                <input
                  className="outline-none w-4/5 "
                  type={"number"}
                  placeholder="₩ 가격 (선택사항)"
                  {...register("price", {
                    required: {
                      value: true,
                      message: "가격을 입력해주세요.",
                    },
                    maxLength: {
                      value: 10,
                      message: "최대 10자리까지 입력 가능합니다.",
                    },
                    pattern: {
                      value: /^[0-9]*$/,
                      message: "숫자만 입력 가능합니다.",
                    },
                    validate: (value) => {
                      console.log(value);

                      if (value.toString().length > 12) {
                        return value.toString().substring(0, 12);
                      }

                      if (value < 0) {
                        return "0원 이상 입력해주세요.";
                      }
                      return true;
                    },
                  })}
                />
                {errors.price?.message && (
                  <span className="text-red-500 text-sm">
                    {errors.price?.message}
                  </span>
                )}
              </div>
              <label className="flex justify-end items-center gap-3 font-semibold w-1/5">
                <input
                  {...register("share")}
                  type="checkbox"
                  className="h-5 w-5 accent-orange-500"
                />
                나눔
              </label>
            </div>

            <div className="w-full border-0 border-t border-gray-300 py-5 px-2 flex justify-between flex-col gap-7">
              <label className="flex items-center gap-3 font-semibold">
                <input
                  {...register("nego")}
                  type="checkbox"
                  className="h-5 w-5 accent-orange-500"
                />
                가격 제안받기
              </label>
              {errors.description?.message && (
                <span className="text-red-500 text-sm">
                  {errors.description?.message}
                </span>
              )}
              <textarea
                {...register("description", {
                  required: {
                    value: true,
                    message: "내용을 입력해주세요.",
                  },
                })}
                placeholder={`- 구매시기\n- 사용 여부 (미개봉, 00회, 00개월 사용 등)\n- 정확한 제품명, 음반명\n- 브랜드 및 모델명\n- 사용감 (흠집, 파손 여부, 상세사진)\n※게임, OTT 서비스 등의 계정 및 계정 정보는 공유 하거나 판매할 수 없어요.\n\n신뢰할 수 있는 거래를 위해 자세한 정보를 제공해주세요. 과학기술정보통신부, 한국인터넷진흥원과 함께 해요.`}
                rows={15}
                className="outline-none resize-none"
              />
            </div>
          </div>
        </NewLayout>
      </form>
      <div>
        {fade ? (
          <div className="fixed top-0 left-0 w-full h-full overflow-y-scroll bg-white z-10">
            <div className=" w-full h-14 max-w-xl px-10 flex justify-center items-center fixed top-0 text-lg font-medium text-gray-800  bg-white border-b">
              <button onClick={fadeInOut} className="absolute left-4">
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
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>
              <span
                className="mx-auto"
                {...register("categoryId", { value: category.id })}
              >
                카테고리 선택
              </span>
            </div>
            <div className="w-full mt-[56px]">
              {categories.map((categorie, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 border-b cursor-pointer"
                  onClick={() => {
                    categoryClick(categorie);
                  }}
                >
                  <div
                    className={`${
                      categorie.id === category.id ? "text-orange-500" : ""
                    }`}
                  >
                    {categorie.name}
                  </div>
                  <div>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke={`${
                        categorie.id === category.id ? "orange" : "transparent"
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  const categories = await client.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
};

export default Upload;
