import type { NextPage } from "next";
import Input from "@components/input";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useMutation from "@libs/client/useMutation";
import Image from "next/image";
import NewLayout from "@components/newLayout";

interface EditProfileForm {
  email?: string;
  phone?: string;
  name?: string;
  avatar?: FileList;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<EditProfileForm>();
  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.avatar)
      setAvatarPreview(
        `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${user?.avatar}/avatar`
      );
  }, [user, setValue]);
  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>(`/api/users/me`);
  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (loading) return;
    if (email === "" && phone === "" && name === "") {
      return setError("formErrors", {
        message: "Email OR Phone number are required. You need to choose one.",
      });
    }
    if (avatar && avatar.length > 0 && user) {
      const { uploadURL } = await (await fetch(`/api/files`)).json();
      const form = new FormData();
      form.append("file", avatar[0], user?.id + "");

      const {
        result: { id: avatarId },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      editProfile({
        email,
        phone,
        name,
        avatarId,
      });
    } else {
      editProfile({
        email,
        phone,
        name,
      });
    }
  };
  useEffect(() => {
    if (data && !data.ok && data.error) {
      setError("formErrors", { message: data.error });
    }
  }, [data, setError]);
  const [avatarPreview, setAvatarPreview] = useState("");
  const avatar = watch("avatar");
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);

  const B = () => {
    return (
      <>
        <button className="text-gray-500">
          {loading ? "Loading..." : "완료"}
        </button>
      </>
    );
  };
  return (
    <form onSubmit={handleSubmit(onValid)}>
      <NewLayout actionBar backBtn title="프로필 수정" actionBtn={B()}>
        <div className="py-10 px-4 space-y-4">
          <div className="flex justify-center items-center">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                className="relative rounded-full"
                width={100}
                height={100}
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-slate-500" />
            )}
            <label
              htmlFor="picture"
              className="relative  -bottom-7 right-7 bg-white cursor-pointer p-1 border border-gray-300 rounded-full shadow-sm text-xs  text-gray-700"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                {...register("avatar")}
                id="picture"
                type="file"
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
          <Input
            register={register("name")}
            required={false}
            label="닉네임"
            name="name"
            type="text"
          />
          {errors.formErrors ? (
            <span className="my-2 text-orange-500 font-medium text-center block">
              {errors.formErrors.message}
            </span>
          ) : null}
          {/* <Button text={loading ? "Loading..." : "완료"} /> */}
        </div>
      </NewLayout>
    </form>
  );
};

export default EditProfile;
