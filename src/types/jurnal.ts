// Tipe khusus tampilan. Tipe data dari API (Jurnal, Lampiran, StatusReview, JurnalBaru)
// dihasilkan dari dokumen OpenAPI dan diimpor dari "../api/types".
import type { StatusReview } from "../api/types";

// Pilihan filter di daftar jurnal: semua, atau salah satu status review
export type FilterStatus = "semua" | StatusReview;

// Hasil review mentor, mengikuti aturan ReviewJurnalDto di API: catatan wajib (min. 5 karakter) saat status "sudah"
export interface ReviewJurnal {
  status: StatusReview;
  catatanMentor: string | null;
}

export type UrutanJurnal = "terbaru" | "terlama";
