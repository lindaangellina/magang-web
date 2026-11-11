import { useState } from "react";
import FormProfil from "../components/profil/FormProfil";
import type { ProfilBaru } from "../utils/validasiProfil";
import DemoEscape from "./DemoEscape";
import DemoTerkontrol from "./DemoTerkontrol";

// Halaman eksperimen Minggu 18 Rabu. Dibuka lewat http://localhost:5173/?halaman=latihan-rabu
// (Soal 1 sampai 4 dan 6 dikerjakan di halaman utama lewat FormJurnal.)
export default function LatihanRabu() {
  const [profil, setProfil] = useState<ProfilBaru | null>(null);

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <h1>Latihan Minggu 18 — Rabu</h1>
      <section>
        <h2>Soal 5: jebakan form terkontrol (lihat konsol)</h2>
        <DemoTerkontrol />
      </section>
      <section>
        <h2>Soal 7: aman karena React</h2>
        <DemoEscape />
      </section>
      <section>
        <h2>Soal 8: form Profil</h2>
        <FormProfil onSimpan={setProfil} />
        {profil && (
          <p>
            Tersimpan: {profil.nama}, telepon {profil.telepon ?? "(tidak diisi, null)"}
          </p>
        )}
      </section>
    </div>
  );
}
