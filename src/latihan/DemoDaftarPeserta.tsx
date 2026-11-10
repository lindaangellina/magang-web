import { useState } from "react";
import Button from "../components/ui/Button";
import { pesertaTiruan } from "../data/pesertaTiruan";
import type { Peserta } from "../types/peserta";
import {
  gantiPeserta,
  hapusPeserta,
  tambahPeserta,
  ubahStatusPeserta,
  urutkanPesertaByNama,
} from "../utils/daftar";

// SOAL 6 — Memakai lima fungsi murni dari utils/daftar.ts.
export default function DemoDaftarPeserta() {
  const [daftar, setDaftar] = useState<Peserta[]>(pesertaTiruan);

  // Data turunan: id baru dihitung dari daftar saat render
  const idBaru = Math.max(0, ...daftar.map((p) => p.id)) + 1;
  const pertama = daftar.at(0);

  function tambah() {
    setDaftar((lama) =>
      tambahPeserta(lama, {
        id: idBaru,
        nama: `Peserta Baru ${idBaru}`,
        sekolah: "SMK Contoh",
        email: `baru${idBaru}@example.com`,
        fase: 1,
        status: "aktif",
        role: "peserta",
      }),
    );
  }

  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <Button ukuran="sm" onClick={tambah}>
          Tambah
        </Button>
        <Button variant="secondary" ukuran="sm" onClick={() => setDaftar((lama) => urutkanPesertaByNama(lama))}>
          Urutkan A-Z
        </Button>
        {pertama && (
          <Button
            variant="secondary"
            ukuran="sm"
            onClick={() => setDaftar((lama) => gantiPeserta(lama, pertama.id, { ...pertama, nama: "Nama Diganti" }))}
          >
            Ganti peserta pertama
          </Button>
        )}
      </div>
      <ul>
        {daftar.map((p) => (
          <li key={p.id} style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.25rem" }}>
            <span style={{ minWidth: "12rem" }}>
              {p.nama} ({p.status})
            </span>
            <Button ukuran="sm" onClick={() => setDaftar((lama) => ubahStatusPeserta(lama, p.id, "lulus"))}>
              Luluskan
            </Button>
            <Button variant="danger" ukuran="sm" onClick={() => setDaftar((lama) => hapusPeserta(lama, p.id))}>
              Hapus
            </Button>
          </li>
        ))}
      </ul>
      <p>
        Data asli tidak tersentuh: {pesertaTiruan.length} peserta, yang pertama {pesertaTiruan[0].nama} (
        {pesertaTiruan[0].status}).
      </p>
    </div>
  );
}
