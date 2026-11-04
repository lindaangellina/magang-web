import type { Peserta } from "../types/peserta";

// Data tiruan: bentuknya sama dengan response API, supaya nanti mudah diganti data asli (Minggu 19)
export const pesertaTiruan: Peserta[] = [
  { id: 1, nama: "Budi Santoso", sekolah: "SMK 5 Malang", email: "budi@example.com", fase: 1, status: "aktif", role: "peserta" },
  { id: 2, nama: "Ajeng Pratiwi", sekolah: "SMK 5 Malang", email: "ajeng@example.com", fase: 2, status: "aktif", role: "peserta" },
  { id: 3, nama: "Rizky Maulana", sekolah: "SMKN 2 Surabaya", email: "rizky@example.com", fase: 3, status: "lulus", role: "peserta" },
  { id: 4, nama: "Dewi Lestari", sekolah: "SMK Telkom Malang", email: "dewi@example.com", fase: 1, status: "berhenti", role: "peserta" },
];