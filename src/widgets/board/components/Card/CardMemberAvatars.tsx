import type { Card } from "@/features/cards/index";
import { useBoardDetail } from "@/features/providers/BoardDetailProvider";
import { useMemo } from "react";

interface CardMemberAvatarsProps {
    card: Card;
    maxDisplay?: number;
}

export function CardMemberAvatars({ card, maxDisplay = 2 }: CardMemberAvatarsProps) {
    const { membersOfBoard } = useBoardDetail();

    const assignedUsers = useMemo(() => {
        if (!card.cardMembers || card.cardMembers.length === 0) return [];

        return card.cardMembers
            .map(cardMember => {
                const memberInfo = membersOfBoard.find(m => m.user_id === cardMember.user_id);
                if (!memberInfo) return null;

                return {
                    user_id: cardMember.user_id,
                    name: memberInfo.user.name,
                    avatar_url: memberInfo.user.avatar_url,
                };
            })
            .filter(Boolean) as any[];
    }, [card.cardMembers, membersOfBoard]);

    if (assignedUsers.length === 0) return null;

    const displayMembers = assignedUsers.slice(0, maxDisplay);
    const remainingCount = assignedUsers.length - maxDisplay;

    return (
        <div className="flex items-center -space-x-2">
            {displayMembers.map((user) => (
                <div
                    key={user.user_id}
                    className="relative w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden hover:z-10 transition-all"
                    title={user.name}
                >
                    {user.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-[10px] font-semibold">
                            {user.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                    )}
                </div>
            ))}
            
            {remainingCount > 0 && (
                <div
                    className="relative w-6 h-6 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-[10px] font-semibold text-gray-700 hover:z-10 transition-all"
                    title={`${remainingCount} more`}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
}