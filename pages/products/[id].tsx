import type { NextPage, NextPageContext } from "next";
import { cls, convertPrice, convertTime } from "@libs/client/utils";
import useMutation from "@libs/client/useMutation";
import { Product, User } from "@prisma/client";
import useSWR, { useSWRConfig } from "swr";
import useUser from "@libs/client/useUser";
import client from "@libs/server/client";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Products from "@components/products";
import { withSsrSession } from "@libs/server/withSession";
import { useEffect } from "react";

interface ProductWithUser extends Product {
  user: User;
  _count: {
    favs: number;
  };
}
interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  mySaleProducts: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage<ItemDetailResponse> = ({
  product,
  relatedProducts,
  mySaleProducts,
  isLiked,
}) => {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );

  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  const [views] = useMutation(`/api/products/${router.query.id}/views`);

  const onFavClick = () => {
    if (!data) return;
    mutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    toggleFav({});
  };

  useEffect(() => {
    views({});
  }, [router]);

  if (router.isFallback) {
    return (
      <Layout title="Loaidng for youuuuuuu">
        <h1 className="flex justify-center items-center">Wait a Seconds</h1>
      </Layout>
    );
  }
  return (
    <div className="mb-24">
      <Layout canGoBack seoTitle={`${product.name}`}>
        <div className="relative pb-96">
          <Image
            src={`https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${product.image}/public`}
            className="bg-slate-300 object-cover"
            layout="fill"
          />
        </div>
        <div className="px-4 py-4">
          <div className="mb-0">
            <div className="flex cursor-pointer py-3 -mt-4 border-b items-center justify-between ">
              <div className="flex gap-3 items-center">
                <Image
                  width={48}
                  height={48}
                  src={`https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${product?.user?.avatar}/avatar`}
                  className="w-12 h-12 rounded-full bg-slate-300"
                />
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
                    <h1 className="text-sm text-green-500">{`${product?.user.temperature}°`}</h1>
                    <progress
                      className="w-9 h-1"
                      max={100}
                      value={product?.user?.temperature?.toString()}
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
              <h1 className="text-2xl font-bold text-gray-900">
                {product?.name}
              </h1>
              <span className="text-xs mt-3 text-gray-400">
                디지털/기기ㆍ끌올 {convertTime(product?.createdAt.toString())}
              </span>
              <p className="mt-3 text-black">{product?.description}</p>
              <span className="text-xs text-gray-400">
                {product?._count?.favs > 0
                  ? `관심 ${product._count.favs} ∙ `
                  : null}
                조회 {product?.views}
              </span>
            </div>
          </div>
          <Products
            products={mySaleProducts}
            isMe={true}
            name={product?.user.name}
            sellerId={product?.user.id}
          />
          <Products products={relatedProducts} isMe={false} name={user?.name} />
        </div>
        <div className="w-full h-20 fixed bottom-0 bg-white">
          <div>
            <div>
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
                    <button
                      disabled={!product.status ? true : false}
                      className={`py-2 px-4 text-white ${
                        product.status ? "bg-orange-500" : "bg-gray-400"
                      }  rounded-md disabled:text-gray-300`}
                    >
                      채팅하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
  query,
}: NextPageContext) {
  const product = await client.product.findUnique({
    where: {
      // @ts-ignore
      id: +query.id,
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
      status: true,
      user: {
        id: product?.user?.id,
      },
      NOT: {
        id: product?.id,
      },
    },
  });

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      mySaleProducts: JSON.parse(JSON.stringify(mySaleProducts)),
      isLiked: false,
    },
  };
});

export default ItemDetail;
