import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { useCreateOrderReview } from "@/hooks/useOrderReviews";
import { toast } from "sonner";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  clientId: string;
  orderNumber?: string;
}

const LABELS = ["", "Ruim 😞", "Regular 😐", "Bom 👍", "Muito bom! 😊", "Excelente! 🎉"];

export default function ReviewDialog({ open, onOpenChange, orderId, clientId, orderNumber }: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const createReview = useCreateOrderReview();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Selecione uma nota");
      return;
    }

    try {
      await createReview.mutateAsync({
        order_id: orderId,
        client_id: clientId,
        rating,
        comment: comment.trim() || undefined,
      });
      toast.success("Avaliação enviada! Obrigado pelo feedback!");
      setRating(0);
      setComment("");
      onOpenChange(false);
    } catch {
      toast.error("Erro ao enviar avaliação. Tente novamente.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Avaliar Pedido</DialogTitle>
          <DialogDescription>
            Como foi sua experiência{orderNumber ? ` com o pedido ${orderNumber}` : ""}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">Sua nota</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={
                      s <= (hovered || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm font-medium">{LABELS[rating]}</p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Conte como foi sua experiência... (opcional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right mt-1">{comment.length}/500</p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || createReview.isPending}
            className="w-full"
          >
            {createReview.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enviando...</>
            ) : (
              "Enviar Avaliação"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
