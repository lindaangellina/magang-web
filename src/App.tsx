import { useState } from "react";
import styles from "./App.module.css";
import { setAccessToken } from "./api/client";
import type { Peserta } from "./api/types";
import FormLogin from "./components/auth/FormLogin";
import JurnalSaya from "./components/jurnal/JurnalSaya";
import Header from "./components/layout/Header";
import Button from "./components/ui/Button";

// Satu-satunya state di tingkat aplikasi: siapa yang sedang login (null = belum login).
// Semua data jurnal berasal dari server dan dimiliki hook useJurnalSaya, bukan App.
export default function App() {
  const [peserta, setPeserta] = useState<Peserta | null>(null);

  function keluar() {
    setAccessToken(null); // buang token dari memori
    setPeserta(null); // JurnalSaya dilepas, jadi hook dan permintaannya ikut dibersihkan
  }

  if (peserta === null) {
    return (
      <div className={styles.halaman}>
        <Header judul="Jurnal Magang" namaPeserta="Silakan login" />
        <main className={styles.utama}>
          <section aria-labelledby="judul-login">
            <h2 id="judul-login" className={styles.judulDaftar}>
              Login
            </h2>
            <FormLogin onBerhasil={setPeserta} />
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.halaman}>
      <Header judul="Jurnal Magang" namaPeserta={peserta.nama} />
      <main className={styles.utama}>
        <div>
          <Button variant="secondary" ukuran="sm" onClick={keluar}>
            Keluar
          </Button>
        </div>
        <JurnalSaya onSesiBerakhir={keluar} />
      </main>
    </div>
  );
}
