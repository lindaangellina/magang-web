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
