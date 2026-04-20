import { createElement } from "react";

const variants = {
  primary:
    "border border-blue-700 bg-blue-700 text-white shadow-sm hover:bg-blue-800 hover:shadow focus:ring-blue-200",
  secondary:
    "border border-gray-300 bg-white text-gray-700 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 focus:ring-blue-100",
  danger:
    "border border-red-600 bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow focus:ring-red-200",
  success:
    "border border-emerald-700 bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 hover:shadow focus:ring-emerald-200",
  warning:
    "border border-amber-600 bg-amber-600 text-white shadow-sm hover:bg-amber-700 hover:shadow focus:ring-amber-200",
  ghost:
    "border border-transparent bg-transparent text-gray-700 hover:bg-blue-50 hover:text-blue-800 focus:ring-blue-100",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return createElement(
    Component,
    {
      className: `inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`,
      ...props,
    },
    children
  );
}
