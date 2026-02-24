import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MEGA_MENU_CATEGORIES } from "./mega-menu-data";

interface MegaMenuProps {
  onSelectCategory: (category: string) => void;
}

const CATEGORY_FILTER_MAP: Record<string, string> = {
  Maquiagem: "Beauty",
  Skincare: "Beauty",
  Perfumes: "Beauty",
  Eletrônicos: "Tech",
  Roupas: "Fashion",
  Bolsas: "Lifestyle",
};

export function MegaMenu({ onSelectCategory }: MegaMenuProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const getFilterForCategory = (label: string) => CATEGORY_FILTER_MAP[label] ?? "Todos";

  const handleMouseEnter = useCallback((label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenCategory(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpenCategory(null);
    }, 150);
  }, []);

  const handleDropdownEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const handleDropdownLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpenCategory(null);
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const activeData = MEGA_MENU_CATEGORIES.find((category) => category.label === openCategory);

  return (
    <div ref={menuRef}>
      <div className="relative hidden md:block" onMouseLeave={handleMouseLeave}>
        <nav className="bg-[#232F3E] px-6 py-0">
          <div className="mx-auto flex max-w-7xl items-center">
            {MEGA_MENU_CATEGORIES.map((category) => (
              <button
                type="button"
                key={category.label}
                onMouseEnter={() => handleMouseEnter(category.label)}
                onClick={() => onSelectCategory(getFilterForCategory(category.label))}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  openCategory === category.label ? "text-[#E47911]" : "text-white hover:text-[#E47911]"
                }`}
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {category.label}
              </button>
            ))}
          </div>
        </nav>

        {openCategory && activeData && (
          <div
            className="mega-menu-dropdown absolute left-0 right-0 z-[100] border-t border-gray-100 bg-white shadow-xl"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div
              className="mx-auto grid max-w-7xl gap-x-8 gap-y-1 p-[30px]"
              style={{
                gridTemplateColumns: `repeat(${Math.min(5, Math.max(1, Math.ceil(activeData.subcategories.length / 8)))}, minmax(0, 1fr))`,
              }}
            >
              <h3
                className="col-span-full text-base font-bold uppercase text-gray-900"
                style={{ fontFamily: "Poppins, sans-serif", lineHeight: "2" }}
              >
                {activeData.label}
              </h3>
              {activeData.subcategories.map((brand) => (
                <a
                  key={brand}
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    onSelectCategory(getFilterForCategory(activeData.label));
                    setOpenCategory(null);
                  }}
                  className="text-left text-sm font-normal text-gray-700 transition-colors duration-150 hover:text-[#E47911]"
                  style={{ fontFamily: "Poppins, sans-serif", lineHeight: "2" }}
                >
                  {brand}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#232F3E] md:hidden">
        {MEGA_MENU_CATEGORIES.map((category) => {
          const isOpen = mobileOpen === category.label;
          return (
            <div key={category.label} className="border-b border-white/10 last:border-b-0">
              <button
                type="button"
                onClick={() => setMobileOpen((previous) => (previous === category.label ? null : category.label))}
                className="flex w-full items-center justify-between px-6 py-2 text-left text-sm font-medium text-white transition-colors hover:text-[#E47911]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                <span>{category.label}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                style={{
                  maxHeight: isOpen ? `${category.subcategories.length * 40 + 16}px` : "0px",
                }}
              >
                <div className="px-6 pb-3">
                  {category.subcategories.map((brand) => (
                    <a
                      key={brand}
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        onSelectCategory(getFilterForCategory(category.label));
                        setMobileOpen(null);
                      }}
                      className="flex w-full items-center gap-2 py-1 text-left text-sm font-normal text-gray-300 transition-colors duration-150 hover:text-[#E47911]"
                      style={{ fontFamily: "Poppins, sans-serif", lineHeight: "2" }}
                    >
                      <ChevronRight size={12} className="shrink-0" />
                      <span>{brand}</span>
                    </a>
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
