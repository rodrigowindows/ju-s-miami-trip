import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, LogOut } from "lucide-react";

export default function Profile() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border px-4 pt-3 pb-3">
        <h1 className="font-display text-xl font-bold text-foreground">Perfil</h1>
      </header>

      <main className="px-4 pt-6 pb-24 space-y-6">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mb-3">
            <User size={32} className="text-violet-600" />
          </div>
          <h2 className="font-display text-lg font-bold text-foreground">
            {profile?.full_name || "Usuário"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {profile?.role === "cliente" ? "Cliente" : profile?.role}
          </p>
        </div>

        {/* Info Cards */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Mail size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground">
                {user?.email || "—"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <Phone size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Telefone</p>
              <p className="text-sm font-medium text-foreground">
                {profile?.phone || "Não informado"}
              </p>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full rounded-full gap-2 text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut size={16} />
          Sair da conta
        </Button>
      </main>
    </div>
  );
}
