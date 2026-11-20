import { useState } from "react";
import type { CSSProperties } from "react";
import { login } from "../api/auth";
import { setAccessToken } from "../api/client";
import { adalahKode, keApiError } from "../api/errors";
import { buatJurnal } from "../api/jurnal";
import { pesanUntukPengguna } from "../api/pesan";
import type { Peserta } from "../api/types";
import JurnalSaya from "../components/jurnal/JurnalSaya";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";

// Halaman Kamis Minggu 19. Dibuka lewat ?halaman=jurnal-saya
// Login di sini SEMENTARA (form login lengkap dibuat Jumat). Tidak ada email atau password yang ditulis di kode.

const gayaBaris: CSSProperties = { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 12 };

export default function HalamanJurnalSaya() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [peserta, setPeserta] = useState<Peserta | null>(null);
  const [pesanLogin, setPesanLogin] = useState<string | null>(null);
  const [pesanIsi, setPesanIsi] = useState<string | null>(null);
  const [sedangBekerja, setSedangBekerja] = useState(false);
  // Dinaikkan setelah mengisi jurnal contoh: key baru membuat JurnalSaya dipasang ulang dan memuat data segar
  const [versiTampil, setVersiTampil] = useState(0);

  async function masuk() {
    setSedangBekerja(true);
    setPesanLogin(null);
    try {
      setPeserta(await login(email, password));
    } catch (err) {
      const e = keApiError(err);
      // Keputusan dari KODE error. Di layar login, 401 berarti kredensial salah (bukan sesi berakhir)
      setPesanLogin(adalahKode(e, "UNAUTHORIZED") ? "Email atau password salah." : pesanUntukPengguna(e));
    } finally {
      setSedangBekerja(false);
    }
  }

  function keluar() {
    setAccessToken(null);
    setPeserta(null);
    setPesanIsi(null);
  }

  // Alat bantu uji: token dibuang tetapi layar tetap tampil, lalu dipasang ulang sehingga permintaan berjalan tanpa token (401)
  function hapusTokenLaluMuat() {
    setAccessToken(null);
    setVersiTampil((v) => v + 1);
  }

  // Alat bantu uji: membuat 12 jurnal (3 halaman dengan 5 jurnal per halaman) lewat API, satu per satu
  async function isiContoh() {
    setSedangBekerja(true);
    setPesanIsi(null);
    try {
      for (let n = 1; n <= 12; n++) {
        await buatJurnal({ kegiatan: `Jurnal contoh nomor ${n} untuk uji pagination` });
      }
      setPesanIsi("12 jurnal contoh berhasil dibuat.");
      setVersiTampil((v) => v + 1);
    } catch (err) {
      setPesanIsi(pesanUntukPengguna(keApiError(err)));
    } finally {
      setSedangBekerja(false);
    }
  }

  if (peserta === null) {
    return (
      <div>
        <h1>Jurnal saya</h1>
        <p>Login sementara (form lengkap dibuat Jumat). Pakai akun yang sudah terdaftar di backend.</p>
        <div style={gayaBaris}>
          <label>
            Email <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <Button onClick={() => void masuk()} disabled={sedangBekerja}>
            Login sebagai peserta
          </Button>
        </div>
        {pesanLogin !== null && <Alert tipe="bahaya">{pesanLogin}</Alert>}
      </div>
    );
  }

  return (
    <div>
      <h1>Jurnal saya</h1>
      <div style={gayaBaris}>
        <span>Masuk sebagai {peserta.nama}</span>
        <Button variant="secondary" ukuran="sm" onClick={keluar}>
          Keluar
        </Button>
        <Button variant="secondary" ukuran="sm" onClick={() => void isiContoh()} disabled={sedangBekerja}>
          Isi 12 jurnal contoh (alat uji)
        </Button>
        <Button variant="danger" ukuran="sm" onClick={hapusTokenLaluMuat}>
          Hapus token lalu muat ulang (uji 401)
        </Button>
      </div>
      {pesanIsi !== null && <p role="status">{pesanIsi}</p>}
      <JurnalSaya key={versiTampil} />
    </div>
  );
}
