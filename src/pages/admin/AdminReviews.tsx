import { useState } from "react";
import { Star, Trash2, MessageSquare, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAllOrderReviews, useDeleteOrderReview, useReplyToReview } from "@/hooks/useOrderReviews";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import EmptyState from "@/components/shared/EmptyState";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/format";
import AISentimentCard from "@/components/admin/AISentimentCard";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

function RatingDistribution({ reviews }: { reviews: { rating: number }[] }) {
  const total = reviews.length;
  const counts = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rev) => rev.rating === r).length,
  }));

  return (
    <div className="space-y-1.5">
      {counts.map(({ rating, count }) => (
        <div key={rating} className="flex items-center gap-2 text-xs">
          <span className="w-3 text-right">{rating}</span>
          <Star size={10} className="fill-amber-400 text-amber-400" />
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
            />
          </div>
          <span className="w-6 text-muted-foreground">{count}</span>
        </div>
      ))}
    </div>
  );
}

function ReplyForm({ reviewId, existingReply }: { reviewId: string; existingReply: string | null }) {
  const [reply, setReply] = useState(existingReply ?? "");
  const [editing, setEditing] = useState(!existingReply);
  const replyMutation = useReplyToReview();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!reply.trim()) return;
    try {
      await replyMutation.mutateAsync({ reviewId, reply });
      toast({ title: "Resposta enviada!" });
      setEditing(false);
    } catch {
      toast({ title: "Erro ao responder", variant: "destructive" });
    }
  };

  if (existingReply && !editing) {
    return (
      <div className="mt-3 ml-4 pl-3 border-l-2 border-primary/30 space-y-1">
        <p className="text-xs font-semibold text-primary">Sua resposta:</p>
        <p className="text-sm text-muted-foreground">{existingReply}</p>
        <button onClick={() => setEditing(true)} className="text-xs text-primary hover:underline">
          Editar
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MessageSquare size={12} />
        <span>{existingReply ? "Editar resposta" : "Responder ao cliente"}</span>
      </div>
      <Textarea
        placeholder="Escreva sua resposta..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        rows={2}
        maxLength={500}
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!reply.trim() || replyMutation.isPending}
          className="gap-1.5"
        >
          <Send size={12} /> {replyMutation.isPending ? "Enviando..." : "Enviar"}
        </Button>
        {existingReply && (
          <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setReply(existingReply); }}>
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
}

export default function AdminReviews() {
  const { data: reviews, isLoading } = useAllOrderReviews();
  const deleteReview = useDeleteOrderReview();
  const { toast } = useToast();
  const [replyingId, setReplyingId] = useState<string | null>(null);

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const pendingReplies = reviews?.filter((r) => !r.admin_reply).length ?? 0;

  const handleDelete = async (id: string) => {
    try {
      await deleteReview.mutateAsync(id);
      toast({ title: "Avaliação excluída" });
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold">Avaliações</h2>
        <p className="text-sm text-muted-foreground">Avaliações dos clientes sobre pedidos entregues</p>
      </div>

      {isLoading ? (
        <div className="space-y-3"><CardSkeleton /><CardSkeleton /></div>
      ) : !reviews || reviews.length === 0 ? (
        <EmptyState icon="orders" title="Nenhuma avaliação" description="Os clientes poderão avaliar pedidos entregues." />
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
                <Stars rating={Math.round(avgRating)} />
                <p className="text-xs text-muted-foreground mt-1">{reviews.length} avaliações</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold">{pendingReplies}</p>
                <p className="text-xs text-muted-foreground mt-1">Sem resposta</p>
                {pendingReplies > 0 && (
                  <Badge className="mt-2 bg-amber-50 text-amber-700 border-amber-200">Pendentes</Badge>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <RatingDistribution reviews={reviews} />
              </CardContent>
            </Card>
          </div>

          {/* Review list */}
          <div className="space-y-3">
            {reviews.map((review) => (
              <Card key={review.id} className={!review.admin_reply ? "border-l-2 border-l-amber-400" : ""}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{review.customer_name}</span>
                        <Badge variant="outline" className="text-[10px]">{review.order_number}</Badge>
                        {!review.admin_reply && (
                          <Badge className="text-[10px] bg-amber-50 text-amber-600 border-amber-200">Sem resposta</Badge>
                        )}
                      </div>
                      <Stars rating={review.rating} />
                      {review.comment && (
                        <p className="text-sm text-muted-foreground mt-1">"{review.comment}"</p>
                      )}
                      <p className="text-[11px] text-muted-foreground">{formatDate(review.created_at)}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary hover:bg-primary/10"
                        onClick={() => setReplyingId(replyingId === review.id ? null : review.id)}
                      >
                        <MessageSquare size={16} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir avaliação?</AlertDialogTitle>
                            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(review.id)} className="bg-red-600 hover:bg-red-700">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Admin reply section */}
                  {(review.admin_reply || replyingId === review.id) && (
                    <ReplyForm reviewId={review.id} existingReply={review.admin_reply} />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
