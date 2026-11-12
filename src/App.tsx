import { useEffect, useState } from "react";
import styles from "./App.module.css";
import DaftarJurnal from "./components/jurnal/DaftarJurnal";
import FilterStatusJurnal from "./components/jurnal/FilterStatusJurnal";
import FormJurnal from "./components/jurnal/FormJurnal";
import PencarianJurnal from "./components/jurnal/PencarianJurnal";
import RingkasanJurnal from "./components/jurnal/RingkasanJurnal";
import Header from "./components/layout/Header";
import { jurnalTiruan } from "./data/jurnal";
import { pesertaTiruan } from "./data/pesertaTiruan";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { usePenundaan } from "./hooks/usePenundaan";
import LatihanKamis from "./latihan/LatihanKamis";
import LatihanRabu from "./latihan/LatihanRabu";
import LatihanSelasa from "./latihan/LatihanSelasa";
import LatihanSenin from "./latihan/LatihanSenin";
import GaleriKomponen from "./pages/GaleriKomponen";
import type { FilterStatus, Jurnal, JurnalBaru, StatusReview } from "./types/jurnal";
import { adalahDaftarJurnal } from "./utils/guard";

// Sementara (sebelum ada router): halaman bantu dibuka lewat
// ?halaman=galeri, latihan, latihan-selasa, latihan-rabu, atau latihan-kamis
const halaman = new URLSearchParams(window.location.search).get("halaman");

const pesertaId = 1;

export default function App() {
  // Lifting state up: App adalah pemilik tunggal data jurnal (single source of truth).
  // Disimpan di localStorage; data yang bentuknya salah ditolak oleh type guard.
  // Semua hook dipanggil di tingkat atas, SEBELUM early return di bawah.
  const [jurnal, setJurnal] = useLocalStorage<Jurnal[]>("jurnal-magang-v1", jurnalTiruan, adalahDaftarJurnal);
  const [filter, setFilter] = useState<FilterStatus>("semua");
  const [kataKunci, setKataKunci] = useState("");
  const kataKunciTunda = usePenundaan(kataKunci, 300); // hasil pencarian menunggu pengguna berhenti mengetik

  // Efek: menyinkronkan judul tab browser (di luar React) dengan jumlah jurnal
  useEffect(() => {
    document.title = `Jurnal Magang (${jurnal.length})`;
  }, [jurnal.length]);

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

  if (halaman === "latihan-kamis") {
    return (
      <main className={styles.halaman}>
        <LatihanKamis />
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

  // DATA TURUNAN: dihitung setiap render dari state, TIDAK disimpan sebagai state.
  // (Urutan terbaru dulu dilakukan di DaftarJurnal pada salinan array.)
  const jurnalPeserta = jurnal.filter((j) => j.pesertaId === pesertaId);
  const kata = kataKunciTunda.trim().toLowerCase();
  const tampil = jurnalPeserta
    .filter((j) => filter === "semua" || j.statusReview === filter)
    .filter((j) => j.kegiatan.toLowerCase().includes(kata));
  const pesanKosong =
    jurnalPeserta.length > 0 ? "Tidak ada jurnal yang cocok dengan filter atau pencarian." : "Belum ada jurnal.";

  return (
    <div className={styles.halaman}>
      <Header judul="Jurnal Magang" namaPeserta={peserta?.nama ?? "Peserta tidak ditemukan"} />
      <main className={styles.utama}>
        <RingkasanJurnal jurnal={jurnalPeserta} /> {/* ringkasan dari SEMUA jurnal, bukan yang terfilter */}
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
          <div className={styles.kontrol}>
            <PencarianJurnal nilai={kataKunci} onUbah={setKataKunci} />
            <FilterStatusJurnal nilai={filter} onUbah={setFilter} />
          </div>
          <p className={styles.info} aria-live="polite">
            Menampilkan {tampil.length} dari {jurnalPeserta.length} jurnal
          </p>
          <DaftarJurnal
            jurnal={tampil}
            pesanKosong={pesanKosong}
            onHapus={hapusJurnal}
            onUbahStatus={ubahStatus}
          />
        </section>
      </main>
    </div>
  );
}
