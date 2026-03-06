-- Deprecated migration kept for history only.
-- Intentionally no-op: broad replacement of all Amazon CDN URLs was too aggressive.
-- Real handling now happens in frontend runtime fallback (on image load error),
-- preserving potentially valid CDN links while still preventing broken visuals.
SELECT 1;
