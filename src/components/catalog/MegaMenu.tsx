import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MEGA_MENU_CATEGORIES } from "./mega-menu-data";

interface MegaMenuProps {
  onSelectCategory: (category: string) => void;
}

export function MegaMenu({ onSelectCategory }: MegaMenuProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback((label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenCategory(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpenCategory(null), 150);
  }, []);

  const handleDropdownEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpenCategory(null), 150);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenCategory(null);
        setMobileOpen(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenCategory(null);
      }
    };
    if (openCategory) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openCategory]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const activeData = MEGA_MENU_CATEGORIES.find((c) => c.label === openCategory);

  return (
    <div ref={menuRef}>
      {/* Desktop */}
      <div className="relative hidden md:block" onMouseLeave={handleMouseLeave}>
        <nav className="bg-[#232F3E] px-4" aria-label="Categorias de produtos">
          <div className="mx-auto flex max-w-6xl items-center">
            {MEGA_MENU_CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.label}
                onMouseEnter={() => handleMouseEnter(cat.label)}
                onClick={() => {
                  onSelectCategory(cat.filterCategory);
                  setOpenCategory(null);
                }}
                aria-expanded={openCategory === cat.label}
                aria-haspopup="true"
                className={`px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                  openCategory === cat.label
                    ? "text-[#E47911]"
                    : "text-white hover:text-[#E47911]"
                }`}
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </nav>

        {openCategory && activeData && (
          <div
            className="absolute left-0 right-0 z-[100] border-t border-gray-100 bg-white shadow-xl"
            role="menu"
            aria-label={`Marcas de ${activeData.label}`}
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div
              className="mx-auto grid max-w-6xl gap-x-8 gap-y-1 p-[30px]"
              style={{
                gridTemplateColumns: `repeat(${Math.min(5, Math.max(1, Math.ceil(activeData.subcategories.length / 8)))}, minmax(0, 1fr))`,
              }}
            >
              <h3
                className="col-span-full text-base font-bold uppercase text-gray-900 pb-2 mb-2 border-b border-gray-100"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {activeData.label}
              </h3>
              {activeData.subcategories.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onSelectCategory(activeData.filterCategory);
                    setOpenCategory(null);
                  }}
                  className="text-left text-sm text-gray-700 hover:text-[#E47911] transition-colors"
                  style={{ fontFamily: "Poppins, sans-serif", lineHeight: "2" }}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="bg-[#232F3E] md:hidden">
        {MEGA_MENU_CATEGORIES.map((cat) => {
          const isOpen = mobileOpen === cat.label;
          return (
            <div key={cat.label} className="border-b border-white/10 last:border-b-0">
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => (prev === cat.label ? null : cat.label))}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-white transition-colors hover:text-[#E47911]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                <span>{cat.label}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                style={{ maxHeight: isOpen ? `${cat.subcategories.length * 40 + 16}px` : "0px" }}
              >
                <div className="px-4 pb-3" role="menu">
                  {cat.subcategories.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onSelectCategory(cat.filterCategory);
                        setMobileOpen(null);
                      }}
                      className="flex w-full items-center gap-2 py-1 text-left text-sm text-gray-300 hover:text-[#E47911] transition-colors"
                      style={{ fontFamily: "Poppins, sans-serif", lineHeight: "2" }}
                    >
                      <ChevronRight size={12} className="shrink-0 opacity-50" />
                      <span>{brand}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
