import { Truck, Package, HelpCircle, Zap, Award } from "lucide-react";

interface QuickLinksProps {
  onScrollToCatalog?: () => void;
  onFilterDeals?: () => void;
  onFilterBestSellers?: () => void;
}

const links = [
  {
    icon: Truck,
    label: "Frete Grátis",
    sub: "Acima de R$500",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    icon: Package,
    label: "Pronta Entrega",
    sub: "Envio imediato",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    icon: HelpCircle,
    label: "Como Funciona",
    sub: "Passo a passo",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    href: "#como-funciona",
  },
  {
    icon: Zap,
    label: "Ofertas do Dia",
    sub: "Até 60% OFF",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    action: "deals",
  },
  {
    icon: Award,
    label: "Mais Vendidos",
    sub: "Top produtos",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    action: "bestsellers",
  },
];

export default function QuickLinks({ onScrollToCatalog, onFilterDeals, onFilterBestSellers }: QuickLinksProps) {
  function handleClick(link: typeof links[0]) {
    if (link.href) {
      document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (link.action === "deals" && onFilterDeals) {
      onFilterDeals();
      return;
    }
    if (link.action === "bestsellers" && onFilterBestSellers) {
      onFilterBestSellers();
      return;
    }
    onScrollToCatalog?.();
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-4">
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
        {links.map((link) => (
          <button
            key={link.label}
            onClick={() => handleClick(link)}
            className={`shrink-0 flex items-center gap-2.5 ${link.bg} ${link.border} border rounded-xl px-4 py-3 hover:shadow-sm transition-shadow min-w-[150px]`}
          >
            <div className={`${link.color}`}>
              <link.icon size={22} />
            </div>
            <div className="text-left">
              <p className={`text-xs font-bold ${link.color}`}>{link.label}</p>
              <p className="text-[10px] text-gray-500">{link.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
