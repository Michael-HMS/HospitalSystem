import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "small" | "medium" | "large";

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: "start" | "end";
    link?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 border border-transparent disabled:bg-blue-300",
    secondary:
        "bg-white text-blue-600 hover:bg-blue-50 active:bg-blue-100 border border-blue-600 disabled:text-blue-300 disabled:border-blue-300",
};

const sizeClasses: Record<ButtonSize, string> = {
    small: "px-3 py-1.5 text-sm gap-1.5 rounded-md",
    medium: "px-4 py-2 text-base gap-2 rounded-lg",
    large: "px-6 py-3 text-lg gap-2.5 rounded-xl",
};

const spinnerSizeClasses: Record<ButtonSize, string> = {
    small: "w-3.5 h-3.5",
    medium: "w-4 h-4",
    large: "w-5 h-5",
};

export default function Button({
    children,
    className = "",
    variant = "primary",
    size = "medium",
    disabled = false,
    loading = false,
    icon,
    iconPosition = "start",
    link,
    type = "button",
    ...restProps
}: IButton) {
    const isDisabled = disabled || loading;

    const baseClasses = [
        "inline-flex items-center justify-center font-medium",
        "transition-colors duration-150 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const spinner = loading && (
        <svg
            className={`animate-spin shrink-0 ${spinnerSizeClasses[size]}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
        </svg>
    );

    const iconNode = !loading && icon && (
        <span className="shrink-0 inline-flex">{icon}</span>
    );

    const content = (
        <>
            {iconPosition === "start" && (loading ? spinner : iconNode)}
            {children}
            {iconPosition === "end" && (loading ? spinner : iconNode)}
        </>
    );

    if (link) {
        return (
            <Link 
                to={isDisabled ? "#" : link} 
                className={baseClasses}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : undefined}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            type={type}
            disabled={isDisabled}
            aria-busy={loading}
            className={baseClasses}
            {...restProps}
        >
            {content}
        </button>
    );
}