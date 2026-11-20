// src/components/jurnal/JurnalSaya.tsx
import { useState } from "react";
import { adalahSesiBerakhir } from "../../api/errors";
import { pesanUntukPengguna, teksKodeLaporan } from "../../api/pesan";
import { useJurnalSaya } from "../../hooks/useJurnalSaya";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import DaftarJurnal from "./DaftarJurnal";
import FormJurnal from "./FormJurnal";
import styles from "../../App.module.css";

interface JurnalSayaProps {
  onSesiBerakhir: () => void; // dipanggil saat pengguna memilih login ulang setelah sesinya tidak berlaku
}

// Pemilik tunggal hook: form dan daftar berbagi muatUlang lewat komponen ini
export default function JurnalSaya({ onSesiBerakhir }: JurnalSayaProps) {
  const [halaman, setHalaman] = useState(1);
  const { hasil, muatUlang } = useJurnalSaya(halaman);

  function setelahTersimpan() {
    setHalaman(1); // jurnal terbaru tampil di halaman pertama
    muatUlang(); // dimuat ulang dari server (bukan ditambahkan manual ke state)
  }

  function renderDaftar() {
    switch (hasil.status) {
      case "memuat":
        return <p role="status">Memuat jurnal...</p>;

      case "gagal": {
        const kodeLaporan = teksKodeLaporan(hasil.error);
        return (
          <Alert tipe="bahaya">
            <p>{pesanUntukPengguna(hasil.error)}</p>
            {kodeLaporan !== null && <p>{kodeLaporan}</p>}
            {adalahSesiBerakhir(hasil.error) ? (
              <Button ukuran="sm" onClick={onSesiBerakhir}>
                Login kembali
              </Button>
            ) : (
              <Button ukuran="sm" onClick={muatUlang}>
                Coba lagi
              </Button>
            )}
          </Alert>
        );
      }

      case "berhasil": {
        const { daftar, meta } = hasil.data;

        // "Kosong" diputuskan di sini: permintaannya berhasil, hanya datanya tidak ada
        if (daftar.length === 0) {
          return <p>Belum ada jurnal. Tulis jurnal pertamamu di formulir di atas!</p>;
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

  return (
    <>
      <section aria-labelledby="judul-form">
        <h2 id="judul-form" className={styles.judulDaftar}>
          Tambah Jurnal
        </h2>
        <FormJurnal onBerhasil={setelahTersimpan} />
      </section>

      <section aria-labelledby="judul-daftar">
        <h2 id="judul-daftar" className={styles.judulDaftar}>
          Jurnal Saya
        </h2>
        {renderDaftar()}
      </section>
    </>
  );
}
