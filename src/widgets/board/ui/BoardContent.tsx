import { useListContext } from "@/features/providers/index";
import { BoardList } from "../components/List/BoardList";
import { AddListButton } from "../components/List/AddListButton";

export function BoardContent() {
    const { list, isLoading } = useListContext();

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }
    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
            <div className="flex gap-4 h-full items-start">
                {list?.map((list) => (
                    <BoardList key={list.id} list={list} />
                ))}

                <AddListButton />
            </div>
        </div>
    )
}