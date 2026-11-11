import { useState } from "react";

// SOAL 5 — Jebakan form terkontrol. Buka konsol (F12) untuk membaca peringatan React.
export default function DemoTerkontrol() {
  const [salah2, setSalah2] = useState<string | undefined>(undefined); // BUG: nilai awal undefined
  const [benar2, setBenar2] = useState(""); // benar: selalu mulai dari string kosong

  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <label>
        Salah 1 (value tanpa onChange): <input value="tetap" />
      </label>
      <label>
        Benar 1 (value + readOnly): <input value="tetap" readOnly />
      </label>
      <label>
        Salah 2 (state awal undefined, ketik sesuatu):{" "}
        <input value={salah2} onChange={(e) => setSalah2(e.target.value)} />
      </label>
      <label>
        Benar 2 (state awal ""): <input value={benar2} onChange={(e) => setBenar2(e.target.value)} />
      </label>
    </div>
  );
}
