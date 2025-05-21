import { ButtonHTMLAttributes } from "react";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  className?: string;
  size?: ButtonSize;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "py-1 px-2 text-sm",
  md: "py-2 px-4 text-base",
  lg: "py-3 px-6 text-lg",
};

const Button = ({
  text,
  onClick,
  className = "",
  size = "md",
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      className={`w-full bg-[#6da5f9] text-white rounded-lg hover:bg-[#0F7F7C] transition-colors ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
