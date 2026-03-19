export function ButtomConfirm({ text, disabled = false, onClick }) {
    const handleClick = (event) => {
        if (disabled) return;
        onClick?.(event);
    };

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={handleClick}
            className={`w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg transform transition hover:-translate-y-1 active:scale-95 ${disabled ? "bg-gray-400 cursor-not-allowed opacity-70" : "estilo ativo com hover/active"}`}
        >
            {text}
        </button>
    );
}
