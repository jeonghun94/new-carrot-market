import Image from "next/image";
import { cls } from "../libs/client/utils";
import noImage from "public/no-image.png";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");
interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string | null;
  sendTime: string;
}

export default function Message({
  message,
  avatarUrl,
  reversed,
  sendTime,
}: MessageProps) {
  return (
    <div
      className={cls(
        "flex items-start",
        reversed ? "flex-row-reverse space-x-reverse" : "space-x-2"
      )}
    >
      {!reversed ? (
        avatarUrl ? (
          <Image
            alt="이미지를 불러올 수 없습니다:("
            width={33}
            height={33}
            src={
              avatarUrl
                ? `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${avatarUrl}/avatar`
                : noImage
            }
            className="w-6 h-6 rounded-full bg-slate-300"
          />
        ) : (
          <div className="w-9 h-9 flex justify-center items-center rounded-full bg-gray-300 text-2xl">
            🙎🏻‍♂️
          </div>
        )
      ) : null}

      <div
        className={`flex ${
          reversed ? "flex-row-reverse gap-2" : ""
        } items-center space-x-3`}
      >
        <div
          className={cls(
            "w-auto text-sm  p-2 rounded-2xl",
            reversed ? "bg-orange-500 text-white" : "bg-gray-100"
          )}
        >
          <p>{message}</p>
        </div>
        <p className="place-self-end pb-1 text-xs text-gray-400">
          {dayjs(sendTime).format("A HH:mm")}
        </p>
      </div>
    </div>
  );
}
