import { useState } from "react";
import Button from "../components/ui/Button";

// SOAL 4 — Rasakan mutasi. JANGAN DITIRU di kode sungguhan.
interface Item {
  id: number;
  nama: string;
}

const awal: Item[] = [
  { id: 1, nama: "Satu" },
  { id: 2, nama: "Dua" },
  { id: 3, nama: "Tiga" },
  { id: 4, nama: "Empat" },
];

export default function DemoMutasi() {
  // Salinan, supaya splice di demo ini tidak merusak array "awal"
  const [daftar, setDaftar] = useState<Item[]>(() => [...awal]);
  const [renderPaksa, setRenderPaksa] = useState(0);

  function hapusSalah(id: number) {
    const indeks = daftar.findIndex((item) => item.id === id);
    daftar.splice(indeks, 1); // mengubah array yang SAMA
    console.log("isi di memori:", daftar.map((item) => item.nama));
    setDaftar(daftar); // referensi sama: React menganggap tidak ada yang berubah
  }

  function hapusBenar(id: number) {
    setDaftar((lama) => lama.filter((item) => item.id !== id)); // array BARU
  }

  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <ul>
        {daftar.map((item) => (
          <li key={item.id} style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.25rem" }}>
            <span style={{ minWidth: "4rem" }}>{item.nama}</span>
            <Button variant="danger" ukuran="sm" onClick={() => hapusSalah(item.id)}>
              Hapus (salah)
            </Button>
            <Button ukuran="sm" onClick={() => hapusBenar(item.id)}>
              Hapus (benar)
            </Button>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Button variant="secondary" ukuran="sm" onClick={() => setRenderPaksa((n) => n + 1)}>
          Picu render lain
        </Button>
        <span>Dipicu: {renderPaksa}x</span>
        <Button variant="secondary" ukuran="sm" onClick={() => setDaftar([...awal])}>
          Pulihkan daftar
        </Button>
      </div>
    </div>
  );
}