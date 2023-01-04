import { useEffect, useRef, useState } from "react";

function useMap() {
  const [myLocation, setMyLocation] = useState<
    { latitude: number; longitude: number } | string
  >({
    latitude: 37.516926971764605,
    longitude: 126.90647059566668,
  });

  const [address, setAddress] = useState<string>("");

  // useEffect(() => {
  //   // geolocation 이용 현재 위치 확인, 위치 미동의 시 기본 위치로 지정
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       setMyLocation({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //       });

  //       console.log(position.coords.latitude); //37.516926971764605
  //       console.log(position.coords.longitude); //126.90647059566668

  //       fetch(
  //         `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${position.coords.longitude}&y=${position.coords.latitude}`,
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: "KakaoAK ac6a4a66be3e449810b96547a19fbefa",
  //             "Content-type": "application/json",
  //           },
  //         }
  //       )
  //         .then((response) => response.json())
  //         .then((data) => {
  //           setAddress(data.documents[0].address.region_3depth_name);
  //           console.log(data);
  //         });
  //     });
  //   } else {
  //     window.alert("현재 위치를 알 수 없어 기본 위치로 지정합니다.");
  //     setMyLocation({ latitude: 37.4862618, longitude: 127.1222903 });
  //   }
  // }, []);

  fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${126.90647059566668}&y=${37.516926971764605}`,
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
      setAddress(data.documents[0].address.region_3depth_name);
      console.log(data);
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

      naver.maps.Event.addListener(map, "click", function (e) {
        marker.setPosition(e.coord);
      });
    }
  }, [myLocation]);

  return {
    myLocation,
    address,
  };
}

export default useMap;
