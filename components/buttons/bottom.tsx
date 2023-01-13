import { cls } from "@libs/client/utils";

interface ButtonProps {
  onClick?: () => void;
  accent?: boolean;
  text: string;
}

const BottomButton = ({ onClick, accent, text }: ButtonProps) => {
  const style = "w-full p-3 rounded-md";
  return (
    <button
      onClick={onClick}
      className={cls(
        style,
        accent ? "font-semibold  bg-orange-400 text-white" : ""
      )}
    >
      {text}
    </button>
  );
};

export default BottomButton;
