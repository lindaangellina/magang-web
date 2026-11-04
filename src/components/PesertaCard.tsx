import type { Peserta } from "../types/peserta";
import InfoBaris from "./InfoBaris";

interface PesertaCardProps {
  peserta: Peserta;
  tampilkanEmail?: boolean; // opsional, bawaan false
}

export default function PesertaCard({ peserta, tampilkanEmail = false }: PesertaCardProps) {
  return (
    <article className="peserta-card">
      <h3>{peserta.nama}</h3>
      <InfoBaris label="Sekolah" nilai={peserta.sekolah} />
      <InfoBaris label="Fase" nilai={peserta.fase} />
      <InfoBaris label="Status" nilai={peserta.status} />
      {/* false tidak menampilkan apa-apa, jadi email hanya muncul saat tampilkanEmail true */}
      {tampilkanEmail && <InfoBaris label="Email" nilai={peserta.email} />}
    </article>
  );
}