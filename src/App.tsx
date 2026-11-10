import { useState } from "react";
import styles from "./App.module.css";
import DaftarJurnal from "./components/jurnal/DaftarJurnal";
import RingkasanJurnal from "./components/jurnal/RingkasanJurnal";
import Header from "./components/layout/Header";
import { jurnalTiruan } from "./data/jurnal";
import { pesertaTiruan } from "./data/pesertaTiruan";
import LatihanSelasa from "./latihan/LatihanSelasa";
import LatihanSenin from "./latihan/LatihanSenin";
import GaleriKomponen from "./pages/GaleriKomponen";
import type { Jurnal, StatusReview } from "./types/jurnal";

// Sementara (sebelum ada router): halaman bantu dibuka lewat
// ?halaman=galeri, ?halaman=latihan, atau ?halaman=latihan-selasa
const halaman = new URLSearchParams(window.location.search).get("halaman");

const pesertaId = 1;

export default function App() {
  // Lifting state up: App adalah pemilik tunggal data jurnal (single source of truth).
  // Hook dipanggil di tingkat atas, SEBELUM early return di bawah.
  const [jurnal, setJurnal] = useState<Jurnal[]>(jurnalTiruan);

  // Selalu array BARU (filter/map + spread), tidak pernah memutasi state lama
  function hapusJurnal(id: number) {
    setJurnal((daftar) => daftar.filter((j) => j.id !== id));
  }

  function ubahStatus(id: number, status: StatusReview) {
    setJurnal((daftar) => daftar.map((j) => (j.id === id ? { ...j, statusReview: status } : j)));
  }

  if (halaman === "latihan") {
    return (
      <main className={styles.halaman}>
        <LatihanSenin />
      </main>
    );
  }

  if (halaman === "latihan-selasa") {
    return (
      <main className={styles.halaman}>
        <LatihanSelasa />
      </main>
    );
  }

  if (halaman === "galeri") {
    return (
      <main className={styles.halaman}>
        <GaleriKomponen />
      </main>
    );
  }

  const peserta = pesertaTiruan.find((p) => p.id === pesertaId);
  // Data turunan: dihitung saat render dari state, bukan disimpan sebagai state kedua
  const jurnalPeserta = jurnal.filter((j) => j.pesertaId === pesertaId);

  return (
    <div className={styles.halaman}>
      <Header judul="Jurnal Magang" namaPeserta={peserta?.nama ?? "Peserta tidak ditemukan"} />
      <main className={styles.utama}>
        <RingkasanJurnal jurnal={jurnalPeserta} />
        <section aria-labelledby="judul-daftar">
          <h2 id="judul-daftar" className={styles.judulDaftar}>
            Daftar Jurnal
          </h2>
          <DaftarJurnal jurnal={jurnalPeserta} onHapus={hapusJurnal} onUbahStatus={ubahStatus} />
        </section>
      </main>
    </div>
  );
}
