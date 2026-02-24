import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { CATEGORY_LIST } from "./catalog-utils";
import { MEGA_MENU_CATEGORIES } from "./mega-menu-data";

interface CategoryNavProps {
  active: string;
  onSelect: (category: string) => void;
  variant?: "dark" | "light";
}

/** Map mega-menu labels → DB category */
const SUBCATEGORY_MAP: Record<string, string> = {
  Maquiagem: "Beauty",
  Skincare: "Beauty",
  Perfumes: "Beauty",
  "Eletrônicos": "Tech",
  Roupas: "Fashion",
  Bolsas: "Fashion",
};

/** Which pills get a subcategory dropdown (desktop only) */
const PILL_SUBCATEGORIES: Record<string, string[]> = {};
for (const cat of MEGA_MENU_CATEGORIES) {
  const dbCat = SUBCATEGORY_MAP[cat.label] ?? "Lifestyle";
  if (!PILL_SUBCATEGORIES[dbCat]) PILL_SUBCATEGORIES[dbCat] = [];
  PILL_SUBCATEGORIES[dbCat].push(cat.label);
}

export function CategoryNav({ active, onSelect, variant = "dark" }: CategoryNavProps) {
  const isDark = variant === "dark";
  const [hovered, setHovered] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const openDropdown = useCallback((label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(label);
  }, []);

  const closeDropdown = useCallback(() => {
    timeoutRef.current = setTimeout(() => setHovered(null), 150);
  }, []);

  const keepOpen = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const hoveredSubs = hovered ? PILL_SUBCATEGORIES[hovered] : null;
  const hoveredMegaData = hoveredSubs
    ? MEGA_MENU_CATEGORIES.filter((c) => hoveredSubs.includes(c.label))
    : [];

  return (
    <div className="relative" ref={navRef}>
      <div
        className={`px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide ${
          isDark ? "bg-[#131921]" : "bg-white border-b border-gray-200"
        }`}
      >
        {CATEGORY_LIST.map(({ label, displayLabel, icon: Icon }) => {
          const isActive = active === label;
          const hasSub = !!PILL_SUBCATEGORIES[label];

          return (
            <button
              key={label}
              onClick={() => {
                onSelect(label);
                setHovered(null);
              }}
              onMouseEnter={() => hasSub && openDropdown(label)}
              onMouseLeave={closeDropdown}
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
              {displayLabel}
              {hasSub && (
                <ChevronDown
                  size={12}
                  className={`hidden md:block transition-transform ${hovered === label ? "rotate-180" : ""}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop dropdown with brands */}
      {hovered && hoveredMegaData.length > 0 && (
        <div
          className="hidden md:block absolute left-0 right-0 bg-white z-[100] border-t border-gray-200"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
          onMouseEnter={keepOpen}
          onMouseLeave={closeDropdown}
        >
          <div className="max-w-6xl mx-auto px-6 py-5">
            <div className="flex gap-10">
              {hoveredMegaData.map((group) => (
                <div key={group.label} className="min-w-[160px]">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 pb-1 border-b border-gray-100">
                    {group.label}
                  </h4>
                  <div className="space-y-0.5">
                    {group.subcategories.slice(0, 10).map((brand) => (
                      <button
                        key={brand}
                        onClick={() => {
                          onSelect(SUBCATEGORY_MAP[group.label] ?? "Lifestyle");
                          setHovered(null);
                        }}
                        className="block w-full text-left text-sm text-gray-600 hover:text-[#E47911] transition-colors py-0.5"
                      >
                        {brand}
                      </button>
                    ))}
                    {group.subcategories.length > 10 && (
                      <button
                        onClick={() => {
                          onSelect(SUBCATEGORY_MAP[group.label] ?? "Lifestyle");
                          setHovered(null);
                        }}
                        className="text-xs text-[#007185] hover:text-[#E47911] font-medium mt-1"
                      >
                        Ver todos &rarr;
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
