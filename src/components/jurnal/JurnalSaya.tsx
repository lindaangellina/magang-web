// src/components/jurnal/JurnalSaya.tsx
import { useState } from "react";
import { useJurnalSaya } from "../../hooks/useJurnalSaya";
import { pesanUntukPengguna, teksKodeLaporan } from "../../api/pesan";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import DaftarJurnal from "./DaftarJurnal";

export default function JurnalSaya() {
  const [halaman, setHalaman] = useState(1);
  const { hasil, muatUlang } = useJurnalSaya(halaman);

  switch (hasil.status) {
    case "memuat":
      return <p role="status">Memuat jurnal...</p>;

    case "gagal": {
      const kodeLaporan = teksKodeLaporan(hasil.error);
      return (
        <Alert tipe="bahaya">
          <p>{pesanUntukPengguna(hasil.error)}</p>
          {kodeLaporan !== null && <p>{kodeLaporan}</p>}
          <Button ukuran="sm" onClick={muatUlang}>
            Coba lagi
          </Button>
        </Alert>
      );
    }

    case "berhasil": {
      const { daftar, meta } = hasil.data;

      // "Kosong" diputuskan di sini: permintaannya berhasil, hanya datanya tidak ada
      if (daftar.length === 0) {
        return <p>Belum ada jurnal. Tulis jurnal pertamamu!</p>;
      }

      return (
        <>
          <DaftarJurnal jurnal={daftar} />
          <nav aria-label="Halaman">
            <Button ukuran="sm" variant="secondary" disabled={!meta.hasPrev} onClick={() => setHalaman((h) => h - 1)}>
              Sebelumnya
            </Button>
            <span>
              {" "}
              Halaman {meta.page} dari {meta.totalPages}{" "}
            </span>
            <Button ukuran="sm" variant="secondary" disabled={!meta.hasNext} onClick={() => setHalaman((h) => h + 1)}>
              Berikutnya
            </Button>
          </nav>
        </>
      );
    }
  }
}
