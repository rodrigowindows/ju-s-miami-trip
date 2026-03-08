import { Route } from "react-router-dom";
import PublicCatalog from "@/pages/PublicCatalog";
import PublicProductPage from "@/pages/PublicProductPage";
import BrandPage from "@/pages/BrandPage";
import ForgotPassword from "@/pages/ForgotPassword";
import Rastreio from "@/pages/Rastreio";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import { RedirectIfAuthed } from "@/routes/guards";

export function publicRoutes() {
  return (
    <>
      <Route path="/" element={<PublicCatalog />} />
      <Route path="/catalog" element={<PublicCatalog />} />
      <Route path="/rastreio" element={<Rastreio />} />
      <Route path="/produto/:slug" element={<PublicProductPage />} />
      <Route path="/marca/:slug" element={<BrandPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/login"
        element={<RedirectIfAuthed><Login /></RedirectIfAuthed>}
      />
      <Route
        path="/register"
        element={<RedirectIfAuthed><Register /></RedirectIfAuthed>}
      />
      <Route path="*" element={<NotFound />} />
    </>
  );
}
