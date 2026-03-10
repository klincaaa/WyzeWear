import { headers } from "next/headers";

/** Base URL za fetch iz server komponenti ka sopstvenim API rutama. Koristi host iz zahteva da fetch uvek ide na isti origin. */
export async function getBaseUrl(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get("host") ?? h.get("x-forwarded-host");
    if (host) {
      const proto = h.get("x-forwarded-proto") ?? "http";
      return `${proto}://${host}`;
    }
  } catch {
    // headers() nije dostupan (npr. build)
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
