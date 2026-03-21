import { usePurchasePhotos } from "@/hooks/usePurchasePhotos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Store } from "lucide-react";

interface Props {
  orderId: string;
}

export default function PurchaseGallery({ orderId }: Props) {
  const { data: photos, isLoading } = usePurchasePhotos(orderId);

  if (isLoading || !photos?.length) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary" />
          Fotos da Compra
          <Badge variant="secondary" className="text-xs">
            {photos.length} foto{photos.length > 1 ? "s" : ""}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="space-y-1">
              <img
                src={photo.photo_url}
                alt="Produto comprado"
                className="rounded-lg w-full aspect-square object-cover border"
              />
              {photo.store_name && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Store className="h-3 w-3" /> {photo.store_name}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {new Date(photo.purchased_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
