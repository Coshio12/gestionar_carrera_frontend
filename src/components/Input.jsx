export default function Input({ label, className = "", error, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          border border-gray-300 rounded px-3 sm:px-4 py-2 w-full 
          focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
          text-sm sm:text-base
          ${error ? 'border-red-500 focus:ring-red-400' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}