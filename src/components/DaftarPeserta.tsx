import type { Peserta } from "../types/peserta";

interface DaftarPesertaProps {
  peserta: Peserta[];
}

export default function DaftarPeserta({ peserta }: DaftarPesertaProps) {
  // Early return: keadaan khusus ditangani di awal
  if (peserta.length === 0) {
    return <p>Belum ada peserta.</p>;
  }

  return (
    <ul>
      {peserta.map((p) => (
        // key = id dari data: unik di antara saudara dan stabil antar render
        <li key={p.id}>
          {p.nama} — {p.sekolah}
        </li>
      ))}
    </ul>
  );
}