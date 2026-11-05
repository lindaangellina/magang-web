import type { Jurnal } from "../types/jurnal";
import JurnalCard from "./jurnal/JurnalCard";

interface DaftarJurnalProps {
  jurnal: Jurnal[];
  onHapus?: (id: number) => void;
}

export default function DaftarJurnal({ jurnal, onHapus }: DaftarJurnalProps) {
  if (jurnal.length === 0) {
    return <p>Belum ada jurnal.</p>;
  }

  return (
    <ul className="daftar-jurnal">
      {jurnal.map((j) => (
        <li key={j.id}>
          <JurnalCard jurnal={j} onHapus={onHapus} />
        </li>
      ))}
    </ul>
  );
}
