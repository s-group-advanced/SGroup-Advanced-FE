import { useListContext } from "@/features/providers/ListProvider";
import { useCardDetailContext } from "@/features/providers/CardDetailProvider";
import { BoardList } from "../components/List/BoardList";
import { AddListButton } from "../components/List/AddListButton";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { useState } from "react";

export function BoardContent() {
    const { list, isLoading, fetchReorderList } = useListContext();
    const { handleMoveCardToList } = useCardDetailContext();
    const [isDraggingList, setIsDraggingList] = useState(false);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    const onDragStart = (result: any) => {
        
        // Only set true when drag list
        if (result.type === "list") {
            setIsDraggingList(true);
        }
    }

    const onDragEnd = async (result: DropResult) => {
        
        setIsDraggingList(false);
        
        const { destination, source, draggableId, type } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if (type === "list") {
            try {
                await fetchReorderList({
                    listId: draggableId,
                    newIndex: destination.index,
                });
            } catch (err) {
                console.error(`Failed to reorder list: ${err}`);
            }
            return;
        }

        if (type === "card") {
            const destListId = destination.droppableId;

            try {
                await handleMoveCardToList({
                    cardId: draggableId,
                    targetListId: destListId,
                    newIndex: destination.index,
                });
            } catch (err) {
                console.error(`Failed to move card to list:`, err);
            }
        }
    }

    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <Droppable droppableId="all-lists" direction="horizontal" type="list">
                    {(provided) => (
                        <div 
                            className="flex gap-4 h-full items-start"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {list?.map((list, index) => (
                                <BoardList 
                                    key={list.id} 
                                    list={list} 
                                    index={index}
                                    isDraggingList={isDraggingList}
                                />
                            ))}
                            {provided.placeholder}
                            <AddListButton />
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}