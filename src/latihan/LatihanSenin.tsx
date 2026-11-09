import ContohTipeState from "./ContohTipeState";
import Penghitung from "./Penghitung";
import PenghitungLet from "./PenghitungLet";
import PenghitungSnapshot from "./PenghitungSnapshot";

// Halaman eksperimen Minggu 18 Senin. Dibuka lewat http://localhost:5173/?halaman=latihan
export default function LatihanSenin() {
  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <h1>Latihan Minggu 18 — Senin</h1>
      <section>
        <h2>Soal 2: variabel biasa (let)</h2>
        <PenghitungLet />
      </section>
      <section>
        <h2>Soal 3: Penghitung dengan state</h2>
        <Penghitung />
      </section>
      <section>
        <h2>Soal 4: snapshot</h2>
        <PenghitungSnapshot />
      </section>
      <section>
        <h2>Soal 6: state milik instans</h2>
        <Penghitung />
        <Penghitung />
      </section>
      <section>
        <h2>Soal 7: tipe state</h2>
        <ContohTipeState />
      </section>
    </div>
  );
}
