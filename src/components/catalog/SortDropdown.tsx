import { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { SORT_OPTIONS } from "./catalog-utils";

interface SortDropdownProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function SortDropdown({ sortBy, onSortChange }: SortDropdownProps) {
  const [showSort, setShowSort] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowSort(!showSort)}
        className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5"
      >
        <SlidersHorizontal size={14} />
        Ordenar
        <ChevronDown size={14} />
      </button>
      {showSort && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 min-w-[160px]">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onSortChange(opt.value); setShowSort(false); }}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  sortBy === opt.value ? "font-semibold text-[#C45500]" : "text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
