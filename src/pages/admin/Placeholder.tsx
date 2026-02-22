import { useLocation } from "react-router-dom";

export default function AdminPlaceholder() {
  const { pathname } = useLocation();
  const section = pathname.split("/").pop() ?? "";
  const title = section.charAt(0).toUpperCase() + section.slice(1);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-muted-foreground">
        Esta seção será implementada em breve.
      </p>
    </div>
  );
}
