import { useState } from "react";
import { usePenundaan } from "../hooks/usePenundaan";

// SOAL 8 — Kata kunci asli dan kata kunci tertunda berdampingan.
export default function DemoPenundaan() {
  const [kata, setKata] = useState("");
  const tunda = usePenundaan(kata, 300);

  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <label>
        Ketik cepat: <input value={kata} onChange={(e) => setKata(e.target.value)} />
      </label>
      <p>Asli: &quot;{kata}&quot;</p>
      <p>Tertunda 300 ms: &quot;{tunda}&quot;</p>
    </div>
  );
}
