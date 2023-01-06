import type { NextPage } from "next";
import useMap from "@libs/client/useMap";
import NewLayout from "@components/newLayout";
import useUser from "@libs/client/useUser";
import { useEffect } from "react";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";

const IndexPage: NextPage = () => {
  const [location, { data }] = useMutation("/api/users/me/location");
  const router = useRouter();

  const {
    user: {
      latitude: userLatitude,
      longitude: userLongitude,
      address: userAddress,
    },
  } = useUser();

  // useEffect(() => {
  //   if (userLongitude !== undefined) {
  //     fetch(
  //       `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${userLongitude}&y=${userLatitude}}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: "KakaoAK ac6a4a66be3e449810b96547a19fbefa",
  //           "Content-type": "application/json",
  //         },
  //       }
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log(data, "data");
  //         const regionAddress = data?.documents[0]?.address.region_3depth_name;
  //         console.log(regionAddress, "regionAddress");
  //       });
  //   }
  // }, []);

  const { myLocation } = useMap({
    userLatitude: Number(userLatitude),
    userLongitude: Number(userLongitude),
    userAddress: userAddress + "",
  });

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
