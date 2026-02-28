import { useState, useMemo, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";
import { FiCopy, FiX } from "react-icons/fi";
import { useBoardContext } from "@/features/providers/BoardProvider";
import { useCardDetailContext } from "@/features/providers/CardDetailProvider";
import { useLists } from "@/features/lists";
import { useCards, type Card } from "@/features/cards";
import type { List } from "@/features/lists";
import type { Board } from "@/features/boards";
import { toast } from "sonner";

interface CopyCardToAnotherListProps {
  cardId: string;
}

export function CopyCardToAnotherList({ cardId }: CopyCardToAnotherListProps) {
  const { fetchAllBoardsOfUserMemberOfWorkspace } = useBoardContext();
  const [boards, setBoards] = useState<Board[]>([]);
  const { cards, handleCopyCardToAnotherList } = useCardDetailContext();
  const { getAllListsOfBoard } = useLists();
  const { getAllCardsOfBoard } = useCards();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const card = useMemo(
    () => cards.find((c) => c.id === cardId),
    [cards, cardId],
  );

  // State cho tên thẻ copy + checkbox
  const [title, setTitle] = useState(card?.title ?? "");
  const [keepChecklists, setKeepChecklists] = useState(true);
  const [keepLabels, setKeepLabels] = useState(true);
  const [keepMembers, setKeepMembers] = useState(true);

  // State chọn board/list/position
  const [selectedBoardId, setSelectedBoardId] = useState<string>("");
  const [listsOfSelectedBoard, setListsOfSelectedBoard] = useState<List[]>([]);
  const [cardsOfSelectedBoard, setCardsOfSelectedBoard] = useState<Card[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<number>(1);

  useEffect(() => {
    fetchAllBoardsOfUserMemberOfWorkspace().then((boards) => {
      setBoards(boards as unknown as Board[]);
    });
  }, [fetchAllBoardsOfUserMemberOfWorkspace]);

  useEffect(() => {
    if (!card || !card.board_id) return;
    if (!boards.length) return;
    if (selectedBoardId) return;

    const defaultBoardId = card.board_id;
    setSelectedBoardId(defaultBoardId);
    handleSelectBoard(defaultBoardId);
  }, [card, boards, selectedBoardId]);

  // Card trong list đang chọn để tính số lượng position
  const cardsInSelectedList = useMemo(() => {
    if (!selectedListId) return [];
    return cardsOfSelectedBoard
      .filter((c) => c.list_id === selectedListId)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }, [cardsOfSelectedBoard, selectedListId]);

  useEffect(() => {
    if (!card) return;
    if (!cardsInSelectedList.length) return;

    if (selectedBoardId !== card.board_id) return;
    if (selectedListId !== card.list_id) return;

    const index = cardsInSelectedList.findIndex((c) => c.id === card.id);
    if (index === -1) return;

    const position = index + 1;
    setSelectedPosition(position);
  }, [card, selectedBoardId, selectedListId, cardsInSelectedList]);

  // Option position = 1..N+1 (chèn đầu/giữa/cuối)
  const positionOptions = useMemo(
    () =>
      Array.from({ length: cardsInSelectedList.length + 1 }, (_, i) => i + 1),
    [cardsInSelectedList.length],
  );

  // Khi chọn board → fetch lists + cards cho board đó
  const handleSelectBoard = async (boardId: string) => {
    setSelectedBoardId(boardId);
    setSelectedListId("");
    setSelectedPosition(1);

    try {
      const listData = await getAllListsOfBoard({ boardId });
      const lists = (listData as unknown as List[]) ?? [];
      setListsOfSelectedBoard(lists);

      const cardData = await getAllCardsOfBoard({ boardId });
      let boardCards: Card[] = [];
      if (Array.isArray(cardData)) {
        boardCards = cardData as Card[];
      } else if (
        cardData &&
        typeof cardData === "object" &&
        "cards" in cardData
      ) {
        boardCards = (cardData as any).cards || [];
      }
      setCardsOfSelectedBoard(boardCards);

      // Gán mặc định list theo card hiện tại nếu cùng board, hoặc list đầu tiên
      setSelectedListId((prev) => {
        if (prev && lists.some((l) => l.id === prev)) return prev;
        if (card && boardId === card.board_id) return card.list_id;
        return lists[0]?.id ?? "";
      });
    } catch (err) {
      console.error("Failed to load lists/cards for board", err);
      setListsOfSelectedBoard([]);
      setCardsOfSelectedBoard([]);
    }
  };

  // Khi chọn list → reset position về 1
  const handleSelectList = (listId: string) => {
    setSelectedListId(listId);
    setSelectedPosition(1);
  };

  // Tạm thời chỉ UI, chưa gọi API copy
  const handleCreateCopy = async () => {
    if (!selectedListId) return;

    const trimmedTitle = title.trim();
    const newIndex = selectedPosition ? selectedPosition - 1 : undefined;

    try {
      await handleCopyCardToAnotherList({
        cardId,
        targetListId: selectedListId,
        title: trimmedTitle,
        newIndex,
        includeChecklists: keepChecklists,
        includeLabels: keepLabels,
        includeMembers: keepMembers,
      });

      toast.success("Card copied to another list successfully", {
        position: "top-center",
      });
    } catch (err) {
      console.error("Failed to copy card to another list", err);
    }
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <button className="flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors text-left">
          <FiCopy className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold">Copy card</span>
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-80 p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Copy card</h3>
          <button className="p-1 rounded hover:bg-gray-100" onClick={() => setPopoverOpen(false)}>
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Tên thẻ */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Name</label>
          <input
            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter card title..."
          />
        </div>

        {/* Giữ... */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Keep...
          </p>
          {Array.isArray(card?.checklists) && card.checklists.length > 0 && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={keepChecklists}
                onChange={(e) => setKeepChecklists(e.target.checked)}
              />
              <span>
                Checklists
                {card?.checklists?.length != null &&
                  ` (${card.checklists.length})`}
              </span>
            </label>
          )}
          {Array.isArray(card?.labels) && card.labels.length > 0 && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={keepLabels}
                onChange={(e) => setKeepLabels(e.target.checked)}
              />
              <span>
                Labels
                {card?.labels?.length != null && ` (${card.labels.length})`}
              </span>
            </label>
          )}
          {Array.isArray(card?.cardMembers) && card.cardMembers.length > 0 && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={keepMembers}
                onChange={(e) => setKeepMembers(e.target.checked)}
              />
              <span>
                Members
                {card?.cardMembers?.length != null &&
                  ` (${card.cardMembers.length})`}
              </span>
            </label>
          )}
        </div>

        {/* Sao chép tới... */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Copy to...
          </p>

          {/* Board */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Board information
            </label>
            <Select
              value={selectedBoardId}
              onValueChange={(value) => {
                handleSelectBoard(value);
              }}
            >
              <SelectTrigger className="w-full bg-white border-gray-200 text-sm">
                <SelectValue placeholder="Select board" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="bg-white text-gray-700 border-gray-200"
              >
                {boards.map((b) => (
                  <SelectItem key={b.id} value={b.id} className="text-gray-700">
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* List + Position */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">List</label>
              <Select
                value={selectedListId}
                onValueChange={(value) => handleSelectList(value)}
              >
                <SelectTrigger className="w-full bg-white border-gray-200 text-sm">
                  <SelectValue placeholder="Select list" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="bg-white text-gray-700 border-gray-200"
                >
                  {listsOfSelectedBoard.map((l) => (
                    <SelectItem
                      key={l.id}
                      value={l.id}
                      className="text-gray-700"
                    >
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Position
              </label>
              <Select
                value={selectedPosition.toString()}
                onValueChange={(value) => setSelectedPosition(Number(value))}
              >
                <SelectTrigger className="w-full bg-white border-gray-200 text-sm">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="bg-white text-gray-700 border-gray-200"
                >
                  {positionOptions.map((pos) => (
                    <SelectItem
                      key={pos}
                      value={pos.toString()}
                      className="text-gray-700"
                    >
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Button
          className="w-full text-sm font-semibold cursor-pointer"
          onClick={handleCreateCopy}
        >
          Copy card
        </Button>
      </PopoverContent>
    </Popover>
  );
}
