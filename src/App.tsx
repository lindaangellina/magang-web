import { useState } from "react";
import styles from "./App.module.css";
import DaftarJurnal from "./components/jurnal/DaftarJurnal";
import FormJurnal from "./components/jurnal/FormJurnal";
import RingkasanJurnal from "./components/jurnal/RingkasanJurnal";
import Header from "./components/layout/Header";
import { jurnalTiruan } from "./data/jurnal";
import { pesertaTiruan } from "./data/pesertaTiruan";
import LatihanRabu from "./latihan/LatihanRabu";
import LatihanSelasa from "./latihan/LatihanSelasa";
import LatihanSenin from "./latihan/LatihanSenin";
import GaleriKomponen from "./pages/GaleriKomponen";
import type { Jurnal, JurnalBaru, StatusReview } from "./types/jurnal";

// Sementara (sebelum ada router): halaman bantu dibuka lewat
// ?halaman=galeri, ?halaman=latihan, ?halaman=latihan-selasa, atau ?halaman=latihan-rabu
const halaman = new URLSearchParams(window.location.search).get("halaman");

const pesertaId = 1;

export default function App() {
  // Lifting state up: App adalah pemilik tunggal data jurnal (single source of truth).
  // Hook dipanggil di tingkat atas, SEBELUM early return di bawah.
  const [jurnal, setJurnal] = useState<Jurnal[]>(jurnalTiruan);

  // Selalu array BARU (filter/map/spread), tidak pernah memutasi state lama
  function hapusJurnal(id: number) {
    setJurnal((daftar) => daftar.filter((j) => j.id !== id));
  }

  function ubahStatus(id: number, status: StatusReview) {
    setJurnal((daftar) => daftar.map((j) => (j.id === id ? { ...j, statusReview: status } : j)));
  }

  function tambahJurnal(data: JurnalBaru) {
    const createdAt = new Date().toISOString();
    setJurnal((daftar) => {
      const baru: Jurnal = {
        id: Math.max(0, ...daftar.map((j) => j.id)) + 1, // sementara; nanti id dibuat oleh server
        pesertaId,
        ...data,
        lampiran: null,
        statusReview: "belum",
        catatanMentor: null,
        createdAt,
      };
      return [baru, ...daftar];
    });
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

  if (halaman === "latihan-rabu") {
    return (
      <main className={styles.halaman}>
        <LatihanRabu />
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
        <section aria-labelledby="judul-form">
          <h2 id="judul-form" className={styles.judulDaftar}>
            Tambah Jurnal
          </h2>
          <FormJurnal onTambah={tambahJurnal} />
        </section>
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
