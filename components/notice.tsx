import { cls } from "@libs/client/utils";

interface NoticeProps {
  bgColor?: string;
  text: string;
}

const Notice = ({ bgColor, text }: NoticeProps) => {
  return (
    <div
      className={`${bgColor ? bgColor : "bg-gray-100"} p-5 rounded-md text-sm`}
    >
      <p>{text}</p>
      <p className="text-gray-500 underline">자세히 보기</p>
    </div>
  );
};

export default Notice;
