// Cerminan schema Jurnal di dokumentasi API (Swagger)
export type StatusReview = "belum" | "disetujui" | "ditolak";

export interface Jurnal {
  id: number;
  tanggal: string; // string ISO dari API, mis. "2026-10-28T03:15:00.000Z"
  kegiatan: string;
  hambatan: string | null; // boleh null: tidak semua jurnal punya hambatan
  rencanaBesok: string;
  statusReview: StatusReview;
  lampiran: string[]; // nama file; bisa berupa array kosong
}
