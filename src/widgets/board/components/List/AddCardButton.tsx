import { useState } from "react";
import { FiPlus } from "react-icons/fi";

export function AddCardButton() {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState("");

    const handleAdd = () => {
        if (title.trim()) {
            console.log("Add card:", title);
            setTitle("");
            setIsAdding(false);
        }
    };

    const handleCancel = () => {
        setTitle("");
        setIsAdding(false);
    };

    if (isAdding) {
        return (
            <div className="w-72 bg-gray-100 rounded-lg p-4 flex-shrink-0">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter list title..."
                    className="w-full p-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 shadow-sm hover:shadow-md transition-shadow mb-2 mt-2"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleAdd();
                        if (e.key === "Escape") handleCancel();
                    }}
                />
                <div className="flex items-center gap-2 mt-2">
                    <button
                        onClick={handleAdd}
                        disabled={!title.trim()}
                        className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        Add list
                    </button>
                    <button
                        onClick={handleCancel}
                        className="px-3 py-1.5 text-gray-600 text-sm hover:bg-gray-200 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setIsAdding(true)}
            className="w-72 bg-gray-200 hover:bg-gray-300 rounded-lg p-3 flex items-center gap-2 text-gray-700 transition-colors flex-shrink-0 min-h-[100px]"
        >
            <FiPlus className="w-5 h-5" />
            <span className="font-medium text-sm">Add a list</span>
        </button>
    );
}