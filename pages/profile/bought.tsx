import type { NextPage } from "next";
import ProductList from "@components/product-list";
import NewLayout from "@components/newLayout";

const Bought: NextPage = () => {
  return (
    <NewLayout actionBar backBtn title="구매내역">
      <ProductList kind="purchases" />
    </NewLayout>
  );
};

export default Bought;
