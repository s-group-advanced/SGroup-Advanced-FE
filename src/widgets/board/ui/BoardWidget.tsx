// Main Container
import { useBoardDetail } from "@/app/providers/BoardDetailProvider";
import { BoardHeader } from "./BoardHeader";
import { BoardContent } from "./BoardContent";
export function BoardWidget() {
    const { isLoading, error } = useBoardDetail();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg font-medium text-gray-700">
                    Loading...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg font-medium text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-white ">
            <BoardHeader />
                <div className="flex-1 p-4">
                    <BoardContent />
                </div>
        </div>
    );
}