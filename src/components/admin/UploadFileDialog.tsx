import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { store } from "@/hooks/use-orders-store";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UploadFileDialog({
  orderId,
  open,
  onOpenChange,
}: {
  orderId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [title, setTitle] = useState("Foto/Nota adicionada");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length === 0) return;
    const file = accepted[0];
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "application/pdf": [] },
    maxFiles: 1,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production, upload to Supabase Storage bucket "order-files" and get the URL.
    // For now, use the preview data URL or a placeholder.
    const photoUrl = preview || null;

    store.addOrderEvent(orderId, {
      event_type: "file_upload",
      title,
      description: description || `Arquivo: ${fileName}`,
      photo_url: photoUrl,
    });

    toast.success("Arquivo adicionado à timeline!");
    onOpenChange(false);
    setTitle("Foto/Nota adicionada");
    setDescription("");
    setPreview(null);
    setFileName("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Foto/Nota</DialogTitle>
          <DialogDescription>
            Arraste um arquivo ou clique para selecionar. O arquivo será adicionado à timeline do pedido.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="space-y-2">
                <img src={preview} alt="preview" className="mx-auto max-h-32 rounded-md object-cover" />
                <p className="text-sm text-muted-foreground">{fileName}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive ? "Solte o arquivo aqui..." : "Arraste ou clique para selecionar"}
                </p>
                <p className="text-xs text-muted-foreground">Imagens ou PDF</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="upload-title">Título do evento</Label>
            <Input
              id="upload-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Nota fiscal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upload-desc">Descrição (opcional)</Label>
            <Input
              id="upload-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Observações..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!preview && !fileName}>
              <ImageIcon className="mr-2 h-4 w-4" />
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
