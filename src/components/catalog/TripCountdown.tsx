import { useEffect, useState } from "react";
import { Plane, Clock, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Trip {
  id: string;
  code: string;
  departure_date: string;
  arrival_date: string;
  max_weight_kg: number;
  status: string;
}

function useNextTrip() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("trips")
        .select("id, code, departure_date, arrival_date, max_weight_kg, status")
        .in("status", ["planejada", "em_andamento"])
        .gte("departure_date", new Date().toISOString().split("T")[0])
        .order("departure_date", { ascending: true })
        .limit(1);

      setTrip(data?.[0] as Trip | null ?? null);
      setLoading(false);
    }
    fetch();
  }, []);

  return { trip, loading };
}

function useCountdownDays(targetDate: string | null) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    if (!targetDate) return;
    function calc() {
      const diff = new Date(targetDate).getTime() - Date.now();
      setDays(Math.max(0, Math.ceil(diff / 86400000)));
    }
    calc();
    const interval = setInterval(calc, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return days;
}

export default function TripCountdown() {
  const { trip, loading } = useNextTrip();
  const daysLeft = useCountdownDays(trip?.departure_date ?? null);

  if (loading || !trip || daysLeft === null) return null;

  const isUrgent = daysLeft <= 3;
  const departureFormatted = new Date(trip.departure_date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <section className={`${isUrgent ? "bg-red-600" : "bg-gradient-to-r from-[#131921] to-[#1a2332]"} text-white`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center gap-3 sm:gap-5 flex-wrap text-center">
        <div className="flex items-center gap-2">
          <Plane size={18} className={isUrgent ? "animate-bounce" : ""} />
          <span className="text-sm font-bold">
            Próxima viagem Miami
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1.5">
            <Clock size={14} />
            <span className="text-sm font-mono font-bold">
              {daysLeft === 0 ? "HOJE!" : `${daysLeft} dia${daysLeft !== 1 ? "s" : ""}`}
            </span>
          </div>

          <span className="text-xs text-white/80 hidden sm:inline">
            Saída: {departureFormatted}
          </span>
        </div>

        {isUrgent && (
          <div className="flex items-center gap-1.5 text-yellow-200 text-xs font-medium">
            <AlertTriangle size={14} />
            Últimas vagas!
          </div>
        )}

        <span className="text-xs text-white/70">
          Peça agora para envio nesta viagem
        </span>
      </div>
    </section>
  );
}
