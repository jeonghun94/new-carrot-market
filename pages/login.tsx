import { NextPage } from "next";
import logo from "public/carrot-logo.png";
import Image from "next/image";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div>
      <div className="flex flex-col justify-center items-center w-full h-screen dark:bg-gray-700">
        <div className="mb-2 -mt-20">
          <Image src={logo} width={84} height={108}></Image>
        </div>
        <h1 className="text-xl font-semibold py-3 dark:text-white">
          당신 근처의 당근마켓
        </h1>
        <h3 className="dark:text-white">내 동네를 설정하고</h3>
        <h3 className="dark:text-white">당근마켓을 시작해보세요.</h3>
      </div>

      <div className="fixed w-full p-3 pb-4  bottom-0">
        <Link href={`/register`}>
          <a className="block text-center w-full p-3 mb-2  bg-orange-500 text-white rounded-md">
            시작하기
          </a>
        </Link>
        <div className="flex justify-center my-5">
          <span className="px-1 text-sm dark:text-gray-300">
            이미 계정이 있나요?
          </span>
          <Link href={`/register`}>
            <a className="text-sm text-orange-500 font-bold">로그인</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
