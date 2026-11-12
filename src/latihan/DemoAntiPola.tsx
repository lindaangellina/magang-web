import { useState } from "react";
import Button from "../components/ui/Button";

// SOAL 2 — Anti-pola: menyimpan hasil filter sebagai state (kiri) dibanding data turunan (kanan).
interface ItemDemo {
  id: number;
  nama: string;
  selesai: boolean;
}

type FilterDemo = "semua" | "selesai" | "belum";
const pilihanFilter: FilterDemo[] = ["semua", "selesai", "belum"];

const awal: ItemDemo[] = [
  { id: 1, nama: "Item 1", selesai: true },
  { id: 2, nama: "Item 2", selesai: false },
  { id: 3, nama: "Item 3", selesai: true },
];

function cocok(item: ItemDemo, filter: FilterDemo): boolean {
  return filter === "semua" || (filter === "selesai") === item.selesai;
}

export default function DemoAntiPola() {
  const [item, setItem] = useState<ItemDemo[]>(awal);
  const [filter, setFilter] = useState<FilterDemo>("semua");

  // ANTI-POLA: salinan kedua dari data yang bisa dihitung
  const [tampilSalah, setTampilSalah] = useState<ItemDemo[]>(awal);

  // BENAR: dihitung saat render, selalu sinkron
  const tampilBenar = item.filter((i) => cocok(i, filter));

  function ubahFilter(baru: FilterDemo) {
    setFilter(baru);
    setTampilSalah(item.filter((i) => cocok(i, baru))); // diingat diperbarui di sini...
  }

  function tambah() {
    const id = Math.max(0, ...item.map((i) => i.id)) + 1;
    setItem((lama) => [...lama, { id, nama: `Item ${id}`, selesai: false }]);
    // ...tetapi di sini LUPA memperbarui tampilSalah
  }

  function hapusPertama() {
    setItem((lama) => lama.slice(1)); // dan di sini juga lupa
  }

  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {pilihanFilter.map((p) => (
          <Button key={p} ukuran="sm" variant={filter === p ? "primary" : "secondary"} onClick={() => ubahFilter(p)}>
            {p}
          </Button>
        ))}
        <Button ukuran="sm" onClick={tambah}>
          Tambah item
        </Button>
        <Button variant="danger" ukuran="sm" onClick={hapusPertama}>
          Hapus item pertama
        </Button>
      </div>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <section>
          <h3>Salah: disimpan sebagai state</h3>
          <ul>
            {tampilSalah.map((i) => (
              <li key={i.id}>{i.nama}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Benar: data turunan</h3>
          <ul>
            {tampilBenar.map((i) => (
              <li key={i.id}>{i.nama}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
