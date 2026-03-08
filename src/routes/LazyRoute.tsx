import { Suspense } from "react";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { PageSkeleton } from "@/components/shared/LoadingSkeleton";

export function Lazy({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center p-8">
            <PageSkeleton />
          </div>
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
