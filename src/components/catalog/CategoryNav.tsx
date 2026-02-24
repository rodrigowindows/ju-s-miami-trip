import { LayoutGrid, Smartphone, Sparkles, Shirt, Heart, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useMemo } from "react";

const ICON_MAP: Record<string, LucideIcon> = {
  Todos: LayoutGrid,
  Tech: Smartphone,
  Beauty: Sparkles,
  Fashion: Shirt,
  Lifestyle: Heart,
};

interface CategoryNavProps {
  active: string;
  onSelect: (category: string) => void;
  variant?: "dark" | "light";
}

export function CategoryNav({ active, onSelect, variant = "dark" }: CategoryNavProps) {
  const isDark = variant === "dark";
  const { data: settings } = useSettings();

  const categoryList = useMemo(() => {
    const raw = settings?.categories ?? "Tech,Beauty,Fashion,Lifestyle";
    const cats = raw.split(",").map((c) => c.trim()).filter(Boolean);
    return [
      { label: "Todos", icon: ICON_MAP["Todos"] ?? LayoutGrid },
      ...cats.map((c) => ({ label: c, icon: ICON_MAP[c] ?? Tag })),
    ];
  }, [settings?.categories]);

  return (
    <div
      className={`px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide ${
        isDark ? "bg-[#131921]" : "bg-white border-b border-gray-200"
      }`}
    >
      {categoryList.map(({ label, icon: Icon }) => {
        const isActive = active === label;
        return (
          <button
            key={label}
            onClick={() => onSelect(label)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isDark
                ? isActive
                  ? "bg-amber-400 text-gray-900"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                : isActive
                ? "bg-[#131921] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
