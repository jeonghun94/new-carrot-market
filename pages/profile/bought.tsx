import type { NextPage } from "next";
import ProductList from "@components/product-list";
import NewLayout from "@components/layouts/layout";

const Bought: NextPage = () => {
  return (
    <NewLayout seoTitle="구매내역" actionBar backBtn title="구매내역">
      <ProductList kind="purchases" />
    </NewLayout>
  );
};

export default Bought;
