import type { Peserta } from "../types/peserta";

// Omit: ambil SEMUA properti Peserta kecuali email
type PesertaTanpaEmailProps = Omit<Peserta, "email">;

export default function PesertaTanpaEmail({ nama, sekolah, fase, status, role }: PesertaTanpaEmailProps) {
  return (
    <p>
      {nama} · {sekolah} · Fase {fase} · {status} · {role}
    </p>
  );
}