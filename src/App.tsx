import "./App.css";
import Kartu from "./components/Kartu";
import NomorUrut from "./components/NomorUrut";
import PesertaCard from "./components/PesertaCard";
import PesertaRingkas from "./components/PesertaRingkas";
import PesertaTanpaEmail from "./components/PesertaTanpaEmail";
import { pesertaTiruan } from "./data/pesertaTiruan";

export default function App() {
  const pertama = pesertaTiruan[0];
  const kedua = pesertaTiruan[1];

  return (
    <main>
      <h1>Jurnal Magang</h1>

      <Kartu judul="Semua Peserta">
        <div className="daftar">
          {/* key membantu React mengenali tiap item; dibahas lebih dalam hari Rabu */}
          {pesertaTiruan.map((p) => (
            <PesertaCard key={p.id} peserta={p} />
          ))}
        </div>
      </Kartu>

      {/* Satu komponen Kartu, tiga isi berbeda: profil, daftar tautan, teks biasa */}
      <Kartu judul="Profil Peserta (dengan email)">
        <PesertaCard peserta={pertama} tampilkanEmail />
      </Kartu>

      <Kartu judul="Tautan Belajar">
        <ul>
          <li>
            <a href="https://react.dev/learn" target="_blank" rel="noreferrer">
              React (resmi)
            </a>
          </li>
          <li>
            <a href="https://vite.dev/guide/" target="_blank" rel="noreferrer">
              Vite
            </a>
          </li>
          <li>
            <a href="https://react-typescript-cheatsheet.netlify.app/" target="_blank" rel="noreferrer">
              React TypeScript Cheatsheet
            </a>
          </li>
        </ul>
      </Kartu>

      <Kartu judul="Catatan">
        <p>Data mengalir satu arah: dari komponen induk ke komponen anak lewat props.</p>
      </Kartu>

      <Kartu judul="Versi Ringkas (Pick dan Omit)">
        <PesertaRingkas nama={pertama.nama} sekolah={pertama.sekolah} fase={pertama.fase} />
        <PesertaTanpaEmail
          id={kedua.id}
          nama={kedua.nama}
          sekolah={kedua.sekolah}
          fase={kedua.fase}
          status={kedua.status}
          role={kedua.role}
        />
      </Kartu>

      <Kartu judul="Nomor Urut (komponen murni)">
        <NomorUrut nomor={1} />
        <NomorUrut nomor={2} />
        <NomorUrut nomor={3} />
      </Kartu>
    </main>
  );
}