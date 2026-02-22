import SummaryCards from "@/components/admin/SummaryCards";
import KanbanBoard from "@/components/admin/KanbanBoard";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da operação</p>
      </div>

      <SummaryCards />

      <div>
        <h2 className="mb-4 text-lg font-semibold">Pipeline de Pedidos</h2>
        <KanbanBoard />
      </div>
    </div>
  );
}
