import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/shared/Logo";

const anchorLinks = [
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Simulador de Preços", href: "#simulador" },
  { label: "Dúvidas Frequentes", href: "#faq" },
  { label: "Fale Conosco", href: "#contato" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <a href="#home">
          <Logo size="sm" />
        </a>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-5">
          {anchorLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-body text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/catalog"
            className="font-body text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
          >
            Ver Produtos
          </Link>
          <Link
            to="/login"
            className="ml-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Entrar / Cadastrar
          </Link>
        </nav>

        {/* Mobile: only key CTAs + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            to="/catalog"
            className="font-body text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
          >
            Ver Produtos
          </Link>
          <Link
            to="/login"
            className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Entrar / Cadastrar
          </Link>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="text-foreground/70 hover:text-foreground"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="md:hidden border-t border-border bg-background px-4 pb-3 pt-1">
          {anchorLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 font-body text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
