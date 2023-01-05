import { useEffect, useState } from "react";
import useUser from "./useUser";

interface UseMapProps {
  userLatitude: number;
  userLongitude: number;
  userAddress: string;
}

interface t {
  isSame: boolean;
  longitude: number;
  latitude: number;
  address: string;
}

const useMap = ({ userLatitude, userLongitude, userAddress }: UseMapProps) => {
  const {
    user: { latitude, longitude, address },
  } = useUser();

  console.log(latitude, longitude, address, "위치가 같음 ㅠ user");

  const [myLocation, setMyLocation] = useState<t>({
    isSame: false,
    latitude: userLatitude,
    longitude: userLongitude,
    address: userAddress,
  });

  useEffect(() => {
    console.log("첫 로딩");
    fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${userLongitude}&y=${userLatitude}}`,
      {
        method: "GET",
        headers: {
          Authorization: "KakaoAK ac6a4a66be3e449810b96547a19fbefa",
          "Content-type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const regionAddress = data?.documents[0]?.address.region_3depth_name;
        userAddress === regionAddress
          ? setMyLocation({ ...myLocation, isSame: true })
          : null;
        console.log(myLocation, "위치가 같음 ㅠ myLocation 첫 로딩");
      });
  }, []);

  useEffect(() => {
    if (!myLocation.isSame) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          fetch(
            `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${position.coords.longitude}&y=${position.coords.latitude}`,
            {
              method: "GET",
              headers: {
                Authorization: "KakaoAK ac6a4a66be3e449810b96547a19fbefa",
                "Content-type": "application/json",
              },
            }
          )
            .then((response) => response.json())
            .then((data) => {
              const regionAddress =
                data.documents[0]?.address.region_3depth_name;
              setMyLocation({
                isSame: false,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                address: regionAddress,
              });
            });
        });
      } else {
        window.alert("현재 위치를 알 수 없어 기본 위치로 지정합니다.");
        setMyLocation({
          isSame: false,
          latitude: 37.4862618,
          longitude: 127.1222903,
          address: "신월 7동",
        });
      }
    }
  }, []);

  return {
    myLocation,
  };
};

export default useMap;
