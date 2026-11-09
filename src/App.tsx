import styles from "./App.module.css";
import DaftarJurnal from "./components/jurnal/DaftarJurnal";
import RingkasanJurnal from "./components/jurnal/RingkasanJurnal";
import Header from "./components/layout/Header";
import { jurnalTiruan } from "./data/jurnal";
import { pesertaTiruan } from "./data/pesertaTiruan";
import GaleriKomponen from "./pages/GaleriKomponen";

// Sementara (sebelum ada router): galeri komponen dibuka lewat http://localhost:5173/?halaman=galeri
const tampilkanGaleri = new URLSearchParams(window.location.search).get("halaman") === "galeri";

const pesertaId = 1;

export default function App() {
  if (tampilkanGaleri) {
    return (
      <main className={styles.halaman}>
        <GaleriKomponen />
      </main>
    );
  }

  const peserta = pesertaTiruan.find((p) => p.id === pesertaId);
  const jurnalPeserta = jurnalTiruan.filter((j) => j.pesertaId === pesertaId);

  return (
    <div className={styles.halaman}>
      <Header judul="Jurnal Magang" namaPeserta={peserta?.nama ?? "Peserta tidak ditemukan"} />
      <main className={styles.utama}>
        <RingkasanJurnal jurnal={jurnalPeserta} />
        <section aria-labelledby="judul-daftar">
          <h2 id="judul-daftar" className={styles.judulDaftar}>
            Daftar Jurnal
          </h2>
          <DaftarJurnal jurnal={jurnalPeserta} />
        </section>
      </main>
    </div>
  );
}
