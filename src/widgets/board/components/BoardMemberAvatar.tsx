import { useBoardDetail } from "@/features/providers/BoardDetailProvider";

export function BoardMemberAvatar() {
    const { membersOfBoard } = useBoardDetail();

    const displayMembers = membersOfBoard.slice(0, 2);
    const remainingCount = membersOfBoard.length - 2;

    if (membersOfBoard.length === 0) return null;

    return (
        <div className="flex items-center -space-x-2">
      {displayMembers.map((member) => (
        <div
          key={member.user_id}
          className="relative w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden hover:z-10 transition-all cursor-pointer"
          title={member.user.name}
        >
          {member.user.avatar_url ? (
            <img
              src={member.user.avatar_url}
              alt={member.user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-xs font-semibold">
              {member.user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div
          className="relative w-8 h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-700 hover:z-10 transition-all cursor-pointer"
          title={`${remainingCount} more member${remainingCount > 1 ? 's' : ''}`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
    )
}