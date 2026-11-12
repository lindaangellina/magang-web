import { useEffect, useState } from "react";
import Button from "../components/ui/Button";

// SOAL 5 — Urutan efek dan cleanup di StrictMode (development). Buka konsol (F12).
function Penanda() {
  useEffect(() => {
    console.log("pasang");
    return () => console.log("lepas");
  }, []);

  return <p>Penanda terpasang (lihat konsol)</p>;
}

export default function DemoEfek() {
  const [tampil, setTampil] = useState(true);

  return (
    <div style={{ display: "grid", gap: "0.5rem", justifyItems: "start" }}>
      <Button ukuran="sm" variant="secondary" onClick={() => setTampil((t) => !t)}>
        {tampil ? "Lepas penanda" : "Pasang penanda"}
      </Button>
      {tampil && <Penanda />}
    </div>
  );
}
