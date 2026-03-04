import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

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
      style,
      onMouseEnter: onMouseEnterProp,
      onMouseLeave: onMouseLeaveProp,
      ...props
    },
    ref
  ) => {
    const sizeMap = {
      sm: {
        height: 34,
        paddingInline: 14,
        fontSize: 12,
        borderRadius: 8,
        gap: 6,
      },
      md: {
        height: 38,
        paddingInline: 18,
        fontSize: 13,
        borderRadius: 10,
        gap: 7,
      },
      lg: {
        height: 44,
        paddingInline: 22,
        fontSize: 14,
        borderRadius: 12,
        gap: 8,
      },
    };

    const s = sizeMap[size];

    const baseStyle: React.CSSProperties = {
      height: s.height,
      paddingInline: s.paddingInline,
      fontSize: s.fontSize,
      borderRadius: s.borderRadius,
      gap: s.gap,
      fontFamily: "var(--dash-font-body, 'Inter', sans-serif)",
      fontWeight: 600,
      letterSpacing: "-0.01em",
      cursor: disabled || isLoading ? "not-allowed" : "pointer",
      opacity: disabled || isLoading ? 0.5 : 1,
      transition: "all 0.2s ease",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      whiteSpace: "nowrap" as const,
      border: "none",
      outline: "none",
    };

    const variantMap: Record<string, React.CSSProperties> = {
      primary: {
        background: "linear-gradient(135deg, #4F7DF3, #7A5CFF)",
        color: "#fff",
        boxShadow: "0 2px 8px rgba(79,125,243,0.25)",
      },
      secondary: {
        background: "var(--dash-surface, #fff)",
        color: "var(--dash-text-secondary, #475569)",
        border: "1.5px solid var(--dash-border-solid, #E8ECF4)",
        boxShadow: "none",
      },
      ghost: {
        background: "transparent",
        color: "var(--dash-text-secondary, #475569)",
        boxShadow: "none",
      },
      danger: {
        background: "linear-gradient(135deg, #EF4444, #DC2626)",
        color: "#fff",
        boxShadow: "0 2px 8px rgba(239,68,68,0.25)",
      },
    };

    const mergedStyle: React.CSSProperties = {
      ...baseStyle,
      ...variantMap[variant],
      ...style,
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;
      const el = e.currentTarget;
      if (variant === "primary") {
        el.style.boxShadow = "0 4px 14px rgba(79,125,243,0.35)";
        el.style.transform = "translateY(-1px)";
      } else if (variant === "secondary") {
        el.style.background = "rgba(0,0,0,0.02)";
        el.style.borderColor = "var(--dash-border-hover, #D1D5DB)";
      } else if (variant === "ghost") {
        el.style.background = "rgba(0,0,0,0.04)";
      } else if (variant === "danger") {
        el.style.boxShadow = "0 4px 14px rgba(239,68,68,0.35)";
        el.style.transform = "translateY(-1px)";
      }
      onMouseEnterProp?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;
      const el = e.currentTarget;
      el.style.transform = "translateY(0)";
      if (variant === "primary") {
        el.style.boxShadow = "0 2px 8px rgba(79,125,243,0.25)";
      } else if (variant === "secondary") {
        el.style.background = (style?.background as string) || "var(--dash-surface, #fff)";
        el.style.borderColor = "var(--dash-border-solid, #E8ECF4)";
      } else if (variant === "ghost") {
        el.style.background = "transparent";
      } else if (variant === "danger") {
        el.style.boxShadow = "0 2px 8px rgba(239,68,68,0.25)";
      }
      onMouseLeaveProp?.(e);
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={className}
        style={mergedStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {isLoading && <Loader2 style={{ width: 15, height: 15 }} className="animate-spin" />}

        {!isLoading && leftIcon && (
          <span style={{ display: "flex", alignItems: "center" }}>{leftIcon}</span>
        )}

        <span style={{ lineHeight: 1 }}>{children}</span>

        {!isLoading && rightIcon && (
          <span style={{ display: "flex", alignItems: "center" }}>{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
