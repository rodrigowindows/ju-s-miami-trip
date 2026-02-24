import { supabase } from "@/integrations/supabase/client";

type ProfileFull = { full_name: string | null; phone: string | null; email: string };

export async function fetchProfileMapFull(
  clientIds: string[]
): Promise<Map<string, ProfileFull>> {
  if (clientIds.length === 0) return new Map();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, phone, email")
    .in("id", clientIds);

  return new Map(
    (profiles ?? []).map((p: { id: string } & ProfileFull) => [
      p.id,
      { full_name: p.full_name, phone: p.phone, email: p.email },
    ])
  );
}

export async function fetchProfileMapNames(
  clientIds: string[]
): Promise<Map<string, string | null>> {
  if (clientIds.length === 0) return new Map();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", clientIds);

  return new Map(
    (profiles ?? []).map((p: { id: string; full_name: string | null }) => [
      p.id,
      p.full_name,
    ])
  );
}
