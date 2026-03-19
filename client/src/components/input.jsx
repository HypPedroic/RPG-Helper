


export function Input({
    id,
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    hasError = false,
    errorMessage = "",
}) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-slate-200">
                {label}
            </label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-3 rounded-xl bg-slate-800/80 border text-slate-100 placeholder-slate-500 outline-none transition ${
                    hasError
                        ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        : "border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                }`}
            />
            {hasError && errorMessage ? (
                <p className="text-xs text-red-400">{errorMessage}</p>
            ) : null}
        </div>
    );
}