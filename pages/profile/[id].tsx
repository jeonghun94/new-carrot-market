import type { NextPage, NextPageContext } from "next";
import { withSsrSession } from "@libs/server/withSession";
import { Review, Token, User } from "@prisma/client";
import client from "@libs/server/client";
import UserAvartar from "@components/user/avatar";
import Link from "next/link";
import { convertTime } from "@libs/client/utils";
import { useRouter } from "next/router";
import NewLayout from "@components/layouts/layout";

interface UserWithIsMe extends User {
  isMe: boolean;
  tokens: Token[];
  writtenReviews: Review[];
  receivedReviews: Review[];
  _count: {
    products: number;
    receivedReviews: number;
    writtenReviews: number;
  };
}

interface PageResponse extends User {
  profile: UserWithIsMe;
}

const UserProfile: NextPage<PageResponse> = ({ profile }) => {
  const router = useRouter();

  return (
    <NewLayout
      seoTitle={`${profile.name}님의 프로필`}
      title="프로필"
      actionBar
      backBtn
    >
      <div className="mt-2">
        <div className="space-y-3 p-3">
          <div className="flex items-center gap-3">
            <UserAvartar
              avatar={profile.avatar + ""}
              defaultImageSize={14}
              imageSize={60}
            />
            <h3 className="font-semibold">{profile.name}</h3>
          </div>

          {profile.isMe ? (
            <button className="w-full p-2 rounded-md bg-gray-100">
              <Link href={"/profile/edit"}>
                <a>프로필 수정</a>
              </Link>
            </button>
          ) : (
            <button className="w-full p-2 rounded-md bg-gray-100">
              <span>매너 칭찬하기</span>
            </button>
          )}

          <p className="flex items-center text-sm">
            <span className="font-semibold underline">매너온도</span>
            <svg
              className="w-4 h-4 text-gray-800"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </p>

          <div className="flex flex-col gap-1 w-full ">
            <div className="self-end">
              <p className=" text-green-500 font-semibold ">
                {profile.temperature + "°C"}
                <span className="ml-2 text-xl">😀</span>
              </p>
            </div>
            <progress
              className="w-full h-2"
              max={100}
              value={
                profile.temperature ? profile.temperature?.toString() : "36.5"
              }
            />
          </div>

          <div className="flex justify-center gap-3 pt-4 w-full text-sm text-gray-700">
            <div className="flex justify-start gap-2 w-full">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <div className="space-y-2">
                <p className="flex gap-1">
                  재거래희망률
                  <span className="text-black font-semibold">100</span>%
                </p>
                <p className="text-xs text-gray-500">8명 중 8명이 만족</p>
              </div>
            </div>

            <div className="flex justify-start gap-2 w-full">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <div className="space-y-2">
                <p className="flex items-center">
                  응답률 <span className="text-black font-semibold">76</span>%
                </p>
                <p className="text-xs text-gray-500">보통 몇 시간 이내 응답</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  p-5 space-y-1 bg-gray-100 text-xs text-gray-700">
          <p>
            &middot; 신월7동{" "}
            <span className="text-black font-semibold">9회</span> 인증, 양천구
            신정3동 <span className="text-black font-semibold">미인증</span>{" "}
            (최근 30일)
          </p>
          <p>
            &middot; 최근 {convertTime(profile.tokens[0].createdAt.toString())}{" "}
            활동(
            {new Intl.DateTimeFormat("ko-kr", {
              dateStyle: "long",
              timeZone: "Asia/Seoul",
            }).format(new Date(profile.createdAt))}
            )
          </p>
        </div>
        <div className="divide-y-[1px] divide-gray-100 font-semibold text-sm">
          <div className="flex justify-between items-center p-5">
            <p>활동 배지 12개</p>
            <svg
              className="w-5 h-5"
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
          </div>
          <div
            className="flex justify-between items-center p-5 cursor-pointer"
            onClick={() => {
              router.push({
                pathname: "/profile/sold",
                query: { id: profile.id },
              });
            }}
          >
            <p>판매상품 {profile._count.products}개</p>
            <svg
              className="w-5 h-5"
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
          </div>
          <div>
            <div className="flex justify-between items-center p-5">
              <p>받은 매너 평가</p>
              <svg
                className="w-5 h-5"
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
            </div>

            {profile.writtenReviews.map((review) => (
              <div
                key={review.id}
                className=" flex items-start gap-3 my-3 px-5"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <div className=" p-2 bg-gray-100 text-sm font-normal rounded-lg rounded-tl-none">
                  <p>{review.review}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </NewLayout>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
  query,
}: NextPageContext) {
  const isMe = Number(req?.session.user?.id) === Number(query.id);
  const profile = await client.user.findUnique({
    where: {
      id: Number(query.id),
    },
    include: {
      receivedReviews: true,
      writtenReviews: true,
      _count: {
        select: {
          receivedReviews: true,
          writtenReviews: true,
          products: true,
        },
      },
      tokens: true,
    },
  });

  return {
    props: {
      profile: JSON.parse(JSON.stringify({ ...profile, isMe })),
    },
  };
});

export default UserProfile;
