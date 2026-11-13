import type { FilterStatus, Jurnal, UrutanJurnal } from "../types/jurnal";
import type { FormJurnalState } from "./validasiJurnal";

// Type guard: memeriksa bentuk data di RUNTIME. Interface TypeScript lenyap saat program berjalan,
// jadi data dari luar (localStorage, API) harus diperiksa, bukan dipercaya begitu saja (jangan pakai `as`).
function adalahJurnal(x: unknown): x is Jurnal {
  return (
    typeof x === "object" &&
    x !== null &&
    "id" in x &&
    typeof x.id === "number" &&
    "pesertaId" in x &&
    typeof x.pesertaId === "number" &&
    "kegiatan" in x &&
    typeof x.kegiatan === "string" &&
    "statusReview" in x &&
    (x.statusReview === "belum" || x.statusReview === "sudah") &&
    "createdAt" in x &&
    typeof x.createdAt === "string"
  );
}

export const adalahDaftarJurnal = (x: unknown): x is Jurnal[] => Array.isArray(x) && x.every(adalahJurnal);

// Mempersempit string dari <select> menjadi union FilterStatus tanpa `as`
export const adalahFilterStatus = (x: string): x is FilterStatus => x === "semua" || x === "belum" || x === "sudah";

// Mempersempit string dari <select> menjadi union UrutanJurnal tanpa `as`
export const adalahUrutan = (x: string): x is UrutanJurnal => x === "terbaru" || x === "terlama";

// Draf form dari localStorage: ketiga kolomnya harus string
export const adalahFormJurnalState = (x: unknown): x is FormJurnalState =>
  typeof x === "object" &&
  x !== null &&
  "kegiatan" in x &&
  typeof x.kegiatan === "string" &&
  "hambatan" in x &&
  typeof x.hambatan === "string" &&
  "linkCommit" in x &&
  typeof x.linkCommit === "string";
