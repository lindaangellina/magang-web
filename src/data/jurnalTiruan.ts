import type { Jurnal } from "../types/jurnal";

// Sengaja tidak berurutan tanggal, supaya hasil sort terlihat.
// Mencakup: hambatan null, hambatan berisi, lampiran kosong dan berisi.
export const jurnalTiruan: Jurnal[] = [
  {
    id: 1,
    tanggal: "2026-10-26T03:15:00.000Z",
    kegiatan: "Membuat endpoint registrasi dan login",
    hambatan: null,
    rencanaBesok: "Menambah validasi input",
    statusReview: "disetujui",
    lampiran: [],
  },
  {
    id: 2,
    tanggal: "2026-10-28T03:15:00.000Z",
    kegiatan: "Menulis unit test untuk DTO",
    hambatan: "Belum paham cara membuat mock repository",
    rencanaBesok: "Mempelajari dependency injection",
    statusReview: "disetujui",
    lampiran: ["hasil-test.png"],
  },
  {
    id: 3,
    tanggal: "2026-10-27T03:15:00.000Z",
    kegiatan: "Menambah dokumentasi Swagger untuk endpoint peserta",
    hambatan: null,
    rencanaBesok: "Menambah dokumentasi endpoint jurnal",
    statusReview: "belum",
    lampiran: ["swagger-peserta.png", "openapi.json"],
  },
  {
    id: 4,
    tanggal: "2026-10-30T03:15:00.000Z",
    kegiatan: "Mengekspor openapi.json dan menguji dokumentasi repo teman",
    hambatan: "Token kedaluwarsa saat mencoba endpoint",
    rencanaBesok: "Merekam video demo",
    statusReview: "belum",
    lampiran: [],
  },
];