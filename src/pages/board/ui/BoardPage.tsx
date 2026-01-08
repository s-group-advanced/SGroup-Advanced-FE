import { BoardDetailProvider } from "@/features/providers/BoardDetailProvider";
import { ListProvider, CardDetailProvider } from "@/features/providers/index";
import { BoardWidget } from "@/widgets/board/ui/BoardWidget";
import { LabelProvider } from "@/features/providers/LabelProvider";
import { ChecklistProvider } from "@/features/providers/ChecklistProvider";

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