import { useState } from "react";

// SOAL 5 — Bug key berbasis indeks. Dua daftar identik, hanya cara memberi key yang berbeda.
interface DaftarDemoProps {
  kunci: "indeks" | "nama";
}

function DaftarDemo({ kunci }: DaftarDemoProps) {
  const [item, setItem] = useState(["Satu", "Dua", "Tiga"]);

  return (
    <div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {item.map((nama, indeks) => (
          <li key={kunci === "indeks" ? indeks : nama} style={{ marginBottom: "0.25rem" }}>
            {nama} <input placeholder="catatan" size={10} />
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => setItem((lama) => lama.slice(1))}>
        Hapus yang pertama
      </button>
    </div>
  );
}

export default function DemoKunciIndeks() {
  return (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      <section>
        <h3>key = indeks (BUG)</h3>
        <DaftarDemo kunci="indeks" />
      </section>
      <section>
        <h3>key = nama (benar)</h3>
        <DaftarDemo kunci="nama" />
      </section>
    </div>
  );
}
