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
    timeoutRef.current = setTimeout(() => {
      setOpenCategory(null);
    }, 150);
  }, []);

  const handleDropdownEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpenCategory(null);
    }, 150);
  }, []);

  // Close on ESC key
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

  // Close on click outside
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const toggleMobileAccordion = (label: string) => {
    setMobileOpen((prev) => (prev === label ? null : label));
  };

  const handleBrandClick = (filterCategory: string, closeMobile?: boolean) => {
    onSelectCategory(filterCategory);
    setOpenCategory(null);
    if (closeMobile) setMobileOpen(null);
  };

  const activeData = MEGA_MENU_CATEGORIES.find((c) => c.label === openCategory);

  return (
    <>
      {/* Desktop Mega Menu */}
      <div className="hidden md:block relative" ref={menuRef}>
        <nav className="bg-[#232F3E] px-4" aria-label="Categorias de produtos">
          <div className="max-w-6xl mx-auto flex items-center gap-0">
            {MEGA_MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onMouseEnter={() => handleMouseEnter(cat.label)}
                onMouseLeave={handleMouseLeave}
                onClick={() => onSelectCategory(cat.filterCategory)}
                aria-expanded={openCategory === cat.label}
                aria-haspopup="true"
                className={`px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap font-[Poppins,sans-serif] ${
                  openCategory === cat.label
                    ? "text-amber-300 bg-white/10"
                    : "text-gray-200 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Dropdown Panel */}
        {openCategory && activeData && (
          <div
            className="mega-menu-dropdown absolute left-0 right-0 bg-white z-[100] shadow-xl p-[30px_40px]"
            role="menu"
            aria-label={`Marcas de ${activeData.label}`}
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="max-w-6xl mx-auto">
              <h3 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 font-[Poppins,sans-serif]">
                {activeData.label}
              </h3>
              <div
                className="grid gap-x-8 gap-y-1"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(5, Math.ceil(activeData.subcategories.length / 8))}, 1fr)`,
                }}
              >
                {activeData.subcategories.map((brand) => (
                  <button
                    key={brand}
                    role="menuitem"
                    onClick={() => handleBrandClick(activeData.filterCategory)}
                    className="text-left text-gray-800 hover:text-[#E47911] transition-colors block font-[Poppins,sans-serif] text-sm leading-8"
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Accordion Menu */}
      <div className="md:hidden bg-[#232F3E]">
        {MEGA_MENU_CATEGORIES.map((cat) => {
          const isOpen = mobileOpen === cat.label;
          return (
            <div key={cat.label} className="border-b border-white/10 last:border-b-0">
              <button
                onClick={() => toggleMobileAccordion(cat.label)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-200 hover:text-white hover:bg-white/5 transition-colors font-[Poppins,sans-serif]"
              >
                <span className="font-medium">{cat.label}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: isOpen ? `${cat.subcategories.length * 40 + 16}px` : "0px",
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <div className="px-4 pb-3 space-y-0.5" role="menu">
                  {cat.subcategories.map((brand) => (
                    <button
                      key={brand}
                      role="menuitem"
                      onClick={() => handleBrandClick(cat.filterCategory, true)}
                      className="flex items-center gap-2 py-1.5 pl-3 text-gray-400 hover:text-[#E47911] transition-colors w-full text-left font-[Poppins,sans-serif] text-[13px] leading-8"
                    >
                      <ChevronRight size={12} className="shrink-0 opacity-50" />
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
