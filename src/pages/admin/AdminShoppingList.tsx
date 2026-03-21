import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUploadPurchasePhoto } from "@/hooks/usePurchasePhotos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Camera, CheckCircle2, Clock, Package, ShoppingCart, Store, Upload, Image as ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import type { PurchasePhoto } from "@/hooks/usePurchasePhotos";

type OrderItemWithPhotos = {
  id: string;
  order_id: string;
  product_name: string;
  product_image_url: string | null;
  quantity: number;
  price_usd: number | null;
  notes: string | null;
  order_number: string;
  customer_name: string;
  client_id: string;
  photos: PurchasePhoto[];
};

export default function AdminShoppingList() {
  const [selectedTrip, setSelectedTrip] = useState<string>("");
  const [uploadDialog, setUploadDialog] = useState<OrderItemWithPhotos | null>(null);
  const [storeName, setStoreName] = useState("");
  const [photoNotes, setPhotoNotes] = useState("");
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const upload = useUploadPurchasePhoto();

  // Fetch trips
  const { data: trips } = useQuery({
    queryKey: ["trips_for_shopping"],
    queryFn: async () => {
      const { data } = await supabase
        .from("trips")
        .select("*")
        .in("status", ["planejada", "em_andamento"])
        .order("departure_date", { ascending: true });
      return data ?? [];
    },
  });

  // Fetch items for selected trip
  const { data: items, isLoading } = useQuery({
    queryKey: ["shopping_list", selectedTrip],
    enabled: !!selectedTrip,
    queryFn: async () => {
      const { data: orders } = await supabase
        .from("orders")
        .select("id, order_number, customer_name, client_id")
        .eq("trip_id", selectedTrip)
        .in("status", ["aprovado", "comprando", "comprado"]);

      if (!orders?.length) return [];

      const orderIds = orders.map((o) => o.id);

      const [{ data: orderItems }, { data: photos }] = await Promise.all([
        supabase.from("order_items").select("*").in("order_id", orderIds),
        supabase
          .from("purchase_photos" as any)
          .select("*")
          .in("order_id", orderIds),
      ]);

      const result: OrderItemWithPhotos[] = [];
      for (const item of orderItems ?? []) {
        const order = orders.find((o) => o.id === item.order_id)!;
        const itemPhotos = ((photos ?? []) as unknown as PurchasePhoto[]).filter(
          (p) => p.order_item_id === item.id || (!p.order_item_id && p.order_id === item.order_id)
        );
        result.push({
          ...item,
          order_number: order.order_number,
          customer_name: order.customer_name,
          client_id: order.client_id,
          photos: itemPhotos,
        });
      }
      return result;
    },
  });

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setPreviewFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleUpload = async () => {
    if (!previewFile || !uploadDialog) return;
    try {
      await upload.mutateAsync({
        orderId: uploadDialog.order_id,
        orderItemId: uploadDialog.id,
        file: previewFile,
        storeName,
        notes: photoNotes,
      });

      // Notify client
      await supabase.from("notifications").insert({
        client_id: uploadDialog.client_id,
        title: "Produto comprado! 📸",
        message: `Seu produto "${uploadDialog.product_name}" foi comprado${storeName ? ` na loja ${storeName}` : ""}! Confira a foto.`,
        type: "order_update",
        order_id: uploadDialog.order_id,
      });

      toast.success("Foto enviada e cliente notificado!");
      setUploadDialog(null);
      setPreviewFile(null);
      setStoreName("");
      setPhotoNotes("");
    } catch {
      toast.error("Erro ao enviar foto");
    }
  };

  const purchased = items?.filter((i) => i.photos.length > 0) ?? [];
  const pending = items?.filter((i) => i.photos.length === 0) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            Lista de Compras
          </h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os itens por viagem e registre fotos das compras
          </p>
        </div>
      </div>

      <Select value={selectedTrip} onValueChange={setSelectedTrip}>
        <SelectTrigger className="w-full max-w-sm">
          <SelectValue placeholder="Selecione uma viagem..." />
        </SelectTrigger>
        <SelectContent>
          {trips?.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.code} — {t.traveler_name} ({new Date(t.departure_date).toLocaleDateString("pt-BR")})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedTrip && !isLoading && items && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Pendentes ({pending.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pending.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Todos os itens foram comprados! 🎉
                </p>
              )}
              {pending.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                  {item.product_image_url ? (
                    <img src={item.product_image_url} className="w-12 h-12 rounded object-cover" alt="" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.order_number} • {item.customer_name || "Cliente"}
                    </p>
                    {item.price_usd && (
                      <p className="text-xs font-semibold text-green-600">
                        US$ {item.price_usd.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setUploadDialog(item)}
                    className="shrink-0"
                  >
                    <Camera className="h-4 w-4 mr-1" />
                    Foto
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Comprados ({purchased.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {purchased.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum item comprado ainda
                </p>
              )}
              {purchased.map((item) => (
                <div key={item.id} className="p-3 rounded-lg border bg-card space-y-2">
                  <div className="flex items-center gap-3">
                    {item.photos[0] ? (
                      <img src={item.photos[0].photo_url} className="w-12 h-12 rounded object-cover" alt="" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.order_number} • {item.customer_name || "Cliente"}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-green-600 bg-green-50 shrink-0">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Comprado
                    </Badge>
                  </div>
                  {item.photos[0]?.store_name && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Store className="h-3 w-3" /> {item.photos[0].store_name}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={!!uploadDialog} onOpenChange={(o) => !o && setUploadDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Registrar Compra
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 rounded-lg border bg-muted/50">
              <p className="font-medium text-sm">{uploadDialog?.product_name}</p>
              <p className="text-xs text-muted-foreground">
                {uploadDialog?.order_number} • {uploadDialog?.customer_name || "Cliente"}
              </p>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              }`}
            >
              <input {...getInputProps()} />
              {previewFile ? (
                <div className="space-y-2">
                  <img
                    src={URL.createObjectURL(previewFile)}
                    className="max-h-40 mx-auto rounded-lg object-contain"
                    alt="Preview"
                  />
                  <p className="text-xs text-muted-foreground">{previewFile.name}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Tire uma foto ou arraste aqui
                  </p>
                </div>
              )}
            </div>

            <Input
              placeholder="Nome da loja (ex: Apple Store, Bath & Body...)"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />

            <Input
              placeholder="Observações (opcional)"
              value={photoNotes}
              onChange={(e) => setPhotoNotes(e.target.value)}
            />

            <Separator />

            <Button
              className="w-full"
              disabled={!previewFile || upload.isPending}
              onClick={handleUpload}
            >
              {upload.isPending ? "Enviando..." : "Enviar Foto e Notificar Cliente"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
