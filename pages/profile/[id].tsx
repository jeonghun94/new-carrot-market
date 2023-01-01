import type { NextPage, NextPageContext } from "next";
import { withSsrSession } from "@libs/server/withSession";
import { Review, User } from "@prisma/client";
import client from "@libs/server/client";
import Layout from "@components/layout";
import UserAvartar from "@components/user-avatar";

interface UserWithIsMe extends User {
  isMe: boolean;
}

interface PageResponse extends User {
  profile: UserWithIsMe;
}

const UserProfile: NextPage<PageResponse> = ({ profile }) => {
  console.log(profile);
  return (
    <Layout canGoBack title="프로필">
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
            <button className="w-full p-2 rounded-md bg-gray-500 text-white">
              <span>프로필 수정</span>
            </button>
          ) : (
            <button className="w-full p-2 rounded-md bg-gray-500 text-white">
              <span>매너 칭찬하기</span>
            </button>
          )}

          <p className="flex text-sm">
            <span className="font-semibold underline">매너온도</span>
            <svg
              className="w-5 h-5 text-gray-800"
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
                <span className="ml-2 text-lg">😀</span>
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
        </div>
      </div>
    </Layout>
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
    },
  });
  console.log(profile);

  return {
    props: {
      profile: JSON.parse(JSON.stringify({ ...profile, isMe })),
    },
  };
});

export default UserProfile;
