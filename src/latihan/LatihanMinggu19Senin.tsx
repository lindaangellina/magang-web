import { useState } from "react";
import type { CSSProperties } from "react";
import Button from "../components/ui/Button";
import { BASE_URL } from "../api/konfigurasi";
import CekServer from "./CekServer";

// Eksperimen Senin Minggu 19. Dibuka lewat ?halaman=latihan-minggu19
// Semua pemanggilan lewat BASE_URL (proxy Vite), kecuali Eksperimen 1 yang sengaja langsung ke :3000.

// Tampilkan hasil sebagai teks agar mudah disalin ke README
type Hasil = string;

export default function LatihanMinggu19Senin() {
  const [cors, setCors] = useState<Hasil>("(belum dijalankan)");
  const [preflight, setPreflight] = useState<Hasil>("(belum dijalankan)");
  const [e401, setE401] = useState<Hasil>("(belum dijalankan)");
  const [tanpaHeader, setTanpaHeader] = useState<Hasil>("(belum dijalankan)");
  const [denganHeader, setDenganHeader] = useState<Hasil>("(belum dijalankan)");

  // Eksperimen 1: LANGSUNG ke backend tanpa proxy (alamat lengkap).
  // Gagal dengan error CORS jika http://localhost:5173 tidak ada di CORS_ORIGINS backend.
  async function cobaCors() {
    setCors("Memanggil...");
    try {
      const res = await fetch("http://localhost:3000/api/v1/health");
      setCors(`Berhasil: status ${res.status}`);
    } catch {
      // Detail asli error CORS sengaja disembunyikan browser: lihat Console dan tab Network
      setCors("GAGAL (TypeError). Buka Console dan tab Network untuk detailnya.");
    }
  }

  // Soal 3: permintaan dengan header Authorization memicu preflight OPTIONS.
  // Dikirim langsung ke :3000 (lintas origin) supaya preflight benar-benar terjadi.
  async function cobaPreflight() {
    setPreflight("Memanggil...");
    try {
      const res = await fetch("http://localhost:3000/api/v1/me", {
        headers: { Authorization: "Bearer token-palsu" },
      });
      setPreflight(`Respons nyata diterima: status ${res.status} (preflight lolos)`);
    } catch {
      setPreflight("GAGAL (TypeError). Kemungkinan preflight ditolak: lihat tab Network.");
    }
  }

  // Eksperimen 2: fetch TIDAK menolak status 401. Lewat proxy, tanpa token.
  async function coba401() {
    const baris: string[] = [];
    try {
      const res = await fetch(`${BASE_URL}/me`);
      baris.push(`ok? ${res.ok}, status: ${res.status}`);
      const data: unknown = await res.json();
      baris.push(`then kedua tetap jalan: ${JSON.stringify(data)}`);
    } catch {
      baris.push("catch terpanggil");
    }
    setE401(baris.join("\n"));
  }

  // Soal 7: POST login TANPA Content-Type, lalu DENGAN Content-Type.
  // Catatan: login gagal dihitung rate limiter backend (maks 10 gagal per 15 menit per IP).
  async function loginTanpaHeader() {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email: "peserta@contoh.com", password: "salah" }),
      });
      setTanpaHeader(`status ${res.status}\n${await res.text()}`);
    } catch {
      setTanpaHeader("Gagal terhubung ke server");
    }
  }

  async function loginDenganHeader() {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "peserta@contoh.com", password: "salah" }),
      });
      setDenganHeader(`status ${res.status}\n${await res.text()}`);
    } catch {
      setDenganHeader("Gagal terhubung ke server");
    }
  }

  const gayaHasil: CSSProperties = { whiteSpace: "pre-wrap", wordBreak: "break-word" };

  return (
    <section style={{ display: "grid", gap: "1rem", padding: "1rem" }}>
      <h1>Latihan Minggu 19 Senin</h1>

      <div>
        <h2>Soal 4: health check lewat proxy</h2>
        <CekServer />
      </div>

      <div>
        <h2>Eksperimen 1 / Soal 2: langsung ke :3000 (tanpa proxy)</h2>
        <Button ukuran="sm" onClick={cobaCors}>Panggil http://localhost:3000</Button>
        <pre style={gayaHasil}>{cors}</pre>
      </div>

      <div>
        <h2>Soal 3: preflight (header Authorization)</h2>
        <Button ukuran="sm" onClick={cobaPreflight}>Panggil /me dengan Authorization</Button>
        <pre style={gayaHasil}>{preflight}</pre>
      </div>

      <div>
        <h2>Eksperimen 2 / Soal 6: fetch dan status 401</h2>
        <Button ukuran="sm" onClick={coba401}>Panggil /me tanpa token</Button>
        <pre style={gayaHasil}>{e401}</pre>
      </div>

      <div>
        <h2>Soal 7: lupa Content-Type</h2>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Button ukuran="sm" variant="danger" onClick={loginTanpaHeader}>Tanpa Content-Type</Button>
          <Button ukuran="sm" onClick={loginDenganHeader}>Dengan Content-Type</Button>
        </div>
        <pre style={gayaHasil}>Tanpa header: {tanpaHeader}</pre>
        <pre style={gayaHasil}>Dengan header: {denganHeader}</pre>
      </div>
    </section>
  );
}
