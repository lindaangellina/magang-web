import type { Jurnal, UrutanJurnal } from "../types/jurnal";

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

// sort mengubah array, jadi yang diurutkan adalah SALINANNYA; array asli tidak berubah.
// id dipakai sebagai pembeda jika waktunya sama persis, supaya urutannya selalu pasti.
export function urutkanJurnal(jurnal: readonly Jurnal[], urutan: UrutanJurnal): Jurnal[] {
  const arah = urutan === "terbaru" ? -1 : 1;
  return [...jurnal].sort(
    (a, b) =>
      arah * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) || arah * (a.id - b.id),
  );
}
