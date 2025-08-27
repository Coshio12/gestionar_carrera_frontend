export default function Button({ children, className = "", size = "md", ...props }) {
  const sizeClasses = {
    sm: "py-1 px-2 text-sm",
    md: "py-2 px-4 text-sm sm:text-base",
    lg: "py-3 px-6 text-base sm:text-lg"
  };

  const baseClasses = "bg-lime-500 hover:bg-lime-600 text-white font-bold rounded w-full transition-colors duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2";

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}