import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/components/shared/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, user, profile, loading } = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user && profile) {
      navigate(profile.role === "admin" ? "/admin" : "/client/catalog", { replace: true });
    }
  }, [loading, user, profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setLoginLoading(false);
    if (error) {
      toast.error("Email ou senha inválidos.");
    } else {
      toast.success("Bem-vindo(a) de volta!");
      // Profile will load via auth state change, redirect handled by useEffect
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    const { error } = await signUp(regEmail, regPassword, regName, regPhone || undefined);
    setRegLoading(false);
    if (error) {
      toast.error("Erro ao criar conta. Tente novamente.");
    } else {
      toast.success("Conta criada com sucesso!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-miami-sand to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
          <p className="text-sm text-muted-foreground mt-2">Sua ponte de compras para Miami</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Criar Conta</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <CardContent className="p-0 pt-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Input id="login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="seu@email.com" required />
                    </div>
                    <div>
                      <Label htmlFor="login-password">Senha</Label>
                      <Input id="login-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Sua senha" required />
                    </div>
                    <Button type="submit" className="w-full" disabled={loginLoading}>
                      {loginLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>

              <TabsContent value="register">
                <CardContent className="p-0 pt-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="reg-name">Nome completo</Label>
                      <Input id="reg-name" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Seu nome" required />
                    </div>
                    <div>
                      <Label htmlFor="reg-email">Email</Label>
                      <Input id="reg-email" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="seu@email.com" required />
                    </div>
                    <div>
                      <Label htmlFor="reg-phone">Telefone (WhatsApp)</Label>
                      <Input id="reg-phone" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="+5561999999999" />
                    </div>
                    <div>
                      <Label htmlFor="reg-password">Senha</Label>
                      <Input id="reg-password" type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Mínimo 6 caracteres" minLength={6} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={regLoading}>
                      {regLoading ? "Criando conta..." : "Criar Conta"}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          MalaBridge &copy; {new Date().getFullYear()}. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
