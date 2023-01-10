import { cls } from "@libs/client/utils";
import Image from "next/image";
import Link from "next/link";
import noImage from "public/no-image.png";

interface ItemProps {
  id: number;
  title: string;
  price: number;
  hearts: number;
  image?: string;
  state: string;
  createdAt: string;
  chats: number;
}

export default function Item({
  id,
  title,
  price,
  hearts,
  image,
  state,
  createdAt,
  chats,
}: ItemProps) {
  return (
    <Link href={`/products/${id}`}>
      <a className="flex px-4 pt-5 cursor-pointer justify-between">
        <div className="flex space-x-4 ">
          <Image
            alt="이미지를 불러올 수 없습니다:("
            width={120}
            height={114}
            src={
              image
                ? `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${
                    image.split(",")[0]
                  }/avatar`
                : noImage
            }
            className={cls(
              `w-12 h-12 rounded-md ${image ? " bg-slate-300" : ""}`
            )}
          />
          <div className="flex flex-col gap-1 pt-1">
            <h3 className="text-sm font-semibold text-gray-900">{title} </h3>
            <h5 className="text-sm text-gray-400">{createdAt}</h5>
            <div
              className={`${
                state !== "Sale"
                  ? "flex justify-center items-center py-1 space-x-1"
                  : ""
              } text-bold`}
            >
              {state === "Reservation" ? (
                <span className="px-2 py-1 bg-green-500 text-xs text-white rounded-md">
                  예약중
                </span>
              ) : null}
              <span className="  text-gray-900">
                {price.toLocaleString("ko-KR")}원
              </span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2 items-end justify-end">
          {hearts > 0 ? (
            <div className="flex space-x-0.5 items-center text-sm  text-gray-600">
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
              <span>{hearts}</span>
            </div>
          ) : null}
          {chats > 0 ? (
            <div className="flex space-x-0.5 items-center text-sm  text-gray-600">
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
              {chats}
            </div>
          ) : null}
        </div>
      </a>
    </Link>
  );
}
