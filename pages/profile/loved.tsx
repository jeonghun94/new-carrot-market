import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Loved: NextPage = () => {
  return (
    <Layout title="관심목록" canGoBack>
      <ProductList kind="favs" />
    </Layout>
  );
};

export default Loved;
