import Layout from "@components/layout";
import { NextPage } from "next";
import { useState } from "react";

const History: NextPage = () => {
  const [tab, setTab] = useState(1);

  const foucsTab = (tab: number, index: number) => {
    const foucs =
      tab === index
        ? "text-black  border-b-2 border-black"
        : "text-gray-500  border-b border-gray-300";

    return (
      "text-xs font-bold uppercase px-5 py-3 block leading-normal " + foucs
    );
  };

  const Li = (tab: number, index: number, menu: string) => {
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
      <div className="flex flex-wrap ">
        <div className="w-full">
          <ul className="flex mt-2 list-none flex-wrap flex-row" role="tablist">
            {Li(tab, 1, "전체")}
            {Li(tab, 2, "거래중")}
            {Li(tab, 3, "거래완료")}
          </ul>

          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 border-0 border-red-400">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={tab === 1 ? "block" : "hidden"} id="link1">
                  <p>
                    Collaboratively administrate empowered markets via
                    plug-and-play networks. Dynamically procrastinate B2C users
                    after installed base benefits.
                    <br />
                    <br /> Dramatically visualize customer directed convergence
                    without revolutionary ROI.
                  </p>
                </div>
                <div className={tab === 2 ? "block" : "hidden"} id="link2">
                  <p>
                    Completely synergize resource taxing relationships via
                    premier niche markets. Professionally cultivate one-to-one
                    customer service with robust ideas.
                    <br />
                    <br />
                    Dynamically innovate resource-leveling customer service for
                    state of the art customer service.
                  </p>
                </div>
                <div className={tab === 3 ? "block" : "hidden"} id="link3">
                  <p>
                    Efficiently unleash cross-media information without
                    cross-media value. Quickly maximize timely deliverables for
                    real-time schemas.
                    <br />
                    <br /> Dramatically maintain clicks-and-mortar solutions
                    without functional solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default function TabsRender() {
  return (
    <>
      <History />;
    </>
  );
}
