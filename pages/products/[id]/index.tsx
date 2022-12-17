import type { NextPage, NextPageContext } from "next";
import { Category, Chat, ChatMessage, Product, User } from "@prisma/client";
import { cls, convertPrice, convertTime } from "@libs/client/utils";
import { withSsrSession } from "@libs/server/withSession";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import useUser from "@libs/client/useUser";
import Products from "@components/products";
import client from "@libs/server/client";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

SwiperCore.use([Navigation, Pagination]);

interface ProductWithUser extends Product {
  user: User;
  category: Category;
  _count: {
    favs: number;
  };
}
interface ChatResponse extends Chat {
  purchaser: User;
  chatMessages: ChatMessage[];
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  productChats: ChatResponse[];
  relatedProducts: Product[];
  mySaleProducts: Product[];
  mySaleProductsChats: number;
  isLiked: boolean;
  isChat: boolean;
}

interface ImageResponse {
  url: string;
}

const ItemDetail: NextPage<ItemDetailResponse> = ({
  product,
  productChats,
  relatedProducts,
  mySaleProducts,
  mySaleProductsChats,
  isChat,
}) => {
  const router = useRouter();
  const { data, mutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const { user } = useUser();
  const isSeller = product?.user?.id === user?.id;
  const hasChat = productChats.length > 0;

  const images: ImageResponse[] = [];
  const productImg = product?.image?.split(",");
  productImg.map((img) => {
    images.push({
      url: `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${img}/public`,
    });
  });

  const [state, setState] = useState("Sale");
  const [popup, setPopup] = useState(false);
  const [stateChange, setStateChange] = useState(false);
  const [chatAlert, setChatAlert] = useState(false);
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  const [views] = useMutation(`/api/products/${router.query.id}/views`);
  const [stateUpdate] = useMutation(`/api/products/${router.query.id}/state`);

  const onFavClick = () => {
    if (!data) return;
    mutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    toggleFav({});
  };

  const onBtnClick = () => {
    stateUpdate({ state });
    setPopup(!popup);
  };

  const onSelectChange = (e: any) => {
    setStateChange(true);
    if (e.target.value !== "Sale") {
      setPopup(!popup);
    }
    stateUpdate({ state: e.target.value });
    setState(e.target.value);
  };

  useEffect(() => {
    views({});
  }, [router]);

  return !popup ? (
    <div className="mb-24">
      <Layout canGoBack seoTitle={`${product.name}`}>
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
        >
          {productImg?.map((img, index) => (
            <SwiperSlide key={index}>
              <Image
                key={index}
                src={`https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${img}/public`}
                className="bg-slate-300 object-cover"
                layout="responsive"
                width={560}
                height={450}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="px-4 py-4">
          <div className="mb-0">
            <div className="flex cursor-pointer py-3 -mt-4 border-b items-center justify-between ">
              <div className="flex gap-3 items-center">
                {product.user?.avatar ? (
                  <Image
                    width={48}
                    height={48}
                    src={`https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${product?.user?.avatar}/avatar`}
                    className="w-12 h-12 rounded-full bg-slate-300"
                  />
                ) : (
                  <div className="w-12 h-12 flex justify-center items-center rounded-full bg-gray-300 text-3xl">
                    🙎🏻‍♂️
                  </div>
                )}
                <div className="">
                  <p className="text-sm font-semibold text-gray-700">
                    {product?.user?.name}
                  </p>
                  <Link href={`/users/profiles/${product?.user?.id}`}>
                    <a className="text-xs font-medium text-gray-500">
                      프로필 보기
                    </a>
                  </Link>
                </div>
              </div>
              <div>
                <div className="flex gap-1">
                  <div className="flex flex-col items-end">
                    <h1 className="text-sm text-green-500">{`${
                      product?.user?.temperature
                        ? product?.user.temperature
                        : "36.5"
                    }°`}</h1>
                    <progress
                      className="w-9 h-1"
                      max={100}
                      value={
                        product?.user?.temperature
                          ? product?.user?.temperature?.toString()
                          : "36.5"
                      }
                    />
                  </div>
                  <div className="text-xl">😀</div>
                </div>
                <div className="group relative ">
                  <p className="text-[1px] text-end text-gray-300 underline ">
                    매너온도
                  </p>
                  <p className="absolute top-5 right-1 hidden w-max p-2 text-[1px] rounded-md bg-gray-800 text-white group-hover:block">
                    매너온도는 당근마켓 사용자로부터 받은 칭찬,
                    <br />
                    후기, 비매너 평가, 운영자 제재 등을 종합해서
                    <br />
                    만든 매너 지표에요.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5">
              {isSeller ? (
                <select
                  onChange={onSelectChange}
                  defaultValue={!stateChange ? product.state : state}
                  className="block w-full px-3 py-2.5 mb-3 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="Sale">판매중</option>
                  <option value="Reservation">예약중</option>
                  <option value="Completed">거래완료</option>
                </select>
              ) : null}
              <h1 className="text-2xl font-bold text-gray-900">
                {product?.name}
              </h1>
              <p>
                <span className="text-xs mt-3 text-gray-400">
                  {product?.category.name}ㆍ끌올{" "}
                  {convertTime(product?.createdAt.toString())}
                </span>
              </p>
              <p className="mt-3 text-black">{product?.description}</p>
              <p>
                <span className="text-xs text-gray-400">
                  {product?._count?.favs > 0
                    ? `관심 ${product._count.favs} ∙ `
                    : null}
                  조회 {product?.views}
                </span>
              </p>
            </div>
          </div>
          <Products
            sellerId={product?.user.id}
            products={mySaleProducts}
            name={product?.user.name}
            isMe={true}
          />
          <Products products={relatedProducts} name={user?.name} isMe={false} />
        </div>
        <div className="w-full h-20 fixed bottom-0 bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-300">
            <div className="w-full flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  onClick={onFavClick}
                  className={cls(
                    "p-3 rounded-md flex items-center  border-r",
                    data?.isLiked
                      ? "text-orange-500  hover:text-orange-600"
                      : "text-gray-400  hover:text-gray-500"
                  )}
                >
                  {data?.isLiked ? (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 "
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  )}
                </button>
                <div className="flex justify-center items-center flex-col">
                  <p className="text-md font-semibold text-black">
                    {convertPrice(product?.price)}
                  </p>
                  {product?.nego ? (
                    <Link href={`/users/profiles/${product?.user?.id}`}>
                      <a className="text-xs font-bold text-orange-500 underline">
                        가격 제안하기
                      </a>
                    </Link>
                  ) : (
                    <p className="text-xs text-gray-400 self-start">
                      가격 제안 불가
                    </p>
                  )}
                </div>
              </div>

              <div>
                {product?.user?.id === user?.id ? (
                  <button
                    onClick={() => {
                      mySaleProductsChats <= 0
                        ? setChatAlert(true)
                        : router.push("/chats");
                      setTimeout(() => {
                        setChatAlert(false);
                      }, 2000);
                    }}
                    className="py-2 px-4 rounded-md text-white bg-orange-500"
                  >
                    대화 중인 채팅방
                    {mySaleProductsChats > 0
                      ? `(${mySaleProductsChats})`
                      : null}
                  </button>
                ) : (
                  <button
                    disabled={product.state === "Completed" ? true : false}
                    onClick={() => {
                      router.push({
                        pathname: `${router.asPath}/chat`,
                        query: {
                          productId: product?.id,
                          purchaserId: user?.id,
                        },
                      });
                    }}
                    className={`py-2 px-4 text-white ${
                      product.state === "Completed"
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-orange-400 cursor-pointer"
                    }  rounded-md disabled:text-gray-300`}
                  >
                    {!isChat
                      ? "채팅하기"
                      : product.state === "Completed"
                      ? "거래 완료"
                      : "채팅방으로 이동"}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div
            className={`flex justify-center  ${
              chatAlert ? "block" : "hidden"
            } transition-opacity ease-in-out`}
          >
            <div className="fixed flex justify-center items-center bottom-24 w-3/4 h-12 px-5 rounded-md bg-gray-50 transition-transform">
              채팅한 이웃이 없어요.
            </div>
          </div>
        </div>
      </Layout>
    </div>
  ) : (
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
            productChats.map((chat, index) => (
              <label
                key={index}
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
            onClick={onBtnClick}
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

    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
          temperature: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          favs: true,
        },
      },
    },
  });

  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));

  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
        user: {
          NOT: {
            id: req?.session.user?.id,
          },
        },
      },
    },
  });

  const mySaleProducts = await client.product.findMany({
    where: {
      state: "Sale",
      user: {
        id: product?.user?.id,
      },
      NOT: {
        id: product?.id,
      },
    },
  });

  const mySaleProductsChats = await client.chat.count({
    where: {
      productId: product?.id,
    },
  });

  const isChat = Boolean(
    await client.chat.findFirst({
      where: {
        productId: product?.id,
        purchaserId: req?.session.user?.id,
      },
    })
  );

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
      productChats: JSON.parse(JSON.stringify(productChat)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      mySaleProducts: JSON.parse(JSON.stringify(mySaleProducts)),
      mySaleProductsChats,
      isChat,
    },
  };
});

export default ItemDetail;
