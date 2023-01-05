import type { NextPage } from "next";
import useMap from "@libs/client/useMap";
import NewLayout from "@components/newLayout";
import useUser from "@libs/client/useUser";
import { useEffect } from "react";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";

const IndexPage: NextPage = () => {
  const [location, { data, loading }] = useMutation("/api/users/me/location");
  const router = useRouter();

  const {
    user: {
      latitude: userLatitude,
      longitude: userLongitude,
      address: userAddress,
    },
  } = useUser();

  const { myLocation } = useMap({
    userLatitude: Number(userLatitude),
    userLongitude: Number(userLongitude),
    userAddress: userAddress + "",
  });

  useEffect(() => {
    if (typeof myLocation !== "string") {
      const position = new naver.maps.LatLng(
        myLocation.latitude,
        myLocation.longitude
      );

      const map = new naver.maps.Map("map", {
        center: position,
        zoom: 18,
      });

      const marker = new naver.maps.Marker({
        position: position,
        map: map,
      });

      // naver.maps.Event.addListener(map, "click", function (e) {
      //   marker.setPosition(e.coord);
      // });
    }
  }, [myLocation]);

  const handleOnClick = () => {
    if (confirm("현재 위치를 동네로 설정하시겠습니까?")) {
      location({ myLocation });
      if (data && data.ok) {
        alert("동네가 설정되었습니다.");
        router.push("/profile");
      }
    }
  };

  return (
    <NewLayout actionBar backBtn title="동네 인증하기">
      <div className="w-full h-96" id="map"></div>
      <div className="p-3 bg-orange-500 text-white text-sm text-center">
        <p>
          {myLocation.isSame
            ? `현재 위치가 내 동네로 설정한 <sapn className="text-sm font-semibold">${userAddress}</sapn>에 있습니다.`
            : `잠깐만요! 현재 위치가 ${myLocation.address} 이에요.`}
        </p>
      </div>
      <div className="p-2">
        {myLocation.isSame ? (
          <>
            <button
              className="w-full mt-2 p-2 text-center text-sm font-semibold rounded-md border bg-orange-500 text-white"
              onClick={() => router.push("/profile")}
            >
              동네인증 완료하기
            </button>
          </>
        ) : (
          <>
            <p className="p-2 text-sm text-center">
              현재 내 동네로 설정되어 있는 동네서만 동네인증을 할 수 있어요.
              현재 위치를 확인해 주세요.
            </p>
            <button
              className="w-full mt-2 p-2 text-center text-sm font-semibold rounded-md border"
              onClick={handleOnClick}
            >
              현재 위치로 동네 변경하기
            </button>
          </>
        )}
      </div>
    </NewLayout>
  );
};

export default IndexPage;
