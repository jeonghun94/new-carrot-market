import { NextPage, NextPageContext } from "next";
import client from "@libs/server/client";
import Layout from "@components/layout";
import { useState } from "react";
import { Product } from "@prisma/client";
import { cls, convertPrice } from "@libs/client/utils";
import Image from "next/image";
import noImage from "public/no-image.png";

interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

interface SellerProduct {
  products: ProductWithCount[];
}

const History: NextPage<SellerProduct> = ({ products }) => {
  const [tab, setTab] = useState(1);

  const foucsTab = (tab: number, index: number) => {
    const foucs =
      tab === index
        ? "text-black  border-b-2 border-black"
        : "text-gray-500  border-b border-gray-300";

    return (
      "text-sm font-bold uppercase px-5 py-3 block leading-normal " + foucs
    );
  };

  const li = (tab: number, index: number, menu: string) => {
    return (
      <li className="flex-auto text-center">
        <a
          className={foucsTab(tab, index)}
          onClick={(e) => {
            e.preventDefault();
            setTab(index);
          }}
          data-toggle="tab"
          href={`#link${index}`}
          role="tablist"
        >
          {menu}
        </a>
      </li>
    );
  };

  return (
    <Layout canGoBack title="판매 상품 보기">
      <div className="flex flex-wrap">
        <div className="w-full ">
          <ul className="flex mt-2 list-none flex-wrap flex-row" role="tablist">
            {li(tab, 1, "전체")}
            {li(tab, 2, "거래중")}
            {li(tab, 3, "거래완료")}
          </ul>

          <div className="relative h-screen flex flex-col  break-words bg-gray-100 w-full ">
            <div className="tab-content tab-space">
              {products.map((product) => (
                <div
                  className={`${cls(
                    tab === 1 ? "block" : "hidden"
                  )} w-full h-40 p-4 mb-2.5 bg-white flex gap-3 `}
                  id="link1"
                >
                  <div className="w-1/3 rounded-md">
                    {" "}
                    <Image
                      width={180}
                      height={135}
                      src={
                        product.image
                          ? `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${product.image}/avatar`
                          : noImage
                      }
                      className={cls(
                        `w-12 h-12 rounded-md ${
                          product.image ? " bg-slate-300" : ""
                        }`
                      )}
                    />
                  </div>
                  <div className=" w-2/3 relative">
                    <p>{product.name}</p>
                    <p className="text-xs my-1 text-gray-400">조회 10</p>
                    <p className="font-semibold">
                      {convertPrice(product.price)}
                    </p>
                    <p className="absolute right-2 bottom-0">
                      {product._count.favs > 0
                        ? `♡${product._count.favs}`
                        : null}
                    </p>
                  </div>
                </div>
              ))}

              <div className={tab === 2 ? "block" : "hidden"} id="link2">
                <p>
                  Completely synergize resource taxing relationships via premier
                  niche markets. Professionally cultivate one-to-one customer
                  service with robust ideas.
                </p>
              </div>
              <div className={tab === 3 ? "block" : "hidden"} id="link3">
                <p>
                  Efficiently unleash cross-media information without
                  cross-media value. Quickly maximize timely deliverables for
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { sellerId } = ctx.query;

  const products = await client.product.findMany({
    where: {
      userId: Number(sellerId),
    },
    include: {
      _count: {
        select: {
          favs: true,
        },
      },
    },
  });

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
};

export default History;
