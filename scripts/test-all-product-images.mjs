#!/usr/bin/env node
import fs from 'node:fs';

const url = process.env.SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.error('Missing env vars: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const endpoint = `${url.replace(/\/$/, '')}/rest/v1/catalog_products?select=name,brand,image_url&active=eq.true&limit=1000`;

const res = await fetch(endpoint, {
  headers: {
    apikey: serviceRole,
    Authorization: `Bearer ${serviceRole}`,
  },
});

if (!res.ok) {
  console.error(`Failed to fetch products: ${res.status} ${res.statusText}`);
  process.exit(1);
}

const products = await res.json();
const checks = await Promise.all(products.map(async (p) => {
  const img = p.image_url;
  if (!img) {
    return { ...p, status: 'missing', code: 0 };
  }

  if (img.startsWith('/')) {
    const local = `public${img}`;
    const ok = fs.existsSync(local);
    return { ...p, status: ok ? 'ok-local' : 'missing-local', code: ok ? 200 : 404 };
  }

  try {
    const r = await fetch(img, { method: 'HEAD', redirect: 'follow' });
    return { ...p, status: r.ok ? 'ok' : 'broken', code: r.status };
  } catch {
    return { ...p, status: 'error', code: 0 };
  }
}));

const ok = checks.filter((c) => c.status === 'ok' || c.status === 'ok-local');
const bad = checks.filter((c) => !['ok', 'ok-local'].includes(c.status));

console.log(`Total: ${checks.length}`);
console.log(`OK: ${ok.length}`);
console.log(`Broken/Missing: ${bad.length}`);

if (bad.length) {
  console.log('\nBroken entries:');
  for (const item of bad) {
    console.log(`- [${item.status}:${item.code}] ${item.brand} | ${item.name} | ${item.image_url ?? '<null>'}`);
  }
  process.exit(2);
}
