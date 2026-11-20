// src/hooks/status.ts
import type { ApiError } from "../api/errors";

// Discriminated union dari Minggu 2 dan 17: status menentukan properti yang ada
export type StatusPermintaan<T> =
  | { status: "memuat" }
  | { status: "berhasil"; data: T }
  | { status: "gagal"; error: ApiError };

// Catatan: "kosong" BUKAN status tersendiri. Itu keadaan berhasil dengan daftar kosong
// (data.daftar.length === 0), diputuskan oleh tampilan.
// Alasannya: permintaannya sendiri berhasil dan datanya valid; "kosong" hanya cara memandang isi data.
// Kalau dijadikan status, semua kode yang memakai hook harus menjaga dua tempat (status dan isi data) tetap sama.
