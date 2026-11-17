import type { Peserta } from "../api/types";

// Data tiruan: bentuknya sama dengan response API, supaya nanti mudah diganti data asli (Minggu 19)
// createdAt wajib karena dokumen API mewajibkannya di schema Peserta.
export const pesertaTiruan: Peserta[] = [
  { id: 1, nama: "Linda Angellina", sekolah: "SMK 5 Malang", email: "linda@example.com", fase: 1, status: "aktif", role: "peserta", createdAt: "2026-09-01T02:00:00.000Z" },
  { id: 2, nama: "Ajeng Pratiwi", sekolah: "SMK 5 Malang", email: "ajeng@example.com", fase: 2, status: "aktif", role: "peserta", createdAt: "2026-09-01T02:05:00.000Z" },
  { id: 3, nama: "Rizky Maulana", sekolah: "SMKN 2 Surabaya", email: "rizky@example.com", fase: 3, status: "lulus", role: "peserta", createdAt: "2026-09-01T02:10:00.000Z" },
  { id: 4, nama: "Dewi Lestari", sekolah: "SMK Telkom Malang", email: "dewi@example.com", fase: 1, status: "berhenti", role: "peserta", createdAt: "2026-09-01T02:15:00.000Z" },
];