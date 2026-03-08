import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import { RedirectIfAuthed } from "@/routes/guards";
import { PageSkeleton } from "@/components/shared/LoadingSkeleton";

const PublicCatalog = lazy(() => import("@/pages/PublicCatalog"));
const PublicProductPage = lazy(() => import("@/pages/PublicProductPage"));
const BrandPage = lazy(() => import("@/pages/BrandPage"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const Rastreio = lazy(() => import("@/pages/Rastreio"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-8"><PageSkeleton /></div>}>{children}</Suspense>;
}

export function publicRoutes() {
  return (
    <>
      <Route path="/" element={<Lazy><PublicCatalog /></Lazy>} />
      <Route path="/catalog" element={<Lazy><PublicCatalog /></Lazy>} />
      <Route path="/rastreio" element={<Lazy><Rastreio /></Lazy>} />
      <Route path="/produto/:slug" element={<Lazy><PublicProductPage /></Lazy>} />
      <Route path="/marca/:slug" element={<Lazy><BrandPage /></Lazy>} />
      <Route path="/forgot-password" element={<Lazy><ForgotPassword /></Lazy>} />
      <Route
        path="/login"
        element={<RedirectIfAuthed><Lazy><Login /></Lazy></RedirectIfAuthed>}
      />
      <Route
        path="/register"
        element={<RedirectIfAuthed><Lazy><Register /></Lazy></RedirectIfAuthed>}
      />
      <Route path="*" element={<Lazy><NotFound /></Lazy>} />
    </>
  );
}
