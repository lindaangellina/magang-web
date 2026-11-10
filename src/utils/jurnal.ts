import type { Jurnal } from "../types/jurnal";

export interface RingkasanStatus {
  total: number;
  sudah: number;
  belum: number;
}

// Dihitung dari array setiap kali dipanggil, tidak ditulis manual
export function hitungRingkasan(jurnal: readonly Jurnal[]): RingkasanStatus {
  return {
    total: jurnal.length,
    sudah: jurnal.filter((j) => j.statusReview === "sudah").length,
    belum: jurnal.filter((j) => j.statusReview === "belum").length,
  };
}

// sort mengubah array, jadi yang diurutkan adalah SALINANNYA; array asli tidak berubah
export function urutkanTerbaru(jurnal: readonly Jurnal[]): Jurnal[] {
  return [...jurnal].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
