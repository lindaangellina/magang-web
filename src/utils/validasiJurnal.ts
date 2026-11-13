import type { StatusReview } from "../types/jurnal";

// Validasi di klien hanya untuk kenyamanan pengguna. Server tetap penentu akhir.
// Aturan mencerminkan CreateJurnalRequest di dokumentasi API: kegiatan 10-2000 karakter, link berupa URL.
export interface FormJurnalState {
  kegiatan: string;
  hambatan: string;
  linkCommit: string;
}

// Partial + Record + keyof: setiap field boleh punya satu pesan error
export type FormJurnalErrors = Partial<Record<keyof FormJurnalState, string>>;

function urlValid(teks: string): boolean {
  try {
    const url = new URL(teks);
    return url.protocol === "http:" || url.protocol === "https:"; // tolak javascript: dan sejenisnya
  } catch {
    return false;
  }
}

// Fungsi MURNI: tanpa state dan tanpa React, jadi mudah diuji
export function validasiFormJurnal(nilai: FormJurnalState): FormJurnalErrors {
  const errors: FormJurnalErrors = {};
  const kegiatan = nilai.kegiatan.trim();
  const link = nilai.linkCommit.trim();

  if (kegiatan.length < 10) errors.kegiatan = "Kegiatan minimal 10 karakter";
  else if (kegiatan.length > 2000) errors.kegiatan = "Kegiatan maksimal 2000 karakter";

  if (nilai.hambatan.trim().length > 2000) errors.hambatan = "Hambatan maksimal 2000 karakter";

  if (link !== "" && !urlValid(link)) errors.linkCommit = "Link commit harus berupa URL yang valid";

  return errors;
}

// Aturan review mentor (mirip ReviewJurnalDto): status "sudah" WAJIB disertai catatan minimal 5 karakter.
// Mengembalikan pesan error, atau undefined jika valid. Fungsi murni, mudah diuji.
export function validasiReview(status: StatusReview, catatan: string): string | undefined {
  const teks = catatan.trim();
  if (status === "sudah" && teks.length < 5) {
    return "Catatan wajib diisi minimal 5 karakter untuk menandai sudah direview";
  }
  if (teks.length > 2000) return "Catatan maksimal 2000 karakter";
  return undefined;
}
