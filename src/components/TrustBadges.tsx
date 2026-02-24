import { Lock, ShieldCheck, Plane, RefreshCw } from "lucide-react";

const badges = [
  { icon: Lock, label: "Compra Segura" },
  { icon: ShieldCheck, label: "Produtos Originais" },
  { icon: Plane, label: "Envio dos EUA" },
  { icon: RefreshCw, label: "Troca Garantida" },
];

const TrustBadges = () => {
  return (
    <div
      className="bg-white border-b px-5 py-5"
      style={{ borderColor: "#eee" }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:flex md:items-center md:justify-around gap-4 md:gap-0">
        {badges.map((badge) => (
          <div
            key={badge.label}
            className="flex items-center justify-center gap-2"
          >
            <badge.icon size={24} className="text-gray-700 shrink-0" />
            <span className="text-[13px] text-gray-500">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBadges;
