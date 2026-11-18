// src/api/client.ts
// ATURAN: HANYA file ini yang boleh memanggil fetch. Komponen dan hook memakai fungsi di auth.ts dan jurnal.ts.
import { BASE_URL } from "./konfigurasi";
import { ApiError, bacaErrorBody } from "./errors";

type Metode = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type NilaiQuery = string | number | boolean | undefined;

interface OpsiRequest {
  body?: unknown;
  query?: Record<string, NilaiQuery>;
  signal?: AbortSignal;                  // untuk membatalkan permintaan (Kamis)
}

// Token sementara di memori. Minggu 20 menggantinya dengan penyimpanan dan penyegaran yang benar
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

function buatUrl(path: string, query?: Record<string, NilaiQuery>): string {
  const url = new URL(BASE_URL + path, window.location.origin);
  for (const [kunci, nilai] of Object.entries(query ?? {})) {
    if (nilai !== undefined) url.searchParams.set(kunci, String(nilai));
  }
  return url.toString();
}

export async function request<T>(metode: Metode, path: string, opsi: OpsiRequest = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (opsi.body !== undefined) headers["Content-Type"] = "application/json";
  if (accessToken !== null) headers["Authorization"] = `Bearer ${accessToken}`;

  // 1. Kirim permintaan. fetch menolak HANYA jika jaringan gagal
  let res: Response;
  try {
    res = await fetch(buatUrl(path, opsi.query), {
      method: metode,
      headers,
      body: opsi.body !== undefined ? JSON.stringify(opsi.body) : undefined,
      signal: opsi.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;   // dibatalkan sengaja: jangan dibungkus
    throw new ApiError("Tidak dapat terhubung ke server", 0, "NETWORK_ERROR");
  }

  // 2. Baca isi sebagai teks dulu: isinya bisa kosong atau bukan JSON
  const requestId = res.headers.get("X-Request-Id") ?? undefined;
  const teks = await res.text();
  let json: unknown = null;
  if (teks !== "") {
    try {
      json = JSON.parse(teks);
    } catch {
      json = null;
    }
  }

  // 3. Status bukan 2xx: terjemahkan format error baku Minggu 13
  if (!res.ok) {
    const info = bacaErrorBody(json);
    throw new ApiError(
      info?.pesan ?? "Respons server tidak dikenali",
      res.status,
      info?.kode ?? "BAD_RESPONSE",
      info?.detail ?? [],
      info?.requestId ?? requestId
    );
  }

  // 4. Sukses
  if (res.status === 204) return undefined as T;        // 204 memang tanpa isi
  if (json === null) {
    throw new ApiError("Server tidak mengirim JSON yang valid", res.status, "BAD_RESPONSE", [], requestId);
  }
  return json as T;     // SATU-SATUNYA titik kepercayaan: kita menganggap bentuknya sesuai kontrak OpenAPI
}
