import type { FormEvent, MouseEvent } from "react";
import JurnalCard from "../components/jurnal/JurnalCard";
import StatusBadge from "../components/jurnal/StatusBadge";
import Alert from "../components/ui/Alert";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Kartu from "../components/ui/Kartu";
import { jurnalTiruan } from "../data/jurnalTiruan";
import styles from "./GaleriKomponen.module.css";

// Soal 6: event bertipe
function cetakKoordinat(e: MouseEvent<HTMLButtonElement>) {
  console.log("Diklik di posisi", e.clientX, e.clientY);
}

// Soal 2c: tombol type="submit" men-submit form, tombol bawaan (type="button") tidak
function kirimForm(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  console.log("form terkirim");
}

// Halaman sementara: acuan visual semua varian komponen UI
export default function GaleriKomponen() {
  return (
    <>
      <Kartu judul="Galeri: Button">
        <div className={styles.baris}>
          <Button variant="primary">Primary md</Button>
          <Button variant="secondary">Secondary md</Button>
          <Button variant="danger">Danger md</Button>
        </div>
        <div className={styles.baris}>
          <Button variant="primary" ukuran="sm">Primary sm</Button>
          <Button variant="secondary" ukuran="sm">Secondary sm</Button>
          <Button variant="danger" ukuran="sm">Danger sm</Button>
        </div>
        <div className={styles.baris}>
          <Button disabled>Primary disabled</Button>
          <Button variant="secondary" disabled>Secondary disabled</Button>
          <Button variant="danger" disabled>Danger disabled</Button>
        </div>
        <p className={styles.catatan}>
          Tombol yang pucat sedang nonaktif (disabled), jadi dilewati saat menekan Tab.
        </p>
        <p className={styles.catatan}>Soal 2b: onClick, disabled, dan type langsung bisa dipakai.</p>
        <form onSubmit={kirimForm} className={styles.baris}>
          <Button>type bawaan (button)</Button>
          <Button type="submit">type="submit"</Button>
        </form>
        <p className={styles.catatan}>
          Soal 2c: klik tombol pertama: konsol diam. Klik tombol kedua: konsol menulis &quot;form terkirim&quot;.
        </p>
      </Kartu>

      <Kartu judul="Galeri: Alert">
        <Alert tipe="info">Ini informasi biasa (role status).</Alert>
        <Alert tipe="sukses">Jurnal berhasil disimpan (role status).</Alert>
        <Alert tipe="bahaya">Gagal menyimpan jurnal (role alert).</Alert>
      </Kartu>

      <Kartu judul="Galeri: Badge dan StatusBadge">
        <div className={styles.baris}>
          <Badge>netral</Badge>
          <Badge variasi="info">info</Badge>
          <Badge variasi="sukses">sukses</Badge>
          <Badge variasi="bahaya">bahaya</Badge>
        </div>
        <div className={styles.baris}>
          <StatusBadge status="belum" />
          <StatusBadge status="disetujui" />
          <StatusBadge status="ditolak" />
        </div>
      </Kartu>

      <Kartu judul="Galeri: Kartu">
        <Kartu judul="Kartu di dalam kartu">
          <p>Kartu menerima judul dan children, jadi isinya bebas.</p>
        </Kartu>
      </Kartu>

      <Kartu judul="Galeri: JurnalCard dan callback">
        <p className={styles.catatan}>Tanpa onHapus: tombol Hapus tidak ada.</p>
        <JurnalCard jurnal={jurnalTiruan[0]} />
        <p className={styles.catatan}>Dengan onHapus: klik Hapus, konsol menulis id jurnalnya.</p>
        <JurnalCard jurnal={jurnalTiruan[1]} onHapus={(id) => console.log("hapus", id)} />
      </Kartu>

      <Kartu judul="Galeri: Event bertipe">
        <Button onClick={cetakKoordinat}>Cetak koordinat klik</Button>
      </Kartu>
    </>
  );
}