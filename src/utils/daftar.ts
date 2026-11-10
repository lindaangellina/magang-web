import type { Peserta } from "../types/peserta";

// SOAL 6 — Lima operasi daftar sebagai FUNGSI MURNI: array masuk tidak diubah, hasilnya array BARU.
// Parameter bertipe readonly Peserta[] sehingga mutasi (push, splice, sort) ditolak TypeScript.

export function tambahPeserta(daftar: readonly Peserta[], peserta: Peserta): Peserta[] {
  return [...daftar, peserta];
}

export function hapusPeserta(daftar: readonly Peserta[], id: number): Peserta[] {
  return daftar.filter((p) => p.id !== id);
}

export function gantiPeserta(daftar: readonly Peserta[], id: number, pengganti: Peserta): Peserta[] {
  return daftar.map((p) => (p.id === id ? pengganti : p));
}

export function ubahStatusPeserta(daftar: readonly Peserta[], id: number, status: Peserta["status"]): Peserta[] {
  return daftar.map((p) => (p.id === id ? { ...p, status } : p));
}

// sort mengubah array, jadi yang diurutkan adalah salinannya
export function urutkanPesertaByNama(daftar: readonly Peserta[]): Peserta[] {
  return [...daftar].sort((a, b) => a.nama.localeCompare(b.nama, "id"));
}
