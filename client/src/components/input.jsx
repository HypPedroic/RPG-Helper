


export function Input({
    id,
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    hasError = false,
    errorMessage = "",
    isValidating = false,
    isAvailable = null,
}) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-slate-200">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-800/80 border text-slate-100 placeholder-slate-500 outline-none transition ${
                        hasError
                            ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            : isAvailable === false
                            ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            : isAvailable === true
                            ? "border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            : "border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                />
                {isValidating && (
                    <span className="absolute right-3 top-3 text-purple-400 animate-spin">⏳</span>
                )}
                {!isValidating && isAvailable === true && (
                    <span className="absolute right-3 top-3 text-green-400 text-lg">✓</span>
                )}
                {!isValidating && isAvailable === false && (
                    <span className="absolute right-3 top-3 text-red-400 text-lg">✕</span>
                )}
            </div>
            {(hasError || (isAvailable === false)) && errorMessage ? (
                <p className="text-xs text-red-400">{errorMessage}</p>
            ) : null}
            {!isValidating && isAvailable === true && (id === "email" || id === "nickname") ? (
                <p className="text-xs text-green-400">✓ Disponível!</p>
            ) : null}
        </div>
    );
}