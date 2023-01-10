import React from "react";
import { useRouter } from "next/router";
import { Product } from "@prisma/client";
import { convertPrice } from "@libs/client/utils";
import noImage from "public/no-image.png";
import Image from "next/image";

export default function Products({
  products,
  isMe,
  name,
  sellerId,
}: {
  products: Product[];
  isMe: boolean;
  name?: string;
  sellerId?: number;
}) {
  const router = useRouter();
  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    router.push({
      pathname: "/products/history",
      query: { sellerId },
    });
  };

  return (
    <>
      {products?.length > 0 ? (
        <div className="border-t border-gray-200 pt-5 mt-5">
          {isMe ? (
            <div
              className="flex justify-between cursor-pointer"
              onClick={handleClick}
            >
              <h2 className="text-md font-bold text-gray-900">
                {name}님의 판매 상품
              </h2>
              <a>
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
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </a>
            </div>
          ) : (
            <h2 className="text-md font-bold text-gray-900">
              {name}님, 이건 어때요?
            </h2>
          )}
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {products.map((product: Product) => (
              <div
                key={product.id}
                className="cursor-pointer"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                <Image
                  alt="이미지를 불러올 수 없습니다:("
                  width={340}
                  height={270}
                  src={
                    product.image
                      ? `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${
                          product.image.split(",")[0]
                        }/public `
                      : noImage
                  }
                  className="rounded-md"
                />
                <h3 className="text-gray-700 my-2">{product.name}</h3>
                <span className="text-sm font-medium text-gray-900">
                  {convertPrice(product.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
