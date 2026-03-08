import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { User, AuthError } from '@supabase/supabase-js';
import type { Profile } from '@/types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isClient: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, phone?: string, referralCode?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Translate common Supabase auth errors to Portuguese
function translateAuthError(error: AuthError): string {
  const msg = error.message.toLowerCase();
  if (msg.includes('invalid login credentials')) return 'Email ou senha incorretos.';
  if (msg.includes('email not confirmed')) return 'Confirme seu email antes de entrar.';
  if (msg.includes('user already registered')) return 'Este email já está cadastrado.';
  if (msg.includes('password should be at least')) return 'A senha deve ter pelo menos 6 caracteres.';
  if (msg.includes('rate limit')) return 'Muitas tentativas. Aguarde um momento.';
  return error.message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('Erro ao buscar perfil:', error.message);
      return;
    }
    setProfile(data as Profile);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return { error: error ? translateAuthError(error) : null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string, phone?: string, referralCode?: string): Promise<{ error: string | null }> => {
    const trimmedEmail = email.trim();
    const trimmedName = fullName.trim();

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: { data: { full_name: trimmedName, referral_code: referralCode || undefined } },
    });
    if (error) return { error: translateAuthError(error) };

    if (data.user) {
      const code = `${trimmedName.split(' ')[0].toUpperCase()}-MALA-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        email: trimmedEmail,
        full_name: trimmedName,
        phone: phone?.trim() ?? null,
        role: "cliente",
        referral_code: code,
        wallet_balance: 0,
      });
      if (profileError) return { error: profileError.message };
    }
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const isAdmin = profile?.role === 'admin';
  const isClient = profile?.role === 'cliente';

  const value = useMemo(
    () => ({ user, profile, loading, isAdmin, isClient, signIn, signUp, signOut }),
    [user, profile, loading, isAdmin, isClient, signIn, signUp, signOut]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
