import { BoardDetailProvider } from "@/app/providers/BoardDetailProvider";
import { ListProvider, CardDetailProvider } from "@/app/providers/index";
import { BoardWidget } from "@/widgets/board/ui/BoardWidget";

export function BoardPage() {
    return (
        <BoardDetailProvider>
            <ListProvider>
                <CardDetailProvider>
                    <BoardWidget />
                </CardDetailProvider>
            </ListProvider>
        </BoardDetailProvider>
    )
}