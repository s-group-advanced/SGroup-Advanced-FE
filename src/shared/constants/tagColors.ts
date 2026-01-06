// src/shared/constants/tagColors.ts
export const TAG_COLORS = [
  { id: "blue", name: "Blue", hex: "#3B82F6", bgClass: "bg-[#3B82F6]" },
  { id: "red", name: "Red", hex: "#EF4444", bgClass: "bg-[#EF4444]" },
  { id: "green", name: "Green", hex: "#10B981", bgClass: "bg-[#10B981]" },
  { id: "yellow", name: "Yellow", hex: "#F59E0B", bgClass: "bg-[#F59E0B]" },
  { id: "purple", name: "Purple", hex: "#8B5CF6", bgClass: "bg-[#8B5CF6]" },
  { id: "orange", name: "Orange", hex: "#F97316", bgClass: "bg-[#F97316]" },
  { id: "sky", name: "Sky", hex: "#06B6D4", bgClass: "bg-[#06B6D4]" },
  { id: "lime", name: "Lime", hex: "#84CC16", bgClass: "bg-[#84CC16]" },
] as const;

export type TagColorId = (typeof TAG_COLORS)[number]["id"];
