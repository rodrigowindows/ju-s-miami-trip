export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-square bg-gray-200" />

      <div className="p-3 space-y-2">
        {/* Brand */}
        <div className="h-3 bg-gray-200 rounded w-16" />
        {/* Name line 1 */}
        <div className="h-4 bg-gray-200 rounded w-full" />
        {/* Name line 2 */}
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        {/* Stars */}
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-200 rounded" />
          ))}
        </div>
        {/* Previous price */}
        <div className="h-3 bg-gray-200 rounded w-20" />
        {/* Price */}
        <div className="h-5 bg-gray-200 rounded w-28" />
        {/* Installment */}
        <div className="h-3 bg-gray-200 rounded w-32" />
        {/* Shipping badge */}
        <div className="h-5 bg-gray-200 rounded w-24" />
        {/* Button */}
        <div className="h-11 bg-gray-200 rounded-md w-full mt-2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
