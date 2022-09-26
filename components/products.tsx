import { convertPrice } from "@libs/client/utils";
import noImage from "public/no-image.png";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

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
            <div className="flex justify-between">
              <h2 className="text-md font-bold text-gray-900">
                {name}님의 판매 상품
              </h2>
              <a onClick={handleClick}>
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
              </a>
            </div>
          ) : (
            <h2 className="text-md font-bold text-gray-900">
              {name}님, 이건 어때요?
            </h2>
          )}
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {products.map((product: Product) => (
              <div key={product.id}>
                <Image
                  width={340}
                  height={270}
                  src={
                    product.image
                      ? `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${product.image}/public `
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
