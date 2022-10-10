import Image from "next/image";
import { cls } from "../libs/client/utils";

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string | null;
}

export default function Message({
  message,
  avatarUrl,
  reversed,
}: MessageProps) {
  return (
    <div
      className={cls(
        "flex items-start",
        reversed ? "flex-row-reverse space-x-reverse" : "space-x-2"
      )}
    >
      {avatarUrl ? (
        reversed ? (
          ""
        ) : (
          <Image
            width={48}
            height={48}
            src={`https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${avatarUrl}/avatar`}
            className="w-8 h-8 rounded-full bg-slate-300"
          />
        )
      ) : (
        <div className="w-8 h-8 rounded-full bg-slate-400" />
      )}

      <div
        className={cls(
          "w-1/2 text-sm  p-2 rounded-2xl",
          reversed ? "bg-orange-500 text-white" : "bg-gray-100"
        )}
      >
        <p>{message}</p>
      </div>
    </div>
  );
}
