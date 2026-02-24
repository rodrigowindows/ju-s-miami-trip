import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Subcategory {
  title: string;
  brands: string[];
}

interface Category {
  label: string;
  slug: string;
  subcategories: Subcategory[];
}

const categories: Category[] = [
  {
    label: "Maquiagem",
    slug: "maquiagem",
    subcategories: [
      {
        title: "Rosto",
        brands: ["Base", "Corretivo", "Contorno", "Blush", "Iluminador", "Primer", "Pó"],
      },
      {
        title: "Olhos",
        brands: ["Paleta de Sombras", "Máscara", "Delineador", "Lápis", "Glitter"],
      },
      {
        title: "Lábios",
        brands: ["Batom", "Gloss", "Lip Liner", "Lip Tint", "Bálsamo"],
      },
    ],
  },
  {
    label: "Skincare",
    slug: "skincare",
    subcategories: [
      {
        title: "Limpeza",
        brands: ["Sabonete Facial", "Água Micelar", "Esfoliante", "Tônico"],
      },
      {
        title: "Hidratação",
        brands: ["Sérum", "Creme Facial", "Máscara Facial", "Óleo Facial"],
      },
      {
        title: "Proteção",
        brands: ["Protetor Solar", "Anti-idade", "Vitamina C", "Retinol"],
      },
    ],
  },
  {
    label: "Perfumes",
    slug: "perfumes",
    subcategories: [
      {
        title: "Feminino",
        brands: ["Chanel", "Dior", "Lancôme", "Carolina Herrera", "Dolce & Gabbana"],
      },
      {
        title: "Masculino",
        brands: ["Dior Sauvage", "Bleu de Chanel", "Versace", "Paco Rabanne", "Hugo Boss"],
      },
      {
        title: "Unissex",
        brands: ["CK One", "Tom Ford", "Jo Malone", "Le Labo", "Maison Margiela"],
      },
    ],
  },
  {
    label: "Eletrônicos",
    slug: "eletronicos",
    subcategories: [
      {
        title: "Apple",
        brands: ["iPhone", "iPad", "MacBook", "Apple Watch", "AirPods"],
      },
      {
        title: "Samsung",
        brands: ["Galaxy S", "Galaxy Tab", "Galaxy Watch", "Galaxy Buds"],
      },
      {
        title: "Acessórios",
        brands: ["Carregadores", "Capas", "Fones", "Câmeras", "Smart Home"],
      },
    ],
  },
  {
    label: "Roupas",
    slug: "roupas",
    subcategories: [
      {
        title: "Feminino",
        brands: ["Vestidos", "Blusas", "Calças", "Saias", "Jaquetas"],
      },
      {
        title: "Masculino",
        brands: ["Camisetas", "Camisas", "Calças", "Bermudas", "Casacos"],
      },
      {
        title: "Marcas",
        brands: ["Nike", "Adidas", "Ralph Lauren", "Tommy Hilfiger", "Calvin Klein"],
      },
    ],
  },
  {
    label: "Bolsas",
    slug: "bolsas",
    subcategories: [
      {
        title: "Luxo",
        brands: ["Louis Vuitton", "Gucci", "Prada", "Michael Kors", "Coach"],
      },
      {
        title: "Tipos",
        brands: ["Tote", "Crossbody", "Clutch", "Mochila", "Carteira"],
      },
      {
        title: "Estilos",
        brands: ["Casual", "Trabalho", "Festa", "Viagem", "Esportiva"],
      },
    ],
  },
  {
    label: "Todos os Produtos",
    slug: "todos",
    subcategories: [],
  },
];

interface CategoryNavProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export default function CategoryNav({ mobile = false, onNavigate }: CategoryNavProps) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  const handleCategoryClick = (slug: string) => {
    navigate(`/client/catalog?category=${slug}`);
    onNavigate?.();
  };

  // Mobile version - accordion style
  if (mobile) {
    return (
      <nav className="py-2">
        {categories.map((cat) => (
          <div key={cat.slug}>
            <div className="flex items-center">
              <button
                onClick={() => {
                  if (cat.subcategories.length === 0) {
                    handleCategoryClick(cat.slug);
                  } else {
                    setExpandedMobile(expandedMobile === cat.slug ? null : cat.slug);
                  }
                }}
                className="flex-1 flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 font-poppins transition-colors"
              >
                <span>{cat.label}</span>
                {cat.subcategories.length > 0 && (
                  <ChevronRight
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      expandedMobile === cat.slug ? "rotate-90" : ""
                    }`}
                  />
                )}
              </button>
            </div>
            {expandedMobile === cat.slug && cat.subcategories.length > 0 && (
              <div className="bg-gray-50 px-4 py-3">
                {cat.subcategories.map((sub) => (
                  <div key={sub.title} className="mb-3 last:mb-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 font-poppins">
                      {sub.title}
                    </p>
                    <div className="space-y-1">
                      {sub.brands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => {
                            navigate(
                              `/client/catalog?category=${cat.slug}&sub=${encodeURIComponent(brand)}`
                            );
                            onNavigate?.();
                          }}
                          className="block w-full text-left text-sm text-gray-600 hover:text-black py-1 font-poppins transition-colors"
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="mt-2 text-sm font-medium text-primary hover:underline font-poppins"
                >
                  Ver tudo em {cat.label}
                </button>
              </div>
            )}
          </div>
        ))}
      </nav>
    );
  }

  // Desktop version - dropdown on hover
  return (
    <nav className="border-t border-[#eee] bg-white">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-0">
        {categories.map((cat) => (
          <div
            key={cat.slug}
            className="relative"
            onMouseEnter={() =>
              cat.subcategories.length > 0 ? setActiveCategory(cat.slug) : undefined
            }
            onMouseLeave={() => setActiveCategory(null)}
          >
            <button
              onClick={() => handleCategoryClick(cat.slug)}
              className={`flex items-center gap-1 px-4 py-3 text-sm font-medium font-poppins transition-colors whitespace-nowrap ${
                activeCategory === cat.slug
                  ? "text-black"
                  : "text-gray-800 hover:text-black"
              }`}
            >
              {cat.label}
              {cat.subcategories.length > 0 && (
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    activeCategory === cat.slug ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* Dropdown */}
            {activeCategory === cat.slug && cat.subcategories.length > 0 && (
              <div
                className="absolute left-0 top-full bg-white border border-[#eee] rounded-b-lg shadow-lg min-w-[480px] p-6 z-50"
                onMouseEnter={() => setActiveCategory(cat.slug)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <div className="grid grid-cols-3 gap-6">
                  {cat.subcategories.map((sub) => (
                    <div key={sub.title}>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 font-poppins">
                        {sub.title}
                      </p>
                      <ul className="space-y-2">
                        {sub.brands.sort().map((brand) => (
                          <li key={brand}>
                            <button
                              onClick={() => {
                                navigate(
                                  `/client/catalog?category=${cat.slug}&sub=${encodeURIComponent(brand)}`
                                );
                                setActiveCategory(null);
                              }}
                              className="text-sm text-gray-600 hover:text-black hover:underline font-poppins transition-colors"
                            >
                              {brand}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-[#eee]">
                  <button
                    onClick={() => {
                      handleCategoryClick(cat.slug);
                      setActiveCategory(null);
                    }}
                    className="text-sm font-medium text-primary hover:underline font-poppins"
                  >
                    Ver tudo em {cat.label} →
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
