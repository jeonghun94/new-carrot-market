import type { NextPage } from "next";
import client from "@libs/server/client";
import { Post, PostCategory, User } from "@prisma/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import FloatingButton from "@components/buttons/floating-button";
import { convertTime } from "@libs/client/utils";
import Image from "next/image";
import NewLayout from "@components/layouts/layout";

interface PostWithUser extends Post {
  user: User;
  postCategory: PostCategory;
  _count: {
    wondering: number;
    answers: number;
  };
}

interface PostsResponse {
  categories: PostCategory[];
  posts: PostWithUser[];
}

const Community: NextPage<PostsResponse> = ({
  categories,
  posts: ssrPosts,
}) => {
  // const { latitude, longitude } = useCoords();
  // const { data } = useSWR<PostsResponse>(
  //   latitude && longitude
  //     ? `/api/posts?latitude=${latitude}&longitude=${longitude}`
  //     : null
  // );
  const [posts, setPosts] = useState<PostWithUser[]>(ssrPosts);
  const [category, setCategory] = useState<PostCategory>();

  useEffect(() => {
    async function fetchPosts() {
      const { posts } = await (
        await fetch(`/api/posts?categoryId=${category?.id}`)
      ).json();
      setPosts(posts);
    }
    if (category) {
      fetchPosts();
    }
  }, [category]);

  return (
    <NewLayout seoTitle="동네생활" title="동네생활" actionBar menuBar>
      <div
        className={`w-full flex justify-start items-center px-3 pt-5 pb-3.5 gap-3 border-b overflow-auto overflow-x-visible md:justify-between lg:justify-center `}
      >
        {categories?.map((category) => (
          <div
            key={category.id}
            onClick={() => setCategory(category)}
            className="flex min-w-fit items-center justify-center px-3 py-2 border rounded-2xl bg-white text-gray-600 font-semibold text-xs cursor-pointer z-10"
          >
            {category.name}
          </div>
        ))}
      </div>
      <div className="space-y-5 divide-y-[3px] ">
        {posts && posts.length > 0 ? (
          posts?.map((post) => (
            <Link key={post.id} href={`/community/${post.id}`}>
              <a className="flex flex-col items-start pt-4 cursor-pointer">
                <span className="flex ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {post.postCategory.name}
                </span>
                <div className="mt-2 px-4 text-gray-600 space-y-3">
                  <div className="flex gap-1">
                    <p>
                      <span className="text-orange-500 font-medium">Q.</span>{" "}
                    </p>
                    {Number(post.content?.length) > 150 ? (
                      <>
                        <p>
                          {post.content?.slice(0, 150)}...
                          <span className="text-gray-500 tex-xs font-semibold underline">
                            더보기
                          </span>{" "}
                        </p>
                      </>
                    ) : (
                      post.content
                    )}
                  </div>
                  <div>
                    {post.image && post.image?.split(",").length > 0 && (
                      <Image
                        src={`https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${
                          post.image.split(",")[0]
                        }/public`}
                        alt="post image"
                        className={`w-full rounded-md`}
                        width={600}
                        height={230}
                      />
                    )}
                  </div>
                </div>
                <div className="mt-5 px-4 flex items-center justify-between w-full text-gray-500 font-medium text-xs">
                  <span>{post.user.name}</span>
                  <span>{convertTime(post.createdAt.toString())}</span>
                </div>
                <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t w-full">
                  <span className="flex space-x-2 items-center text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>
                      궁금해요{" "}
                      {post._count.wondering > 0 ? post._count.wondering : null}
                    </span>
                  </span>
                  <span className="flex space-x-2 items-center text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      ></path>
                    </svg>
                    <span>
                      {post._count.answers > 0
                        ? `댓글 ${post._count.answers}`
                        : "답변하기"}
                    </span>
                  </span>
                </div>
              </a>
            </Link>
          ))
        ) : (
          <div className="fixed top-0 flex items-center justify-center w-full min-h-screen z-0">
            등록된 글이 없습니다.
          </div>
        )}
        <FloatingButton href="/community/write">
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
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </FloatingButton>
      </div>
    </NewLayout>
  );
};

export async function getStaticProps() {
  const categories = await client.postCategory.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const posts = await client.post.findMany({
    include: {
      user: {
        select: {
          name: true,
        },
      },
      postCategory: {
        select: {
          name: true,
        },
      },
      wondering: {
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          wondering: true,
          answers: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
}

export default Community;
