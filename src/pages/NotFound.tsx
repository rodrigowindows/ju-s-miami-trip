import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <div className="text-6xl mb-4">🧳</div>
        <h1 className="mb-2 text-4xl font-display font-bold">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">Ops! Essa página não foi encontrada.</p>
        <a href="/" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Voltar para o início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
