import useMutation from "@libs/client/useMutation";
import { convertPrice, convertTime } from "@libs/client/utils";
import Link from "next/link";
import { ProductWithCount } from "pages/profile/sold";
import { useEffect, useState } from "react";
import ProductImage from "./product-image";

interface ProductProps {
  id: number;
  image: string;
  name: string;
  createdAt: string;
  price: number;
  chats?: number;
  favs?: number;
  isSoldTab?: boolean;
  isLoved?: boolean;
  state?: string;
  setItems: (value: ProductWithCount[]) => void;
  border?: boolean;
  etcBtn?: boolean;
}

interface PageResponse {
  ok: boolean;
  products: ProductWithCount[];
}

export default function Product({
  id,
  image,
  name,
  createdAt,
  price,
  chats,
  favs,
  isSoldTab,
  isLoved,
  state,
  setItems,
  border,
  etcBtn,
}: ProductProps) {
  const [stateUpdate, { data, loading }] = useMutation<PageResponse>(
    `/api/products/${id}/state`
  );

  useEffect(() => {
    if (data && data.ok) {
      setItems(data.products);
    }
  }, [data]);

  const switchState = (state: string) => {
    switch (state) {
      case "Hide":
        return (
          <>
            <button
              className="px-10 py-2.5"
              onClick={() => stateUpdate({ state: "Hide" })}
            >
              숨기기 해제
            </button>
          </>
        );
      case "Reservation":
        return (
          <>
            <button
              className="px-10 py-2.5"
              onClick={() => stateUpdate({ state: "Sale" })}
            >
              판매중
            </button>
            <button
              className="px-10 py-2.5"
              onClick={() => stateUpdate({ state: "Completed" })}
            >
              거래완료
            </button>
          </>
        );
      case "Completed":
        return (
          <>
            <button className="px-10 py-2.5">보낸 후기 보기</button>
          </>
        );
      default:
        return (
          <>
            <button className="px-10 py-2.5">끌어올리기</button>
            <button
              className="px-10 py-2.5"
              onClick={() => stateUpdate({ state: "Reservation" })}
            >
              예약중
            </button>
            <button
              className="px-10 py-2.5"
              onClick={() => stateUpdate({ state: "Completed" })}
            >
              거래완료
            </button>
          </>
        );
    }
  };

  return (
    <>
      <Link href={`/products/${id}`}>
        <a>
          <div className={`flex gap-1 p-3 ${border ? "border-b" : ""}`}>
            <div className="flex justify-start items-center w-1/5">
              <ProductImage url={image} width={200} height={200} />
            </div>
            <div className="flex flex-col w-4/5 px-3">
              <div className="flex justify-between">
                <p>{name}</p>
                <div className="flex items-center">
                  {etcBtn && (
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  )}
                  {isLoved && (
                    <svg
                      className="w-4 h-4 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500">{convertTime(createdAt)}</p>
              <p className="font-semibold space-x-1">
                {state === "Completed" && (
                  <span className="px-2 py-1 bg-gray-200 text-xs font-semibold rounded-sm">
                    거래완료
                  </span>
                )}
                {state === "Reservation" && (
                  <span className="px-2 py-1 bg-green-600 text-xs text-white font-semibold rounded-sm">
                    예약중
                  </span>
                )}
                <span>{convertPrice(price)}</span>
              </p>
              <div className="flex self-end gap-1 text-gray-600">
                {Number(favs) > 0 && (
                  <div className="flex items-center gap-1">
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
                    <span className="text-sm">{favs}</span>
                  </div>
                )}
                {Number(chats) > 0 && (
                  <div className="flex items-center gap-1">
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="text-sm">{chats}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </a>
      </Link>
      {isSoldTab && (
        <div
          className={`grid grid-cols-${
            state === "Sale"
              ? "3"
              : state === "Reservation"
              ? "2"
              : state === "Completed"
              ? "1"
              : "1"
          } w-full divide-x-2 text-center text-sm font-semibold border-t-2 border-b-4`}
        >
          {switchState(String(state))}
        </div>
      )}
    </>
  );
}
