import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageSkeleton } from "@/components/shared/LoadingSkeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "cliente";
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <PageSkeleton />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && profile && profile.role !== requiredRole) {
    const redirect = profile.role === "admin" ? "/admin" : "/client/catalog";
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
}
