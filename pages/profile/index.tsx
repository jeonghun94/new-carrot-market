import type { NextPage, NextPageContext } from "next";
import { withSsrSession } from "@libs/server/withSession";
import { Review, User } from "@prisma/client";
import useSWR, { SWRConfig } from "swr";
import useUser from "@libs/client/useUser";
import client from "@libs/server/client";
import logo from "public/carrot-logo.png";
import Image from "next/image";
import Link from "next/link";
import NewLayout from "@components/newLayout";

interface ReviewWithUser extends Review {
  createdBy: User;
}

interface ReviewsResponse {
  ok: boolean;
  reviews: ReviewWithUser[];
}

const Profile: NextPage = () => {
  const { user } = useUser();
  const { data } = useSWR<ReviewsResponse>("/api/reviews");
  return (
    <NewLayout actionBar backBtn subTitle="나의 당근" settingBtn>
      <div className="mt-2 px-4">
        <div className="w-full flex justify-between items-center py-4 space-x-3">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <Image
                src={`https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${user?.avatar}/avatar`}
                className="w-16 h-16 bg-slate-500 rounded-full"
                width={40}
                height={40}
              />
            ) : (
              <div className="w-10 h-10 flex justify-center items-center rounded-full bg-gray-300 text-3xl">
                🙎🏻‍♂️
              </div>
            )}
            <div className="flex flex-col">
              <h3 className="font-semibold text-lg">{user?.name}</h3>
            </div>
          </div>
          <Link href={`/profile/${user?.id}`}>
            <a className="px-1.5 py-2 text-xs rounded-md bg-gray-100">
              프로필 보기
            </a>
          </Link>
        </div>

        <div className=" flex flex-col justify-between items-center gap-3 w-full mb-3 p-3 border-[1.5px]  rounded-md">
          <div className="flex justify-between w-full">
            <div className="flex justify-between items-center gap-1 text-orange-500 font-extrabold">
              <div>
                <Image src={logo} width={13} height={15}></Image>
              </div>
              PAY
            </div>
            <div className="text-sm text-gray-500 font-semibold">
              <p>
                당근하는 새로운 방법, 당근페이!
                <span>
                  {" "}
                  <svg
                    className="w-6 h-6 inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </p>
            </div>
          </div>
          <div className="flex justify-between gap-3 w-full">
            <div className="flex items-center justify-center w-1/2 p-2 bg-gray-100 rounded-sm text-sm cursor-not-allowed">
              <svg
                className="w-6 h-6 inline-block text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>{" "}
              충전
            </div>
            <div className="flex items-center justify-center w-1/2 p-2 bg-gray-100 rounded-sm text-sm cursor-not-allowed">
              <svg
                className="w-5 h-5 text-gray-500 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>{" "}
              계좌송금
            </div>
          </div>
        </div>

        <div className="mb-3 pb-3 border-b">
          <div className="py-1 text-md font-semibold">나의 거래</div>
          <Link href={"/profile/sold"}>
            <div className="py-3 flex items-center gap-3 cursor-pointer">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
              <div className="font-normal">판매내역</div>
            </div>
          </Link>
          <Link href={"/profile/bought"}>
            <div className="py-3 flex items-center gap-3 cursor-pointer">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
              <div className="font-normal">구매내역</div>
            </div>
          </Link>
          <Link href={"/profile/loved"}>
            <div className="py-3 flex items-center gap-3 cursor-pointer">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
              <div className="font-normal">관심목록</div>
            </div>
          </Link>
        </div>

        <div className="mb-3 pb-3 border-b">
          <div className="py-1 text-md font-semibold">나의 동네생활</div>
          <div className="py-3 flex items-center gap-3 cursor-pointer">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              ></path>
            </svg>
            <Link href={"/profile/community"}>
              <div className="font-normal">동네생활 글/댓글</div>
            </Link>
          </div>
        </div>

        <div className="mb-3 pb-3">
          <div className="py-1 text-md font-semibold">기타</div>
          <div className="py-3 flex items-center gap-3 cursor-pointer">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <Link href={"/profile/map"}>
              <div className="font-normal">내 동네 설정</div>
            </Link>
          </div>
          {/* <Link href={"/profile/loved"}>
            <div className="py-3 flex items-center gap-3 cursor-pointer">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div className="font-normal">동네 인증하기</div>
            </div>
          </Link> */}
        </div>
      </div>
    </NewLayout>
  );
};

const Page: NextPage<{ profile: User }> = ({ profile }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/users/me": { ok: true, profile },
        },
      }}
    >
      <Profile />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
}: NextPageContext) {
  const profile = await client.user.findUnique({
    where: { id: req?.session.user?.id },
  });
  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
});

export default Page;
