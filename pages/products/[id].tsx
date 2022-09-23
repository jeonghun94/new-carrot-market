import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { cls, convertPrice, convertTime } from "@libs/client/utils";
import useMutation from "@libs/client/useMutation";
import { Product, User } from "@prisma/client";
import useSWR, { useSWRConfig } from "swr";
import useUser from "@libs/client/useUser";
import noImage from "public/no-image.png";
import client from "@libs/server/client";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Products from "@components/products";

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
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  const onFavClick = () => {
    if (!data) return;
    boundMutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    // mutate("/api/users/me", (prev: any) => ({ ok: !prev.ok }), false);
    toggleFav({});
  };
  if (router.isFallback) {
    return (
      <Layout title="Loaidng for youuuuuuu">
        <h1 className="flex justify-center items-center">Wait a Seconds</h1>
      </Layout>
    );
  }
  return (
    <Layout canGoBack seoTitle="Product Detail">
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
              조회 10
            </span>
          </div>
        </div>
        {/* <Products /> */}
        {mySaleProducts.length > 0 ? (
          <div className="border-t border-gray-200 pt-5 mt-5">
            <div className="flex justify-between">
              <h2 className="text-md font-bold text-gray-900">
                {user?.name}님의 판매 상품
              </h2>
              <h2>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </h2>
            </div>
            <div className=" mt-6 grid grid-cols-2 gap-4">
              {mySaleProducts?.map((product) => (
                <div key={product.id}>
                  <Image
                    width={340}
                    height={240}
                    src={
                      product.image
                        ? `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${product.image}/public `
                        : noImage
                    }
                    className="rounded-md"
                  />
                  <h3 className="text-gray-700 my-2">{product.name}</h3>
                  <span className="-mt-1 mb-2 text-sm font-bold text-gray-900">
                    {convertPrice(product?.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {relatedProducts.length > 0 ? (
          <div className="border-t border-gray-200 pt-5 mt-5">
            <h2 className="text-md font-bold text-gray-900">
              {product?.user.name}님, 이건 어때요?
            </h2>
            <div className=" mt-6 grid grid-cols-2 gap-4">
              {relatedProducts?.map((product) => (
                <div key={product.id}>
                  <div className="h-56 w-full mb-4 bg-slate-300" />
                  <h3 className="text-gray-700 -mb-1">{product.name}</h3>
                  <span className="text-sm font-medium text-gray-900">
                    {convertPrice(product?.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="w-full h-20 fixed bottom-0 bg-white">
        <div>
          <div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-300">
              <div className="w-full flex items-center justify-between ">
                <div className="flex gap-4">
                  <button
                    onClick={onFavClick}
                    className={cls(
                      "p-3 rounded-md flex items-center hover:bg-gray-100 justify-center  border-r border-gray-200 ",
                      isLiked
                        ? "text-red-500  hover:text-red-600"
                        : "text-gray-400  hover:text-gray-500"
                    )}
                  >
                    {isLiked ? (
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
                  <div className="flex items-start flex-col justify-start">
                    <p className="text-md font-semibold text-black">
                      {convertPrice(product?.price)}
                    </p>
                    <Link href={`/users/profiles/${product?.user?.id}`}>
                      <a className="text-xs font-bold text-orange-500 underline">
                        가격 제안하기
                      </a>
                    </Link>
                  </div>
                </div>

                <div>
                  <button className="py-2 px-4 text-white bg-orange-500 rounded-md">
                    채팅하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx?.params?.id) {
    return {
      props: {},
    };
  }

  const product = await client.product.findUnique({
    where: {
      id: +ctx.params.id.toString(),
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

  console.log(product);
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
      },
    },
  });

  const mySaleProducts = await client.product.findMany({
    where: {
      user: {
        id: product?.user?.id,
      },
      NOT: {
        id: product?.id,
      },
    },
  });

  const isLiked = false;
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      mySaleProducts: JSON.parse(JSON.stringify(mySaleProducts)),
      isLiked,
    },
  };
};

export default ItemDetail;
