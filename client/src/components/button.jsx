export function Button({ text, onClick, disabled = false }) {
    const handleClick = (event) => {
        if (disabled) return;
        onClick?.(event);
    };

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={handleClick}
            className={`w-full bg-linear-to-r from-blue-500 to-green-500 hover:from-blue-400 hover:to-green-400 text-white font-bold py-3 rounded-xl shadow-lg transform transition hover:-translate-y-1 active:scale-95 ${disabled ? "bg-gray-400 cursor-not-allowed opacity-70" : "estilo ativo com hover/active"}`}
        >
            {text}
        </button>
    );
}