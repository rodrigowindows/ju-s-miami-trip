import { Instagram, Heart } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const Footer = () => {
  const { data: settings } = useSettings();
  const storeName = settings?.store_name ?? "MalaBridge";
  const tagline = settings?.store_tagline ?? "Sua experiência em Miami começa aqui";
  const instagramUrl = settings?.instagram_url;

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-display text-lg font-bold">
              {storeName}
            </span>
            <p className="font-body text-sm text-background/60 mt-1">
              {tagline}
            </p>
          </div>

          {instagramUrl && (
            <div className="flex gap-4">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary/80 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          )}
        </div>

        <div className="border-t border-background/10 mt-8 pt-8 text-center">
          <p className="font-body text-sm text-background/50 flex items-center justify-center gap-1">
            Feito com <Heart size={14} className="text-primary" /> {storeName} © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
