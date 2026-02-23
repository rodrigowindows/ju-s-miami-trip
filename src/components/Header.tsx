import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/shared/Logo";

const anchorLinks = [
  { label: "Home", href: "#home" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Simulador", href: "#simulador" },
  { label: "FAQ", href: "#faq" },
  { label: "Contato", href: "#contato" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#home">
          <Logo size="sm" />
        </a>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-6">
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
            Produtos
          </Link>
          <Link
            to="/login"
            className="ml-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Entrar
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-border bg-background px-4 pb-4">
          {anchorLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 font-body text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/catalog"
            onClick={() => setOpen(false)}
            className="block py-3 font-body text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
          >
            Produtos
          </Link>
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block py-3 font-body text-sm font-medium text-primary"
          >
            Entrar
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
