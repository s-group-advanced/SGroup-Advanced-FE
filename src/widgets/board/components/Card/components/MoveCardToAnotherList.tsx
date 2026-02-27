import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover/index";
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from "@/shared/ui/select/index";
import { FiArrowRight, FiX } from "react-icons/fi";
import { Button } from "@/shared/ui/button/index";
import { useEffect, useMemo, useState } from "react";
import { useBoardContext } from "@/features/providers/BoardProvider";
import type { Board } from "@/features/boards/api/type";
import { useParams } from "react-router-dom";
import { useCardDetailContext } from "@/features/providers/CardDetailProvider";
import { useLists } from "@/features/lists";
import { useCards, type Card } from "@/features/cards";
import type { List } from "@/features/lists";

interface MoveCardToAnotherListProps {
    cardId: string;
}
export function MoveCardToAnotherList({ cardId }: MoveCardToAnotherListProps) {
    const { fetchAllBoardsOfUserMemberOfWorkspace } = useBoardContext();
    const [boards, setBoards] = useState<Board[]>([]);
    const { boardId } = useParams<{ boardId: string }>();
    const { cards } = useCardDetailContext();

    const { getAllListsOfBoard } = useLists();
    const { getAllCardsOfBoard } = useCards();

    // Data theo board đang chọn trong select
    const [listsOfSelectedBoard, setListsOfSelectedBoard] = useState<List[]>([]);
    const [cardsOfSelectedBoard, setCardsOfSelectedBoard] = useState<Card[]>([]);
    
    const card = useMemo(() => cards.find(c => c.id === cardId), [cards, cardId]);
        
    const [selectedBoardId, setSelectedBoardId] = useState("");
    const [selectedListId, setSelectedListId] = useState("");
    const [selectedPosition, setSelectedPosition] = useState(0);

    const { handleMoveCardToList } = useCardDetailContext();
    
    // Các card trong list đang chọn, sort theo position
    const cardsInSelectedList = useMemo(() => {
    if (!selectedListId) return [];
    
    return cardsOfSelectedBoard
        .filter((c) => c.list_id === selectedListId)  
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    }, [cardsOfSelectedBoard, selectedListId]);
    
    // Option position: 1..n theo số card trong list
    const positionOptions = useMemo(
        () => Array.from(
          { length: cardsInSelectedList.length + 1 },     // N card -> N+1 vị trí
          (_, index) => index + 1,
        ),
        [cardsInSelectedList.length],
      );
    
      const handleMove = async () => {
        if (!selectedListId) {
            return;
        }

        if (!selectedPosition || selectedPosition < 1) {
            return;
        }

        const newIndex = selectedPosition - 1;

        try {
            await handleMoveCardToList({
                cardId: cardId,
                targetListId: selectedListId,
                newIndex: newIndex,
            });
        } catch (err) {
            console.error("Failed to move card to another list", err);
        }
      };

      useEffect(() => {
        fetchAllBoardsOfUserMemberOfWorkspace().then((boards) => {
            setBoards(boards as unknown as Board[]);
        });
      }, [fetchAllBoardsOfUserMemberOfWorkspace]);

      useEffect(() => {
        if (!boards.length) return;

        setSelectedBoardId((prev) => {
            if (prev) return prev;

            if (boardId && boards.some((b) => b.id === boardId)) {
                return boardId;
              }
        
              // Fallback: board đầu tiên trong danh sách
              return boards[0].id;
            });
          }, [boards, boardId]);

          useEffect(() => {
            if (!card) return;
            setSelectedListId((prev) => prev || card.list_id);
            }, [card]);
          
          
          // Khi positionOptions đã tính xong, set position mặc định = position hiện tại
          useEffect(() => {
            if (!card || !cardsInSelectedList.length) return;
          
            const index = cardsInSelectedList.findIndex((c) => c.id === card.id);
            if (index === -1) return;
          
            const position = index + 1; // 1-based
            setSelectedPosition((prev) => prev || position);
          }, [card, cardsInSelectedList]);

          useEffect(() => {
            const targetBoardId = selectedBoardId || card?.board_id;
            if (!targetBoardId) return;
          
            (async () => {
              try {
                // 1. Lấy list của board đang chọn
                const listData = await getAllListsOfBoard({ boardId: targetBoardId });
                const lists = (listData as unknown as List[]) ?? [];
                setListsOfSelectedBoard(lists);
          
                // 2. Lấy cards của board đang chọn (để tính position)
                const cardData = await getAllCardsOfBoard({ boardId: targetBoardId });

                let boardCards: Card[] = [];

                if (Array.isArray(cardData)) {
                // trường hợp API trả thẳng Card[]
                boardCards = cardData as Card[];
                } else if (cardData && typeof cardData === "object" && "cards" in cardData) {
                // trường hợp API trả { cards: Card[] }
                boardCards = (cardData as any).cards || [];
                }

                setCardsOfSelectedBoard(boardCards);
          
                // 3. Set default list:
                setSelectedListId((prev) => {
                  // nếu user đã chọn rồi và list vẫn tồn tại trong board này thì giữ nguyên
                  if (prev && lists.some((l) => l.id === prev)) return prev;
          
                  // nếu là board hiện tại của card, chọn list của card
                  if (card && targetBoardId === card.board_id) {
                    return card.list_id;
                  }
          
                  // còn lại: chọn list đầu tiên của board mới
                  return lists[0]?.id ?? "";
                });
          
                // 4. Reset position về 1 cho board mới
                setSelectedPosition(1);
              } catch (err) {
                console.error("Failed to fetch lists/cards of selected board", err);
                setListsOfSelectedBoard([]);
                setCardsOfSelectedBoard([]);
                setSelectedPosition(1);
              }
            })();
          }, [selectedBoardId, card?.board_id]);
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors text-left">
                    <FiArrowRight className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold">Move card</span>
                </button>
            </PopoverTrigger>
            <PopoverContent>
                {/* Header */}
                <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Move card</h3>
                <button className="p-1 hover:bg-gray-100 transition-colors rounded-md">
                    <FiX className="w-4 h-4" />
                </button>
                </div>

                {/* Chọn đích đến */}
                <div className="space-y-3">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Select destination
                </p>

                {/* Bảng thông tin */}
                <div className="space-y-1">
                    <label className="text-xs text-gray-500 font-medium">Board information</label>
                    <Select
                    value={selectedBoardId}
                    onValueChange={(value) => {
                        setSelectedBoardId(value);
                        setSelectedListId("");
                        setSelectedPosition(1);
                    }}
                    >
                    <SelectTrigger className="w-full bg-white border-gray-200 text-sm">
                        <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-500 border-gray-200" position="popper">
                        {boards.map((board) => (
                        <SelectItem key={board.id} value={board.id} className="text-gray-500 font-medium">
                            {board.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>

                {/* Danh sách + Vị trí */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="space-y-1">
                    <label className="text-xs text-gray-500 font-medium">List</label>
                    <Select
                        value={selectedListId}
                        onValueChange={(value) => {
                            setSelectedListId(value);
                            setSelectedPosition(1);
                        }}
                    >
                        <SelectTrigger className="w-full bg-white border-gray-200 text-sm">
                        <SelectValue placeholder="Select list" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-gray-500 border-gray-200" position="popper">
                            {listsOfSelectedBoard.map((l) => (
                                <SelectItem key={l.id} value={l.id} className="text-gray-500 font-medium">
                                {l.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                    </Select>
                    </div>

                    <div className="space-y-1">
                    <label className="text-xs text-gray-500 font-medium">Position</label>
                    <Select
                        value={selectedPosition.toString()}
                        onValueChange={(value) => setSelectedPosition(Number(value))}
                        >
                        <SelectTrigger className="w-full bg-white border-gray-200 text-sm">
                            <SelectValue placeholder="Position" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-gray-500 border-gray-200" position="popper">
                            {positionOptions.map((pos) => (
                            <SelectItem key={pos} value={pos.toString()} className="text-gray-500 font-medium">
                                {pos}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                </div>
                </div>

                {/* Nút Di chuyển */}
                <Button
                variant="default"
                className="w-full text-sm font-semibold cursor-pointer"
                onClick={handleMove}
                >
                Move card
                </Button>
            </PopoverContent>
        </Popover>
    )
}