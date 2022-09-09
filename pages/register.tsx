import type { NextPage } from "next";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@components/button";
import Input from "@components/input";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Link from "next/link";

const Bs = dynamic(
  //@ts-ignore
  () =>
    new Promise((resolve) =>
      setTimeout(() => resolve(import("@components/bs")), 3000)
    ),
  { ssr: false, suspense: true, loading: () => <span>loading</span> }
);

interface EnterForm {
  email?: string;
  phone?: string;
  authValue?: number;
}

interface TokenForm {
  token: string;
}

interface MutationResult {
  ok: boolean;
}

const Enter: NextPage = () => {
  const { register, handleSubmit, reset } = useForm<EnterForm>();
  const [auth, setAuth] = useState(false);
  const [authValue, setAuthValue] = useState(false);

  const authValChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    if (value !== "" && value.length > 0) {
      setAuthValue(true);
    } else {
      setAuthValue(false);
    }
  };

  const [enter, { loading, data, error }] =
    useMutation<MutationResult>("/api/users/enter");
  const [confirmToken, { loading: tokenLoading, data: tokenData }] =
    useMutation<MutationResult>("/api/users/confirm");
  const { register: tokenRegister, handleSubmit: tokenHandleSubmit } =
    useForm<TokenForm>();
  const [method, setMethod] = useState<"email" | "phone">("email");
  const onEmailClick = () => {
    reset();
    setMethod("email");
  };
  const onPhoneClick = () => {
    reset();
    setMethod("phone");
  };
  const onValid = (validForm: EnterForm) => {
    if (loading) return;
    // enter(validForm);
    setAuth(true);
    console.log(validForm);
  };
  const onTokenValid = (validForm: TokenForm) => {
    if (tokenLoading) return;
    confirmToken(validForm);
  };

  const router = useRouter();
  useEffect(() => {
    if (tokenData?.ok) {
      router.push("/");
    }
  }, [tokenData, router]);
  return (
    <div className="mt-16 px-4">
      <h3 className="text-2xl font-bold text-left">
        휴대폰 번호를 인증해주세요.
      </h3>
      <div className="mt-12">
        {data?.ok ? (
          <form
            onSubmit={tokenHandleSubmit(onTokenValid)}
            className="flex flex-col mt-8 space-y-4"
          >
            <Input
              register={tokenRegister("token", {
                required: true,
              })}
              name="token"
              label="Confirmation Token"
              type="number"
              required
            />
            <Button text={tokenLoading ? "Loading" : "Confirm Token"} />
          </form>
        ) : (
          <>
            <div className="flex flex-col items-left -mt-10 -mb-6">
              <h5 className="text-sm text-gray-500 font-medium">
                당근마켓은 휴대폰 번호로 가입해요. 번호는 안전하게 보관되며
                <br />
                어디에도 공개되지 않아요.
              </h5>
            </div>
            <form
              onSubmit={handleSubmit(onValid)}
              className="flex flex-col mt-8 space-y-4"
            >
              <input
                className="p-3 rounded-md border-2 border-black"
                type={"number"}
                placeholder={"휴대폰 번호를 입력해주세요"}
                autoFocus={true}
                {...register("phone", {
                  required: true,
                })}
              />
              <button
                className={
                  auth
                    ? `p-3 rounded-md bg-white border border-gray-300 font-semibold`
                    : `p-3 rounded-md bg-gray-200 text-white `
                }
              >
                {auth ? "인증문자 다시 받기" : "인증문자 받기"}
              </button>
            </form>
          </>
        )}

        {auth ? (
          <div className="w-full my-5">
            <form className="flex flex-col gap-3">
              <input
                className="p-3 rounded-md border-2 border-black"
                type={"number"}
                placeholder={"인증번호를 입력해주세요"}
                {...register("authValue", {
                  required: true,
                })}
                onChange={authValChange}
              />
              <h5 className="text-sm text-gray-400 font-medium">
                어떤 경우에도 타인에게 공유하지 마세요!
              </h5>
              <button
                className={
                  authValue
                    ? "p-3 bg-orange-500 text-white rounded-md"
                    : "p-3 bg-gray-200 text-white rounded-md"
                }
              >
                {loading ? "loading" : "인증번호 확인"}
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-8">
            <div className="relative">
              <div className="relative -top-3 text-center ">
                <span className="bg-white px-2 text-sm text-black">
                  휴대폰 번호가 변경되었나요?
                </span>
                <Link href={""}>
                  <a className="text-sm underline">이메일로 계정찾기</a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Enter;
