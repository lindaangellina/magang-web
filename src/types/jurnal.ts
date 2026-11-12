// Cerminan schema Jurnal di dokumentasi API (Swagger)
// Perhatikan: field opsional dari API bisa bernilai null, bukan hanya undefined.
export type StatusReview = "belum" | "sudah";

export interface Lampiran {
  url: string;
  keterangan?: string;
}

export interface Jurnal {
  id: number;
  pesertaId: number;
  kegiatan: string;
  hambatan?: string | null;
  linkCommit?: string | null;
  lampiran?: Lampiran[] | null;
  statusReview: StatusReview;
  catatanMentor?: string | null;
  createdAt: string; // tanggal ISO 8601, mis. "2026-10-28T03:15:00.000Z"
}
// Di Minggu 19, tipe tulisan tangan ini diganti tipe yang DIHASILKAN dari dokumen OpenAPI.

// Data yang diisi pengguna di form tambah jurnal; sisanya (id, status, dst) diisi sistem
export type JurnalBaru = Pick<Jurnal, "kegiatan" | "hambatan" | "linkCommit">;

// Pilihan filter di daftar jurnal: semua, atau salah satu status review
export type FilterStatus = "semua" | StatusReview;
