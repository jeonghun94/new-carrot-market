import type { NextPage } from "next";
import ProductList from "@components/product-list";
import NewLayout from "@components/newLayout";

const Loved: NextPage = () => {
  return (
    <NewLayout actionBar backBtn title="관심목록">
      <ProductList kind="favs" />
    </NewLayout>
  );
};

export default Loved;
