import DemoAntiPola from "./DemoAntiPola";
import DemoEfek from "./DemoEfek";
import DemoPenundaan from "./DemoPenundaan";

// Halaman eksperimen Minggu 18 Kamis. Dibuka lewat http://localhost:5173/?halaman=latihan-kamis
// (Soal 1, 3, 4, 6, 7 dikerjakan di halaman utama.)
export default function LatihanKamis() {
  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <h1>Latihan Minggu 18 — Kamis</h1>
      <section>
        <h2>Soal 2: anti-pola (hasil filter disimpan sebagai state)</h2>
        <DemoAntiPola />
      </section>
      <section>
        <h2>Soal 5: StrictMode (lihat konsol)</h2>
        <DemoEfek />
      </section>
      <section>
        <h2>Soal 8: usePenundaan</h2>
        <DemoPenundaan />
      </section>
    </div>
  );
}
