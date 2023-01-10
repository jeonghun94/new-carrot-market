import type { NextPage } from "next";
import ProductList from "@components/products/kind";
import Layout from "@components/layouts/layout";

const Loved: NextPage = () => {
  return (
    <Layout seoTitle="관심목록" title="관심목록" actionBar backBtn>
      <ProductList kind="favs" />
    </Layout>
  );
};

export default Loved;
