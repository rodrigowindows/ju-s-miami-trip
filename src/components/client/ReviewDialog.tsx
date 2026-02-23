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
import StarRating from "@/components/shared/StarRating";
import { useCreateReview } from "@/hooks/useReviews";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  clientId: string;
  orderNumber: string;
}

export default function ReviewDialog({ open, onOpenChange, orderId, clientId, orderNumber }: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const createReview = useCreateReview();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({ title: "Selecione uma nota", description: "Toque nas estrelas para avaliar.", variant: "destructive" });
      return;
    }

    createReview.mutate(
      { orderId, clientId, rating, comment: comment.trim() || undefined },
      {
        onSuccess: () => {
          toast({ title: "Avaliação enviada!", description: "Obrigado pelo seu feedback." });
          setRating(0);
          setComment("");
          onOpenChange(false);
        },
        onError: () => {
          toast({ title: "Erro ao enviar", description: "Tente novamente.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Avaliar Pedido</DialogTitle>
          <DialogDescription>
            Como foi sua experiência com o pedido <span className="font-mono font-semibold">{orderNumber}</span>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">Sua nota</p>
            <StarRating value={rating} onChange={setRating} size="lg" />
            {rating > 0 && (
              <p className="text-sm font-medium">
                {rating === 1 && "Ruim"}
                {rating === 2 && "Regular"}
                {rating === 3 && "Bom"}
                {rating === 4 && "Muito bom"}
                {rating === 5 && "Excelente!"}
              </p>
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
