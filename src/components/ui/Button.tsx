import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles = {
  primary: `
    bg-gradient-to-r from-blue-600 to-blue-700
    text-white
    hover:from-blue-700 hover:to-blue-800
    active:from-blue-800 active:to-blue-900
    focus-visible:ring-blue-500
    shadow-sm hover:shadow-md
  `,
  secondary: `
    bg-white
    text-gray-700
    border border-gray-300
    hover:bg-gray-50
    active:bg-gray-100
    focus-visible:ring-gray-400
  `,
  ghost: `
    bg-transparent
    text-gray-700
    hover:bg-gray-100
    active:bg-gray-200
    focus-visible:ring-gray-400
  `,
  danger: `
    bg-gradient-to-r from-red-500 to-red-600
    text-white
    hover:from-red-600 hover:to-red-700
    active:from-red-700 active:to-red-800
    focus-visible:ring-red-500
    shadow-sm hover:shadow-md
  `,
};

const sizeStyles = {
  sm: "h-9 px-4 text-sm rounded-md",
  md: "h-11 px-5 text-sm rounded-lg",
  lg: "h-13 px-6 text-base rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center
          gap-2
          font-medium
          rounded-lg
          whitespace-nowrap
          transition-colors
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {/* Loader (keeps width stable) */}
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}

        {!isLoading && leftIcon && (
          <span className="flex items-center">{leftIcon}</span>
        )}

        <span className="leading-none">{children}</span>

        {!isLoading && rightIcon && (
          <span className="flex items-center">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
