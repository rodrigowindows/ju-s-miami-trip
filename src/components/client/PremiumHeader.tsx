import { useState } from "react";
import { Search, Heart, User, ShoppingCart, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import NotificationBell from "@/components/client/NotificationBell";
import CategoryNav from "@/components/client/CategoryNav";

export default function PremiumHeader() {
  const { profile, user } = useAuth();
  const { totalItems, items, openCart } = useCart();
  const { data: wishlistIds } = useWishlist(user?.id);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalBRL = items.reduce(
    (sum, item) => sum + item.product.price_usd * item.quantity * 5.5,
    0
  );

  const wishlistCount = wishlistIds?.length ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/client/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Main Header */}
      <header
        className="sticky top-0 z-50 bg-white"
        style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-1 text-gray-600 hover:text-black transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <button
            onClick={() => navigate("/client/catalog")}
            className="flex-shrink-0 flex items-center"
          >
            <span
              className="text-black font-bold text-2xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              MalaBridge
            </span>
          </button>

          {/* Search Bar - hidden on mobile, shown on md+ */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="O que você está procurando?"
                className="w-full h-10 pl-5 pr-12 rounded-full border border-[#ddd] bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors font-poppins"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-800 transition-colors"
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-1 sm:gap-3 ml-auto">
            {/* Wishlist */}
            <button
              onClick={() => navigate("/client/wishlist")}
              className="relative p-2 text-gray-600 hover:text-black transition-colors"
              aria-label="Lista de desejos"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <NotificationBell />

            {/* User */}
            <button
              onClick={() => navigate("/client/profile")}
              className="hidden sm:flex items-center gap-1.5 p-2 text-gray-600 hover:text-black transition-colors"
              aria-label="Perfil"
            >
              <User className="h-5 w-5" />
              {profile && (
                <span className="text-sm font-medium font-poppins hidden lg:inline">
                  {profile.full_name?.split(" ")[0]}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-1.5 p-2 text-gray-600 hover:text-black transition-colors"
              aria-label="Abrir carrinho"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
              <span className="hidden sm:inline text-sm font-medium font-poppins whitespace-nowrap">
                R$ {totalBRL.toFixed(2).replace(".", ",")}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form
          onSubmit={handleSearch}
          className="md:hidden px-4 pb-3"
        >
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O que você está procurando?"
              className="w-full h-12 pl-5 pr-14 rounded-full border border-[#ddd] bg-[#f5f5f5] text-base text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors font-poppins"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#C45500] hover:bg-[#a34700] text-white rounded-full p-2.5 transition-colors"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Category Navigation - desktop mega-menu */}
        <div className="hidden lg:block">
          <CategoryNav />
        </div>

        {/* Category Navigation - mobile compact bar */}
        <div className="lg:hidden border-t border-[#eee]">
          <CategoryNav compact />
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-72 bg-white z-50 shadow-xl overflow-y-auto lg:hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#eee]">
              <span
                className="text-black font-bold text-xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                MalaBridge
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-gray-600 hover:text-black"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {profile && (
              <div className="px-4 py-3 border-b border-[#eee] bg-gray-50">
                <p className="text-sm font-medium text-gray-800 font-poppins">
                  Olá, {profile.full_name?.split(" ")[0]}
                </p>
                <p className="text-xs text-gray-500 font-poppins">{profile.email}</p>
              </div>
            )}

            <CategoryNav mobile onNavigate={() => setMobileMenuOpen(false)} />

            <div className="border-t border-[#eee] p-4 space-y-2">
              <button
                onClick={() => {
                  navigate("/client/profile");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full py-2 text-sm font-medium text-gray-700 hover:text-black font-poppins"
              >
                <User className="h-4 w-4" />
                Meu Perfil
              </button>
              <button
                onClick={() => {
                  navigate("/client/orders");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full py-2 text-sm font-medium text-gray-700 hover:text-black font-poppins"
              >
                <ShoppingCart className="h-4 w-4" />
                Meus Pedidos
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
