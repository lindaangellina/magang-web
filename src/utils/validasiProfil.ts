// SOAL 8 — Pola yang sama dengan validasiJurnal: fungsi murni, error per kolom.
export interface FormProfilState {
  nama: string;
  telepon: string;
}

export type FormProfilErrors = Partial<Record<keyof FormProfilState, string>>;

export interface ProfilBaru {
  nama: string;
  telepon: string | null; // opsional kosong menjadi null, seperti field opsional dari API
}

// Format Indonesia: diawali 08, lalu 8 sampai 12 digit lagi (total 10 sampai 14 digit)
const POLA_TELEPON = /^08\d{8,12}$/;

export function validasiFormProfil(nilai: FormProfilState): FormProfilErrors {
  const errors: FormProfilErrors = {};
  const nama = nilai.nama.trim();
  const telepon = nilai.telepon.trim();

  if (nama.length < 3) errors.nama = "Nama minimal 3 karakter";

  if (telepon !== "" && !POLA_TELEPON.test(telepon)) {
    errors.telepon = "Telepon harus diawali 08 diikuti 8 sampai 12 digit";
  }

  return errors;
}
