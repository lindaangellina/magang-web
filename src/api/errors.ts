// src/api/errors.ts
import type { FieldError } from "./types";

// Kode dari server (enum di dokumen) ditambah tiga kode yang hanya ada di klien
export type KodeError =
  | "VALIDATION_ERROR" | "INVALID_JSON" | "UNAUTHORIZED" | "TOKEN_EXPIRED" | "INVALID_TOKEN"
  | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "PAYLOAD_TOO_LARGE" | "RATE_LIMITED" | "INTERNAL_ERROR"
  | "NETWORK_ERROR"        // fetch gagal: server mati, internet putus, diblokir CORS
  | "BAD_RESPONSE"         // respons bukan JSON yang dikenali (mis. halaman HTML 502)
  | "UNKNOWN_ERROR";

export class ApiError extends Error {
  readonly status: number;            // 0 = tidak ada respons sama sekali
  readonly kode: string;
  readonly detail: FieldError[];
  readonly requestId?: string;

  // Properti ditulis eksplisit (bukan parameter property) agar lolos aturan template Vite
  constructor(pesan: string, status: number, kode: string, detail: FieldError[] = [], requestId?: string) {
    super(pesan);
    this.name = "ApiError";
    this.status = status;
    this.kode = kode;
    this.detail = detail;
    this.requestId = requestId;
  }
}

// Periksa jenis error dengan kode yang diketik: salah ketik langsung ditolak compiler
export function adalahKode(err: unknown, kode: KodeError): err is ApiError {
  return err instanceof ApiError && err.kode === kode;
}

export function keApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  return new ApiError("Terjadi kesalahan tak terduga", 0, "UNKNOWN_ERROR");
}

// Pembaca body error TANPA as (type narrowing manual, seperti di Minggu 18)
function adalahFieldError(x: unknown): x is FieldError {
  return (
    typeof x === "object" && x !== null &&
    "field" in x && typeof x.field === "string" &&
    "pesan" in x && typeof x.pesan === "string"
  );
}

export function bacaErrorBody(
  json: unknown
): { kode: string; pesan: string; detail: FieldError[]; requestId?: string } | null {
  if (typeof json !== "object" || json === null || !("error" in json)) return null;

  const { error } = json;
  if (typeof error !== "object" || error === null) return null;

  const kode = "kode" in error && typeof error.kode === "string" ? error.kode : null;
  const pesan = "pesan" in error && typeof error.pesan === "string" ? error.pesan : null;
  if (kode === null || pesan === null) return null;

  const detail = "detail" in error && Array.isArray(error.detail) ? error.detail.filter(adalahFieldError) : [];
  const requestId = "requestId" in json && typeof json.requestId === "string" ? json.requestId : undefined;

  return { kode, pesan, detail, requestId };
}

// Sesi tidak berlaku lagi (tanpa token, token kedaluwarsa, atau token rusak). Diputuskan dari KODE, bukan teks pesan.
export function adalahSesiBerakhir(err: ApiError): boolean {
  return err.kode === "UNAUTHORIZED" || err.kode === "TOKEN_EXPIRED" || err.kode === "INVALID_TOKEN";
}
