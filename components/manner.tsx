import { Manner, User } from "@prisma/client";
import BottomButton from "./buttons/bottom";
import UserAvartar from "./user/avatar";
import Layout from "./layouts/layout";
import Notice from "./notice";
import { useState } from "react";
import useMutation from "@libs/client/useMutation";
import MutationButton from "./buttons/mutation";
import { useRouter } from "next/router";

interface Compliment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  mannerId: number;
  createdById: number;
  createdForId: number;
}
interface ComplimentWithManner extends Compliment {
  manner: Manner;
}

interface MannerProps {
  profile: User;
  manners: Manner[];
  setManner: (manner: boolean) => void;
  compliments: ComplimentWithManner[];
  alreadyCompliment: boolean;
}

const Manner = ({
  profile,
  manners,
  setManner,
  compliments,
  alreadyCompliment,
}: MannerProps) => {
  const [selectedManner, setSelectedManner] = useState<Manner[]>([]);
  const [manner] = useMutation("/api/users/manner");
  const router = useRouter();

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

  const createManner = () => {
    if (selectedManner.length === 0) {
      alert("칭찬할 매너를 선택해주세요.");
      return;
    }

    manner({
      manners: selectedManner,
      otherUserId: profile.id,
    });
    setManner(false);
  };

  const mutationManner = () => {
    manner({
      manners: selectedManner,
      otherUserId: profile.id,
      compliments,
      mutation: true,
    });
    setManner(false);
  };

  const mutation = () => {
    return (
      <div className="group">
        <button>
          <svg
            fill="none"
            className="w-6 h-6"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
            ></path>
          </svg>
        </button>
        <div className="fixed top-0 left-0 w-full h-screen p-3 bg-gray-800 bg-opacity-20 hidden group-hover:block">
          <div className="fixed bottom-1 p-3 right-0 w-full h-auto">
            <MutationButton onClick={mutationManner} text="삭제" opacity />
            <MutationButton onClick={hiddenManner} text="닫기" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Layout
        seoTitle="매너 칭찬하기"
        title={`${alreadyCompliment ? "내가 남긴 매너 칭찬" : "매너 칭찬하기"}`}
        actionBar
        backBtn
        actionBtn={!alreadyCompliment ? false : mutation()}
      >
        <div className="p-3 ">
          <div className="flex items-center gap-3 mt-2 mb-5 pb-5 border-b">
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
          {!alreadyCompliment ? (
            <>
              <Notice text="칭찬 인사를 남기면 상대방의 매너온도가 올라가요 인사를 남겨 보세요!" />
              <h1 className="py-5 text-lg font-semibold">
                어떤 점이 좋았나요?
              </h1>
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

              <div className="fixed bottom-0 right-0 w-full box-border p-3">
                <BottomButton onClick={createManner} text="칭찬하기" accent />
                <BottomButton onClick={hiddenManner} text="취소" />
              </div>
            </>
          ) : (
            <>
              <ul className="list-disc px-5">
                {compliments &&
                  compliments.length > 0 &&
                  compliments.map((compliment, index) => (
                    <li key={index} className="my-3 text-md">
                      {compliment.manner.manner}
                    </li>
                  ))}
              </ul>
              <div className="fixed bottom-0 right-0 w-full box-border p-3 pb-5">
                <BottomButton onClick={hiddenManner} text="닫기" accent />
              </div>
            </>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Manner;
