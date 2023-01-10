import type { NextPage } from "next";
import ProductList from "@components/products/kind";
import Layout from "@components/layouts/layout";

const Bought: NextPage = () => {
  return (
    <Layout seoTitle="구매내역" actionBar backBtn title="구매내역">
      <ProductList kind="purchases" />
    </Layout>
  );
};

export default Bought;
