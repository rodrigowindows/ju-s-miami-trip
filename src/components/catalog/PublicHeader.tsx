import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, LogOut, Settings, Store, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Input } from "@/components/ui/input";
import Logo from "@/components/shared/Logo";
import { CategoryNav } from "@/components/catalog/CategoryNav";
import SearchAutocomplete from "@/components/catalog/SearchAutocomplete";
import { PublicCartDrawer } from "@/components/catalog/PublicCartDrawer";
import { slugify } from "@/lib/slugify";
import type { CatalogProduct } from "@/types";

interface Props {
  products: CatalogProduct[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onResetHome: () => void;
  topBrands: string[];
}

export function PublicHeader({ products, searchQuery, onSearchChange, activeCategory, onCategoryChange, onResetHome, topBrands }: Props) {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { totalItems } = useCart();
  const [searchFocused, setSearchFocused] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAdmin = profile?.role === "admin";
  const isClient = !!user && !isAdmin;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-rose-100">
        <div className="px-4 py-3 flex items-center gap-3">
          {!searchFocused && (
            <button onClick={onResetHome} className="shrink-0">
              <Logo size="sm" />
            </button>
          )}

          {/* Search bar */}
          <div className="flex-1 relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar skincare, maquiagem, perfumes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => { if (!searchQuery.trim()) setTimeout(() => setSearchFocused(false), 150); }}
              className="w-full pl-9 pr-3 h-11 rounded-full bg-white text-gray-900 border border-rose-200 text-base focus-visible:ring-2 focus-visible:ring-[#F43F5E]"
            />
            <SearchAutocomplete query={searchQuery} products={products} onSelect={(p) => { setSearchFocused(false); navigate(`/produto/${slugify(p.name)}`); }} />
          </div>

          {searchFocused ? (
            <button onClick={() => { onSearchChange(""); setSearchFocused(false); }} className="shrink-0 text-sm text-gray-500 hover:text-gray-800 font-medium">
              Cancelar
            </button>
          ) : (
            <div className="flex items-center gap-1">
              {/* Favorites */}
              <button
                onClick={() => user ? navigate("/favoritos") : navigate("/login")}
                className="shrink-0 p-2 text-gray-700 hover:text-[#F43F5E] rounded-full hover:bg-gray-50 transition-colors"
                title="Favoritos"
              >
                <Heart size={18} />
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="shrink-0 p-2 text-gray-700 hover:text-[#F43F5E] rounded-full hover:bg-gray-50 transition-colors relative"
                title="Carrinho"
              >
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#F43F5E] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-in zoom-in duration-300">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (!user) { navigate("/login"); return; }
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  className="shrink-0 p-2 text-gray-700 hover:text-[#F43F5E] rounded-full hover:bg-gray-50 transition-colors"
                  title={user ? profile?.full_name || "Minha conta" : "Entrar"}
                >
                  <User size={18} />
                </button>

                {/* Dropdown */}
                {userMenuOpen && user && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-1 z-50 bg-white border rounded-lg shadow-lg py-1 min-w-[180px]">
                      <div className="px-3 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900 truncate">{profile?.full_name || "Minha conta"}</p>
                        <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                      </div>
                      {isAdmin ? (
                        <>
                          <button onClick={() => { setUserMenuOpen(false); navigate("/admin/dashboard"); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                            <Settings size={14} /> Painel Admin
                          </button>
                          <button onClick={() => { setUserMenuOpen(false); navigate("/"); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                            <Store size={14} /> Ver loja
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setUserMenuOpen(false); navigate("/client/orders"); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                            <ShoppingBag size={14} /> Meus pedidos
                          </button>
                          <button onClick={() => { setUserMenuOpen(false); navigate("/favoritos"); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                            <Heart size={14} /> Meus favoritos
                          </button>
                        </>
                      )}
                      <div className="border-t mt-1">
                        <button onClick={() => { setUserMenuOpen(false); signOut(); }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <LogOut size={14} /> Sair
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <CategoryNav active={activeCategory} onSelect={onCategoryChange} variant="light" />

        {topBrands.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-1.5 bg-gray-50/60">
            <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto scrollbar-hide">
              {topBrands.map((b) => (
                <button key={b} onClick={() => navigate(`/marca/${slugify(b)}`)} className="shrink-0 bg-white border border-gray-200 rounded-full px-3.5 py-1 text-xs font-medium text-gray-700 hover:shadow-sm hover:border-gray-300 transition-all">
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <PublicCartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
