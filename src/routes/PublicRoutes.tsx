import { lazy } from "react";
import { Route } from "react-router-dom";
import { RedirectIfAuthed } from "@/routes/guards";
import { Lazy } from "@/routes/LazyRoute";

const PublicCatalog = lazy(() => import("@/pages/PublicCatalog"));
const PublicProductPage = lazy(() => import("@/pages/PublicProductPage"));
const BrandPage = lazy(() => import("@/pages/BrandPage"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const Rastreio = lazy(() => import("@/pages/Rastreio"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Sobre = lazy(() => import("@/pages/Sobre"));
const ComoFunciona = lazy(() => import("@/pages/ComoFunciona"));
const PoliticaDeTroca = lazy(() => import("@/pages/PoliticaDeTroca"));
const PoliticaDePrivacidade = lazy(() => import("@/pages/PoliticaDePrivacidade"));
const Favoritos = lazy(() => import("@/pages/Favoritos"));

export function publicRoutes() {
  return (
    <>
      <Route path="/" element={<Lazy><PublicCatalog /></Lazy>} />
      <Route path="/catalog" element={<Lazy><PublicCatalog /></Lazy>} />
      <Route path="/rastreio" element={<Lazy><Rastreio /></Lazy>} />
      <Route path="/produto/:slug" element={<Lazy><PublicProductPage /></Lazy>} />
      <Route path="/marca/:slug" element={<Lazy><BrandPage /></Lazy>} />
      <Route path="/sobre" element={<Lazy><Sobre /></Lazy>} />
      <Route path="/como-funciona" element={<Lazy><ComoFunciona /></Lazy>} />
      <Route path="/politica-de-troca" element={<Lazy><PoliticaDeTroca /></Lazy>} />
      <Route path="/politica-de-privacidade" element={<Lazy><PoliticaDePrivacidade /></Lazy>} />
      <Route path="/favoritos" element={<Lazy><Favoritos /></Lazy>} />
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
