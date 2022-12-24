import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useSWR from "swr";
import { Product } from "@prisma/client";
import { convertTime } from "@libs/client/utils";

export interface ProductWithCount extends Product {
  _count: {
    favs: number;
    chats: number;
  };
}

interface ProductResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const Home: NextPage = () => {
  const { data } = useSWR<ProductResponse>("/api/products");

  return (
    <Layout title="홈" hasTabBar seoTitle="Home">
      <div className="flex flex-col space-y-5 divide-y">
        {data?.products?.map((product, index) => (
          <div key={index}>
            <Item
              key={product.id}
              id={product.id}
              title={product.name}
              price={product.price}
              hearts={product._count.favs}
              image={product.image}
              state={product.state}
              createdAt={convertTime(product.createdAt.toString())}
              chats={product._count.chats}
            />
          </div>
        ))}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Home;
