import type { NextPage } from "next";
import ProductList from "@components/product-list";
import NewLayout from "@components/newLayout";

const Loved: NextPage = () => {
  return (
    <NewLayout seoTitle="관심목록" title="관심목록" actionBar backBtn>
      <ProductList kind="favs" />
    </NewLayout>
  );
};

export default Loved;
