import type { NextPage } from "next";
import FloatingButton from "@components/buttons/floating-button";
import Item from "@components/item";
import useSWR from "swr";
import { Product } from "@prisma/client";
import { convertTime } from "@libs/client/utils";
import NewLayout from "@components/newLayout";
import ProductItems from "@components/product";
import { useState } from "react";

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
  const [items, setItems] = useState(data?.products);
  return (
    <NewLayout actionBar title="홈" menuBar seoTitle="Home">
      <div className="flex flex-col  divide-y">
        {data?.products?.map((product, index) => (
          <div key={index}>
            <ProductItems
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              createdAt={product.createdAt.toString()}
              price={product.price}
              chats={product._count.chats}
              favs={product._count.favs}
              state={product.state}
              setItems={setItems}
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
    </NewLayout>
  );
};

export default Home;
