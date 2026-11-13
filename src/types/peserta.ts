// Cerminan schema Peserta di dokumentasi API (Swagger)
export interface Peserta {
  id: number;
  nama: string;
  sekolah: string;
  email: string;
  fase: number;
  status: "aktif" | "lulus" | "berhenti";
  role: "peserta" | "mentor";
}

// Peran pengguna di aplikasi: dipakai untuk saklar Peserta/Mentor
export type Peran = Peserta["role"];
