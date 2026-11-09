import { useState } from "react";
import Button from "../components/ui/Button";

// SOAL 4 — State adalah snapshot.
export default function PenghitungSnapshot() {
  const [jumlah, setJumlah] = useState(0);

  function tambahTigaSalah() {
    setJumlah(jumlah + 1); // jumlah di render INI = 0, jadwalkan 1
    setJumlah(jumlah + 1); // masih 0, jadwalkan 1
    setJumlah(jumlah + 1); // masih 0, jadwalkan 1
    console.log("setelah setJumlah (salah):", jumlah); // "ketinggalan": nilai render ini, bukan nilai baru
  }

  function tambahTigaBenar() {
    setJumlah((j) => j + 1); // bentuk fungsi: memakai nilai TERBARU
    setJumlah((j) => j + 1);
    setJumlah((j) => j + 1);
    console.log("setelah setJumlah (benar):", jumlah); // tetap nilai render ini
  }

  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
      <strong>{jumlah}</strong>
      <Button variant="secondary" ukuran="sm" onClick={tambahTigaSalah}>
        +3 (salah)
      </Button>
      <Button ukuran="sm" onClick={tambahTigaBenar}>
        +3 (benar)
      </Button>
      <Button variant="danger" ukuran="sm" onClick={() => setJumlah(0)}>
        Reset
      </Button>
    </div>
  );
}
