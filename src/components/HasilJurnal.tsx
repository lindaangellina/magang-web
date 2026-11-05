import type { Jurnal } from "../types/jurnal";
import DaftarJurnal from "./DaftarJurnal";

// Discriminated union: properti "status" menentukan properti lain yang ada
type HasilJurnalProps =
  | { status: "memuat" }
  | { status: "berhasil"; data: Jurnal[] }
  | { status: "gagal"; pesan: string };

// Memakai props (bukan destructuring di parameter) agar penyempitan tipe lewat switch berjalan
export default function HasilJurnal(props: HasilJurnalProps) {
  switch (props.status) {
    case "memuat":
      return <p>Memuat data...</p>;
    case "berhasil":
      return <DaftarJurnal jurnal={props.data} />;
    case "gagal":
      return <p role="alert">Gagal: {props.pesan}</p>;
  }
}