import { useState, useEffect } from "react";
import { getBrandedPlaceholder } from "@/lib/fix-image-urls";

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  brand?: string;
  category?: string;
  className?: string;
  loading?: "lazy" | "eager";
  onError?: () => void;
}

/**
 * Product image with automatic fallback chain:
 * 1. Try the provided src URL
 * 2. On error → branded placeholder (placehold.co with brand name + category color)
 * 3. On error → local generic placeholder
 */
export function ProductImage({ src, alt, brand = "", category = "", className = "", loading = "lazy", onError }: ProductImageProps) {
  const brandedPlaceholder = getBrandedPlaceholder(brand, category);
  const genericPlaceholder = "/images/product-placeholder.jpg";

  const initialSrc = src && src.trim() ? src : brandedPlaceholder;
  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [failCount, setFailCount] = useState(0);

  useEffect(() => {
    const newSrc = src && src.trim() ? src : brandedPlaceholder;
    setImgSrc(newSrc);
    setFailCount(0);
  }, [src, brandedPlaceholder]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (failCount === 0) {
          setImgSrc(brandedPlaceholder);
          setFailCount(1);
        } else if (failCount === 1) {
          setImgSrc(genericPlaceholder);
          setFailCount(2);
        }
        onError?.();
      }}
    />
  );
}
