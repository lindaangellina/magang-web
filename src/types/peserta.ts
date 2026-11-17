import type { Peserta } from "../api/types";

// Peran pengguna di aplikasi: dipakai untuk saklar Peserta/Mentor (diturunkan dari tipe API)
export type Peran = Peserta["role"];
