import { useState } from "react";

// SOAL 7 — React meng-escape teks yang ditampilkan lewat {}.
// HTML di bawah adalah string TETAP milik kita sendiri, bukan data pengguna.
const HTML_TETAP = "<b>tebal</b>";

export default function DemoEscape() {
  const [teks, setTeks] = useState("<b>tebal</b> dan <img src=x onerror=alert(1)>");

  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <label>
        Ketik apa saja: <input value={teks} onChange={(e) => setTeks(e.target.value)} size={50} />
      </label>
      <p>
        Lewat {"{}"} (aman, tampil sebagai TEKS): {teks}
      </p>
      <p>
        Lewat dangerouslySetInnerHTML (hanya string tetap kita): <span dangerouslySetInnerHTML={{ __html: HTML_TETAP }} />
      </p>
      {/* JANGAN PERNAH memberi dangerouslySetInnerHTML data dari pengguna atau API tanpa pembersihan. */}
    </div>
  );
}
