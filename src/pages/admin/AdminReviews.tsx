import { Star, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useAllOrderReviews, useDeleteOrderReview } from "@/hooks/useOrderReviews";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import EmptyState from "@/components/shared/EmptyState";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/format";

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

export default function AdminReviews() {
  const { data: reviews, isLoading } = useAllOrderReviews();
  const deleteReview = useDeleteOrderReview();
  const { toast } = useToast();

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

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
            <Card className="sm:col-span-2">
              <CardContent className="pt-4">
                <RatingDistribution reviews={reviews} />
              </CardContent>
            </Card>
          </div>

          {/* Review list */}
          <div className="space-y-3">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{review.customer_name}</span>
                        <Badge variant="outline" className="text-[10px]">{review.order_number}</Badge>
                      </div>
                      <Stars rating={review.rating} />
                      {review.comment && (
                        <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                      )}
                      <p className="text-[11px] text-muted-foreground">{formatDate(review.created_at)}</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0">
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
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
