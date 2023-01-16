import { cls } from "@libs/client/utils";

interface ButtonProps {
  onClick?: () => void;
  opacity?: boolean;
  text: string;
}

const MutationButton = ({ onClick, opacity, text }: ButtonProps) => {
  const style =
    "w-full p-3 rounded-md bg-white text-blue-400 font-semibold mb-2";
  return (
    <button
      onClick={onClick}
      className={cls(
        style,
        opacity ? "bg-opacity-50 text-red-400 font-normal" : ""
      )}
    >
      {text}
    </button>
  );
};

export default MutationButton;
