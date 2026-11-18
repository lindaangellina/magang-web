import { useState } from "react";
import type { CSSProperties } from "react";
import Button from "../components/ui/Button";
import { login } from "../api/auth";
import { request, setAccessToken } from "../api/client";
import { ApiError, keApiError } from "../api/errors";
import { ambilJurnalSaya } from "../api/jurnal";
import { pesanUntukPengguna, teksKodeLaporan } from "../api/pesan";

// Halaman uji klien API (Rabu Minggu 19). Dibuka lewat ?halaman=latihan-minggu19-rabu
// Semua pemanggilan lewat src/api (tidak ada fetch di sini). Hasil dicetak ke halaman DAN ke Console.

// Soal 6: skenario error untuk menguji pesanUntukPengguna (dibuat langsung, tanpa server)
const skenario: readonly ApiError[] = [
  new ApiError("Tidak dapat terhubung ke server", 0, "NETWORK_ERROR"),
  new ApiError("Token tidak valid", 401, "UNAUTHORIZED", [], "req-contoh-401"),
  new ApiError("Akses ditolak", 403, "FORBIDDEN", [], "req-contoh-403"),
  new ApiError("Jurnal tidak ditemukan", 404, "NOT_FOUND", [], "req-contoh-404"),
  new ApiError("Input tidak valid", 422, "VALIDATION_ERROR", [{ field: "kegiatan", pesan: "Terlalu pendek" }], "req-contoh-422"),
  new ApiError("Kesalahan internal", 500, "INTERNAL_ERROR", [], "req-contoh-500"),
];

const gayaKotak: CSSProperties = { border: "1px solid #cbd5e1", borderRadius: 8, padding: 12, marginBottom: 16 };
const gayaPre: CSSProperties = { background: "#f1f5f9", padding: 12, borderRadius: 6, whiteSpace: "pre-wrap", wordBreak: "break-word" };
const gayaBaris: CSSProperties = { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 };

export default function LatihanMinggu19Rabu() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasil, setHasil] = useState("(belum ada pemanggilan)");

  // Jalankan satu aksi lalu cetak hasilnya: data atau ApiError (status, kode, requestId)
  async function jalankan(label: string, aksi: () => Promise<unknown>) {
    setHasil(`${label}\nMemanggil...`);
    try {
      const data = await aksi();
      console.log(label, "BERHASIL", data);
      setHasil(`${label}\nBERHASIL (data, bukan error)\n${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      const e = keApiError(err);
      console.log(label, "ApiError", { status: e.status, kode: e.kode, requestId: e.requestId, detail: e.detail });
      setHasil(
        [
          label,
          "GAGAL: ApiError",
          `status: ${e.status}`,
          `kode: ${e.kode}`,
          `requestId: ${e.requestId ?? "(tidak ada)"}`,
          `pesan dari server: ${e.message}`,
          `pesan untuk pengguna: ${pesanUntukPengguna(e)}`,
          teksKodeLaporan(e) ?? "(tidak ada kode laporan)",
        ].join("\n")
      );
    }
  }

  return (
    <div>
      <h1>Uji klien API (Rabu Minggu 19)</h1>
      <p>Buka Console (F12) untuk melihat hasil yang sama dalam bentuk objek.</p>

      <section style={gayaKotak}>
        <h2>Soal 4: login dan ambil jurnal</h2>
        <div style={gayaBaris}>
          <input type="email" placeholder="email akunmu" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div style={gayaBaris}>
          <Button onClick={() => void jalankan("1. Login benar", () => login(email, password))}>1. Login benar</Button>
          <Button
            variant="secondary"
            onClick={() => void jalankan("2. Login salah password", () => login(email, "PasswordSalah123"))}
          >
            2. Login password salah
          </Button>
          <Button variant="secondary" onClick={() => void jalankan("3. Ambil jurnal saya", () => ambilJurnalSaya())}>
            3. Ambil jurnal saya
          </Button>
          <Button variant="danger" onClick={() => setAccessToken(null)}>
            Hapus token (anggap belum login)
          </Button>
        </div>
        <p>
          Urutan: (a) Ambil jurnal saya tanpa login, harus ApiError 401. (b) Login benar. (c) Ambil jurnal saya lagi, harus
          berisi data. Login salah dihitung pembatas laju (10 kali gagal per 15 menit): jangan ditekan berulang kali.
        </p>
      </section>

      <section style={gayaKotak}>
        <h2>Soal 5: kasus ekstrem</h2>
        <div style={gayaBaris}>
          <Button variant="secondary" onClick={() => void jalankan("Ambil jurnal saya (backend dimatikan)", () => ambilJurnalSaya())}>
            Ambil jurnal saya (matikan backend dulu)
          </Button>
          <Button
            variant="secondary"
            // "/../docs/" dinormalisasi URL menjadi /api/docs/: halaman Swagger UI (HTML 200), bukan JSON
            onClick={() => void jalankan("Respons HTML (bukan JSON)", () => request<unknown>("GET", "/../docs/"))}
          >
            Respons bukan JSON
          </Button>
        </div>
        <p>Harapan: backend mati menghasilkan NETWORK_ERROR (status 0). Respons HTML menghasilkan BAD_RESPONSE, bukan crash.</p>
      </section>

      <section style={gayaKotak}>
        <h2>Hasil</h2>
        <pre style={gayaPre}>{hasil}</pre>
      </section>

      <section style={gayaKotak}>
        <h2>Soal 6: pesan untuk pengguna (6 skenario)</h2>
        <table>
          <thead>
            <tr>
              <th align="left">Kode</th>
              <th align="left">Pesan untuk pengguna</th>
              <th align="left">Kode laporan</th>
            </tr>
          </thead>
          <tbody>
            {skenario.map((e) => (
              <tr key={e.kode}>
                <td>
                  {e.kode} ({e.status})
                </td>
                <td>{pesanUntukPengguna(e)}</td>
                <td>{teksKodeLaporan(e) ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
