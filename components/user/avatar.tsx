import Image from "next/image";
interface AvatarProps {
  avatar: string;
  imageSize: number;
  defaultImageSize: number;
}

export default function UserAvartar({
  avatar,
  imageSize,
  defaultImageSize,
}: AvatarProps) {
  return (
    <>
      {avatar !== "null" ? (
        <Image
          alt="이미지를 불러올 수 없습니다:("
          src={`https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${avatar}/avatar`}
          className="w-16 h-16 bg-slate-500 rounded-full"
          width={imageSize}
          height={imageSize}
        />
      ) : (
        <div>
          <div
            className={`w-${defaultImageSize} h-${defaultImageSize} flex justify-center items-center rounded-full bg-gray-300 text-3xl`}
          >
            🙎🏻‍♂️
          </div>
        </div>
      )}
    </>
  );
}
