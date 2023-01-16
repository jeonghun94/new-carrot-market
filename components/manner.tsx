import { Manner, User } from "@prisma/client";
import BottomButton from "./buttons/bottom";
import UserAvartar from "./user/avatar";
import Layout from "./layouts/layout";
import Notice from "./notice";
import { useState } from "react";
import useMutation from "@libs/client/useMutation";
import { data } from "autoprefixer";

interface MannerProps {
  profile: User;
  manners: Manner[];
  setManner: (manner: boolean) => void;
}

const Manner = ({ profile, manners, setManner }: MannerProps) => {
  const [selectedManner, setSelectedManner] = useState<Manner[]>([]);

  const [manner, { loading }] = useMutation("/api/users/manner");

  const handleManner = (e: Manner) => {
    if (selectedManner.includes(e)) {
      setSelectedManner(
        selectedManner.filter((manner) => {
          return manner !== e;
        })
      );
    } else {
      setSelectedManner([...selectedManner, e]);
    }
  };

  const hiddenManner = () => {
    setManner(false);
  };

  const t = () => {
    if (selectedManner.length === 0) {
      alert("칭찬할 매너를 선택해주세요.");
      return;
    }

    manner({
      manners: selectedManner,
      otherUserId: profile.id,
    });
  };

  return (
    <>
      <Layout seoTitle="매너 칭찬하기" title="매너 칭찬하기" actionBar backBtn>
        <div className="p-3">
          <div className="flex items-center gap-3 mt-2 mb-5">
            <UserAvartar
              avatar={profile.avatar + ""}
              defaultImageSize={14}
              imageSize={50}
            />
            <div className="flex flex-col gap-1 ">
              <h3 className="font-semibold">{profile.name}</h3>
              <span className="text-gray-500 text-sm">
                매너온도 {profile.temperature}℃
              </span>
            </div>
          </div>

          <Notice text="칭찬 인사를 남기면 상대방의 매너온도가 올라가요 인사를 남겨 보세요!" />
          <h1 className="py-5 text-lg font-semibold">어떤 점이 좋았나요?</h1>
          <div className="space-y-3">
            {manners &&
              manners.length > 0 &&
              manners.map((manner, idx) => (
                <div key={idx} className=" flex gap-3 items-center ">
                  <input
                    className="w-5 h-5 accent-orange-500 rounded-md"
                    onChange={() => handleManner(manner)}
                    type="checkbox"
                    name="manner"
                    id={`manner${idx}`}
                  />
                  <label htmlFor={`manner${idx}`}>{manner.manner}</label>
                </div>
              ))}
          </div>
        </div>

        <div className="fixed bottom-0 w-full flex flex-col  gap-1 p-3">
          <BottomButton onClick={t} text="칭찬하기" accent />
          <BottomButton onClick={hiddenManner} text="취소" />
        </div>
      </Layout>
    </>
  );
};

export default Manner;
