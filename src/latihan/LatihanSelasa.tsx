import DemoDaftarPeserta from "./DemoDaftarPeserta";
import DemoKunciIndeks from "./DemoKunciIndeks";
import DemoMutasi from "./DemoMutasi";
import DemoObjekBersarang from "./DemoObjekBersarang";

// Halaman eksperimen Minggu 18 Selasa. Dibuka lewat http://localhost:5173/?halaman=latihan-selasa
// (Soal 1, 2, 3 dikerjakan di halaman utama: Hapus dan Tandai sudah direview di tiap kartu.)
export default function LatihanSelasa() {
  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <h1>Latihan Minggu 18 — Selasa</h1>
      <section>
        <h2>Soal 4: rasakan mutasi</h2>
        <DemoMutasi />
      </section>
      <section>
        <h2>Soal 5: bug key indeks</h2>
        <DemoKunciIndeks />
      </section>
      <section>
        <h2>Soal 6: fungsi murni untuk daftar peserta</h2>
        <DemoDaftarPeserta />
      </section>
      <section>
        <h2>Soal 7: objek bersarang</h2>
        <DemoObjekBersarang />
      </section>
    </div>
  );
}
