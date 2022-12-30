import { convertPrice, convertTime } from "@libs/client/utils";
import ProductImage from "./product-image";

interface ProductProps {
  image: string;
  name: string;
  createdAt: string;
  price: number;
  isSoldTab?: boolean;
}

export default function Product({
  image,
  name,
  createdAt,
  price,
  isSoldTab,
}: ProductProps) {
  return (
    <>
      <div className="flex gap-3 p-3 ">
        <div className="flex justify-start items-center w-1/5">
          <ProductImage url={image} width={200} height={200} />
        </div>
        <div className="flex flex-col w-4/5 px-3">
          <div className="flex justify-between">
            <p>{name}</p>
            <svg
              className="w-5 h-5 text-gray-400"
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
          </div>
          <p className="text-sm text-gray-500">{convertTime(createdAt)}</p>
          <p className="font-semibold">{convertPrice(price)}</p>
          <p className="self-end">
            <svg
              className="w-5 h-5 text-gray-400"
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
          </p>
        </div>
      </div>

      {isSoldTab && (
        <div className="grid grid-cols-3 w-full divide-x-2 text-center text-sm font-semibold border-t-2 border-b-4">
          <button className="px-10 py-2.5">끌어올리기</button>
          <button className="px-10 py-2.5">예약중</button>
          <button className="px-10 py-2.5">거래완료</button>
        </div>
      )}
    </>
  );
}
