import { NextPage } from "next";
import Layout from "@components/layouts/layout";

const Test: NextPage = () => {
  const btn = () => {
    return <button className="text-md">완료</button>;
  };
  return (
    <Layout
      // linkBtn
      // homeBtn
      // backBtn
      subTitle="나의 거래"
      menuBar
      actionBar
      title="나의 거래"
      // actionBtn={btn()}
      // settingBtn
      linkBtn
    >
      <div className="p-2">Test</div>
    </Layout>
  );
};

export default Test;
