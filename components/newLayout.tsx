import { NextPage } from "next";
import Head from "next/head";
import MenuBar from "@components/menuBar";
import Link from "next/link";
import { useRouter } from "next/router";

interface LayoutProps {
  title?: string | React.ReactNode;
  seoTitle?: string;
  subTitle?: string;
  menuBar?: boolean;
  children: React.ReactNode;

  actionBar?: boolean;
  borderNone?: boolean;

  backBtn?: boolean;
  closeBtn?: boolean;
  homeBtn?: boolean;
  linkBtn?: boolean;
  actionBtn?: React.ReactNode;
  settingBtn?: boolean;
}

const NewLayout: NextPage<LayoutProps> = ({
  title,
  seoTitle,
  subTitle,
  menuBar,
  children,
  actionBar,
  borderNone,
  backBtn,
  closeBtn,
  homeBtn,
  linkBtn,
  actionBtn,
  settingBtn,
}) => {
  const headTitle = `${seoTitle ? `당근마켓 - ${seoTitle}` : "당근마켓"}`;
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>
      {actionBar ? (
        <div
          className={`fixed top-0 w-full  px-4 text-lg text-gray-800 font-medium bg-white ${
            borderNone ? null : "border-b"
          } z-30`}
        >
          <div className="h-14 grid grid-cols-3 gap-2 content-center">
            {/* left */}
            <div className=" flex gap-5 place-self-start">
              {backBtn && (
                <button
                  className="py-2 items-center"
                  onClick={() => router.back()}
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
              {closeBtn && (
                <button className="py-2 items-center">
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
              {homeBtn && (
                <button
                  className="py-2 items-center"
                  onClick={() => router.push("/")}
                >
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </button>
              )}
              {subTitle && <h1 className="p-2">{subTitle}</h1>}
            </div>

            {/* center */}
            <div className=" place-self-center">{title}</div>

            {/* right */}
            <div className="place-self-end">
              {linkBtn && (
                <button className="p-2">
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </button>
              )}

              {actionBtn && <div className="p-2">{actionBtn}</div>}
              {settingBtn && (
                <button
                  className="p-2 cursor-pointer"
                  onClick={() => router.push("/profile/setting")}
                >
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-14">{children}</div>

      {menuBar ? <MenuBar /> : null}
    </>
  );
};

export default NewLayout;
