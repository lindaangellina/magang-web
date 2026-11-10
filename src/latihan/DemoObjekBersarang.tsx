import { useState } from "react";
import Button from "../components/ui/Button";

// SOAL 7 — State objek bersarang: ubah hanya kota, bagian lain tetap, tanpa mutasi.
interface Alamat {
  kota: string;
  kodePos: string;
}

interface Profil {
  nama: string;
  alamat: Alamat;
}

const daftarKota = ["Malang", "Surabaya", "Jakarta"];

function kotaBerikut(sekarang: string): string {
  const indeks = daftarKota.indexOf(sekarang);
  return daftarKota[(indeks + 1) % daftarKota.length];
}

export default function DemoObjekBersarang() {
  const [profil, setProfil] = useState<Profil>({
    nama: "Linda Angellina",
    alamat: { kota: "Malang", kodePos: "65141" },
  });

  function gantiKota() {
    // Salin tiap tingkat yang berubah: objek luar DAN objek alamat
    setProfil((lama) => ({
      ...lama,
      alamat: { ...lama.alamat, kota: kotaBerikut(lama.alamat.kota) },
    }));
  }

  return (
    <div style={{ display: "grid", gap: "0.5rem", justifyItems: "start" }}>
      <Button ukuran="sm" onClick={gantiKota}>
        Ganti kota
      </Button>
      <pre>{JSON.stringify(profil, null, 2)}</pre>
    </div>
  );
}
