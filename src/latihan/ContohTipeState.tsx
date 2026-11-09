import { useState } from "react";
import Button from "../components/ui/Button";
import { jurnalTiruan } from "../data/jurnal";
import type { Jurnal, StatusReview } from "../types/jurnal";

// SOAL 7 — Lima pemanggilan useState dengan tipe yang tepat.
// Catatan: useState([]) tanpa generic diinfer sebagai never[] (array yang tidak boleh berisi apa pun),
// sehingga setDaftar(jurnalTiruan) ditolak TypeScript. Array kosong WAJIB diberi generic: useState<Jurnal[]>([]).
type FilterJurnal = "semua" | StatusReview;
const pilihanFilter: FilterJurnal[] = ["semua", "belum", "sudah"];

export default function ContohTipeState() {
  const [nama, setNama] = useState(""); // diinfer: string
  const [aktif, setAktif] = useState(false); // diinfer: boolean
  const [daftar, setDaftar] = useState<Jurnal[]>([]); // array objek: wajib generic
  const [terpilih, setTerpilih] = useState<Jurnal | null>(null); // bisa kosong: union dengan null
  const [filter, setFilter] = useState<FilterJurnal>("semua"); // union literal

  // Data turunan: dihitung saat render, TIDAK disimpan sebagai state
  const tampil = daftar.filter((j) => filter === "semua" || j.statusReview === filter);

  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <label>
        Nama: <input value={nama} onChange={(e) => setNama(e.target.value)} />
      </label>
      <label>
        <input type="checkbox" checked={aktif} onChange={(e) => setAktif(e.target.checked)} /> Aktif
      </label>
      <p>
        Halo, {nama || "(belum diisi)"}. Status: {aktif ? "aktif" : "tidak aktif"}.
      </p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <Button ukuran="sm" onClick={() => setDaftar(jurnalTiruan)}>
          Muat jurnal
        </Button>
        {pilihanFilter.map((p) => (
          <Button key={p} ukuran="sm" variant={filter === p ? "primary" : "secondary"} onClick={() => setFilter(p)}>
            {p}
          </Button>
        ))}
      </div>
      <p>
        Dimuat: {daftar.length}, tampil ({filter}): {tampil.length}
      </p>
      <ul>
        {tampil.map((j) => (
          <li key={j.id}>
            <button type="button" onClick={() => setTerpilih(j)}>
              {j.kegiatan}
            </button>
          </li>
        ))}
      </ul>
      <p>Terpilih: {terpilih ? terpilih.kegiatan : "belum ada"}</p>
    </div>
  );
}
