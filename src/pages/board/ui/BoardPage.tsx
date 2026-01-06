import { BoardDetailProvider } from "@/app/providers/BoardDetailProvider";
import { ListProvider, CardDetailProvider } from "@/app/providers/index";
import { BoardWidget } from "@/widgets/board/ui/BoardWidget";
import { LabelProvider } from "@/app/providers/LabelProvider";
import { ChecklistProvider } from "@/app/providers/ChecklistProvider";

export function BoardPage() {
    return (
        <BoardDetailProvider>
            <ListProvider>
                <CardDetailProvider>
                    <LabelProvider>
                        <ChecklistProvider>
                            <BoardWidget />
                        </ChecklistProvider>
                    </LabelProvider>
                </CardDetailProvider>
            </ListProvider>
        </BoardDetailProvider>
    )
}