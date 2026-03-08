import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export function RequireClient({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (profile && profile.role === "admin") return <Navigate to="/admin/dashboard" replace />;

  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (profile && profile.role !== "admin") return <Navigate to="/client/dashboard" replace />;

  return <>{children}</>;
}

export function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (user && profile) {
    if (profile.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/client/dashboard" replace />;
  }

  return <>{children}</>;
}
