import type { NextPage } from "next";
import useMap from "@libs/client/useMap";
import NewLayout from "@components/newLayout";

const IndexPage: NextPage = () => {
  const { myLocation, address } = useMap();

  return (
    <NewLayout actionBar backBtn title="동네 인증하기">
      <div className="w-full h-96" id="map"></div>
      <div className="p-3 bg-orange-500 text-white text-sm text-center">
        <p>잠깐만요! 현재 위치가 {address} 이에요.</p>
      </div>
      <div className="p-2">
        <p className="p-2 text-sm text-center">
          현재 내 동네로 설정되어 있는 동네에서만 동네인증을 할 수 있어요. 현재
          위치를 확인해 주세요.
        </p>
        <button className="w-full mt-2 p-2 text-center text-sm font-semibold rounded-md border">
          현재 위치로 동네 변경하기
        </button>
      </div>
    </NewLayout>
  );
};

export default IndexPage;
