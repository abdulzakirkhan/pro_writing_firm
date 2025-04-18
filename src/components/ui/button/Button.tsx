import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  className?: string;
}

const Button = ({ text,onClick, className = "", ...rest }: ButtonProps) => {
  return (
    <button
      {...rest}
      className={`w-full bg-[#13A09D] text-white py-2 px-4 rounded-lg hover:bg-[#0F7F7C] transition-colors ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;