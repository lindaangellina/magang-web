import type { Jurnal } from "../types/jurnal";
import { formatTanggal } from "../utils/format";
import InfoBaris from "./InfoBaris";

interface DaftarJurnalProps {
  jurnal: Jurnal[];
}

export default function DaftarJurnal({ jurnal }: DaftarJurnalProps) {
  if (jurnal.length === 0) {
    return <p>Belum ada jurnal.</p>;
  }

  return (
    <ul className="daftar-jurnal">
      {jurnal.map((j) => (
        <li key={j.id}>
          <h3>{j.kegiatan}</h3>
          <InfoBaris label="Tanggal" nilai={formatTanggal(j.tanggal)} />
          <InfoBaris label="Review" nilai={j.statusReview} />
          {/* Field opsional: null tidak tampil */}
          {j.hambatan && <InfoBaris label="Hambatan" nilai={j.hambatan} />}
          {/* Perbandingan boolean (> 0), bukan j.lampiran.length && ... */}
          {j.lampiran.length > 0 && <InfoBaris label="Lampiran" nilai={j.lampiran.join(", ")} />}
        </li>
      ))}
    </ul>
  );
}