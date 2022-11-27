import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { useRouter } from "next/router";
import Link from "next/link";

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
  payload?: number;
  message?: string;
}

const Enter: NextPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnterForm>({ mode: "onBlur" });
  const [authValue, setAuthValue] = useState(false);
  const [auth, setAuth] = useState(false);
  const router = useRouter();

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
  const {
    register: tokenRegister,
    handleSubmit: tokenHandleSubmit,
    setValue: tokenSetValue,
  } = useForm<TokenForm>();

  const onValid = (validForm: EnterForm) => {
    if (loading) return;
    enter(validForm);
    setAuth(true);
  };

  useEffect(() => {
    if (data?.ok) {
      tokenSetValue("token", data?.payload + "");
    }
  }, [data]);

  const onTokenValid = (validForm: TokenForm) => {
    if (tokenLoading) return;
    confirmToken(validForm);
  };

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
            {!auth ? (
              <input
                className="p-3 rounded-md border-2 border-black"
                type={"number"}
                placeholder={"휴대폰 번호를 입력해주세요"}
                autoFocus={true}
                {...register("phone", {
                  required: {
                    value: true,
                    message: "휴대폰 번호는 필수 입력값입니다.",
                  },
                  pattern: {
                    value: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
                    message: "휴대폰 번호를 정확히 입력해주세요",
                  },
                  maxLength: {
                    value: 11,
                    message: "휴대폰 번호를 정확히 입력해주세요",
                  },
                })}
              />
            ) : null}
            {errors?.phone ? (
              <span className="text-xs text-red-500">
                {errors.phone.message}
              </span>
            ) : null}

            <button
              className={cls(
                `p-3 rounded-md ${
                  auth
                    ? ` bg-white border border-gray-300 font-semibold`
                    : `bg-gray-200 text-white`
                }`
              )}
            >
              {auth
                ? `인증문자 다시 받기 `
                : loading
                ? "loading"
                : "인증문자 받기"}
            </button>
          </form>
        </>

        {auth ? (
          <div className="w-full my-5">
            <form
              onSubmit={tokenHandleSubmit(onTokenValid)}
              className="flex flex-col gap-3"
            >
              <input
                className="p-3 rounded-md border-2 border-black"
                type={"number"}
                placeholder={"인증번호를 입력해주세요"}
                {...tokenRegister("token", {
                  required: true,
                })}
                // value={data?.payload}
                onChange={authValChange}
              />
              <h5 className="text-sm text-gray-400 font-medium">
                어떤 경우에도 타인에게 공유하지 마세요!
              </h5>
              <button
                className={`p-3 text-white rounded-md bg-${
                  authValue ? "orange-500" : "gray-200"
                }`}
              >
                {tokenLoading ? "잠시만 기다려 주세요." : "인증번호 확인"}
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
