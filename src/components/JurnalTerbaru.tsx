import type { Jurnal } from "../types/jurnal";
import DaftarJurnal from "./DaftarJurnal";

interface JurnalTerbaruProps {
  jurnal: Jurnal[];
}

export default function JurnalTerbaru({ jurnal }: JurnalTerbaruProps) {
  // sort MENGUBAH array, dan props tidak boleh diubah, jadi urutkan salinannya
  const terurut = [...jurnal].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime(),
  );

  return <DaftarJurnal jurnal={terurut} />;
}