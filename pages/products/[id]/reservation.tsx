import type { NextPage, NextPageContext } from "next";
import { Category, Product, User } from "@prisma/client";
import client from "@libs/server/client";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import Link from "next/link";
import { withSsrSession } from "@libs/server/withSession";
import useUser from "@libs/client/useUser";
import Image from "next/image";

interface ProductWithUser extends Product {
  user: User;
  category: Category;
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
}

const Reservation: NextPage<ItemDetailResponse> = ({ product }) => {
  const router = useRouter();
  const { user } = useUser();

  console.log(product);

  return (
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
        <div className=" flex flex-col items-center justify-center h-3/4">
          <div className="flex flex-col justify-center items-center gap-2 text-gray-400">
            <p>이 게시글에서 대화한 이웃이 없어요.</p>
            <p className="underline">최근 채팅 목록에서 예약자 찾기</p>
          </div>
        </div>
        <div className="border-t border-gray-200 h-0.5/4 p-4 pb-8">
          <button className=" w-full py-3 rounded-md bg-gray-100 text-gray-400 text-lg cursor-pointer">
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
    },
  });

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
});

export default Reservation;
