import type { Jurnal } from "../types/jurnal";
import InfoBaris from "./InfoBaris";

interface RingkasanJurnalProps {
  jurnal: Jurnal[];
}

export default function RingkasanJurnal({ jurnal }: RingkasanJurnalProps) {
  // Turunan data: dihitung saat render dari props, tidak disimpan di tempat lain
  const total = jurnal.length;
  const belumDireview = jurnal.filter((j) => j.statusReview === "belum").length;
  const sudahDireview = total - belumDireview;

  return (
    <div>
      <InfoBaris label="Total" nilai={total} />
      <InfoBaris label="Sudah direview" nilai={sudahDireview} />
      <InfoBaris label="Belum direview" nilai={belumDireview} />
    </div>
  );
}