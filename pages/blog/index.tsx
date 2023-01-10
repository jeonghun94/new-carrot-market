import matter from "gray-matter";
import { readdirSync, readFileSync } from "fs";
import { NextPage } from "next";
import Layout from "@components/layouts/layout";
import Link from "next/link";

interface Post {
  title: string;
  date: string;
  category: string;
  slug: string;
}

interface Test {
  test: string;
}

const Blog: NextPage<{ posts: Post[]; test: Test }> = ({ posts, test }) => {
  return (
    <Layout seoTitle="Blog" title="Blog" actionBar homeBtn>
      <h1 className="font-semibold text-center text-xl mt-5 mb-10">
        Latest Posts:
      </h1>
      {posts.map((post, index) => (
        <div key={index} className="mb-5">
          <Link href={`/blog/${post.slug}`}>
            <a>
              <span className="text-lg text-red-500">{post.title}</span>
              <div>
                <span>
                  {post.date} / {post.category}
                </span>
              </div>
            </a>
          </Link>
        </div>
      ))}
    </Layout>
  );
};

export async function getStaticProps() {
  const blogPosts = readdirSync("./posts").map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    const [slug, _] = file.split(".");
    return { ...matter(content).data, slug };
  });
  return {
    props: {
      posts: blogPosts.reverse(),
      test: "test",
    },
  };
}

export default Blog;
