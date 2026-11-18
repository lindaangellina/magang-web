// src/api/jurnal.ts
import { request } from "./client";
import type { JurnalBaru, JurnalResponse, JurnalSayaResponse } from "./types";

interface OpsiDaftar {
  signal?: AbortSignal;
}

// GET /me/jurnal di dokumen OpenAPI bertipe JurnalSayaResponse: ada `total`, TANPA `meta` dan TANPA pagination.
// Karena itu tidak ada parameter halaman, dan hasilnya membawa total (bukan meta).
export async function ambilJurnalSaya({ signal }: OpsiDaftar = {}) {
  const body = await request<JurnalSayaResponse>("GET", "/me/jurnal", { signal });
  return { daftar: body.data, total: body.total };   // buka bungkus supaya komponen tidak perlu data.data
}

export async function buatJurnal(data: JurnalBaru) {
  const body = await request<JurnalResponse>("POST", "/jurnal", { body: data });
  return body.data;
}
