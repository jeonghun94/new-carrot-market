import type { NextPage, NextPageContext } from "next";
import { Category, Product, User } from "@prisma/client";
import client from "@libs/server/client";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import Link from "next/link";
import { withSsrSession } from "@libs/server/withSession";
import useUser from "@libs/client/useUser";

interface ProductWithUser extends Product {
  user: User;
  category: Category;
  _count: {
    favs: number;
  };
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
}

const ItemDetail: NextPage<ItemDetailResponse> = ({ product }) => {
  const router = useRouter();
  const { user } = useUser();

  console.log(product);

  return (
    <div className="-mb-24">
      <Layout canGoBack seoTitle={`${product.name}`} title="예약자 선택">
        <div className="flex justify-center items-center h-28 bg-black">
          <p className="text-white">룰루랄ㄹ라</p>
        </div>
        <div className=" h-screen bg-red-500 flex flex-col items-center justify-center">
          <div className="text-white">
            <p>이 게시글에서 대화한 이웃이 없어요.</p>
            <p>최근 채팅 목록에서 예약자 찾기</p>
          </div>
          <button className="fixed bottom-3 w-full m-5 py-3  rounded-md bg-gray-500 text-gray-400 text-lg">
            예약자 선택
          </button>
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

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
});

export default ItemDetail;
