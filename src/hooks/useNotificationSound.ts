import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Plays a subtle "ding" notification sound using the Web Audio API.
 * No external audio files needed.
 */
function playDing() {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12); // slight drop

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);

    // Cleanup
    oscillator.onended = () => ctx.close();
  } catch {
    // AudioContext not available (e.g. SSR, unsupported browser)
  }
}

/**
 * Hook that listens for new notifications and chat messages
 * for the current user and plays a subtle ding sound.
 */
export function useNotificationSound() {
  const { user } = useAuth();
  const lastPlayedRef = useRef(0);

  const playThrottled = useCallback(() => {
    const now = Date.now();
    // Throttle: at most once every 2 seconds
    if (now - lastPlayedRef.current < 2000) return;
    lastPlayedRef.current = now;
    playDing();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`sound-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `client_id=eq.${user.id}`,
        },
        () => playThrottled()
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `client_id=eq.${user.id}`,
        },
        (payload) => {
          // Only play for messages from admin (not own messages)
          if (payload.new && (payload.new as any).sender_role === "admin") {
            playThrottled();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, playThrottled]);
}
