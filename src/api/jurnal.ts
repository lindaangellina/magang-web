// src/api/jurnal.ts
import { request } from "./client";
import type { JurnalBaru, JurnalListResponse, JurnalResponse } from "./types";

interface OpsiDaftar {
  halaman?: number;
  signal?: AbortSignal;
}

// GET /me/jurnal sekarang berpagination (Minggu 19 Kamis): bertipe JurnalListResponse, lengkap dengan `meta`.
export async function ambilJurnalSaya({ halaman, signal }: OpsiDaftar = {}) {
  const body = await request<JurnalListResponse>("GET", "/me/jurnal", {
    query: { page: halaman, limit: 5 },
    signal,
  });
  return { daftar: body.data, meta: body.meta };   // buka bungkus supaya komponen tidak perlu data.data
}

export async function buatJurnal(data: JurnalBaru) {
  const body = await request<JurnalResponse>("POST", "/jurnal", { body: data });
  return body.data;
}
