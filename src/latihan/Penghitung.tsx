import { useState } from "react";
import Button from "../components/ui/Button";

// SOAL 3 dan 6 — Penghitung dengan state. Tiap <Penghitung /> punya state sendiri.
export default function Penghitung() {
  const [jumlah, setJumlah] = useState(0);

  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <Button variant="secondary" ukuran="sm" onClick={() => setJumlah((j) => Math.max(0, j - 1))}>
        Kurang
      </Button>
      <strong>{jumlah}</strong>
      <Button ukuran="sm" onClick={() => setJumlah((j) => j + 1)}>
        Tambah
      </Button>
      <Button variant="danger" ukuran="sm" onClick={() => setJumlah(0)}>
        Reset
      </Button>
    </div>
  );
}
