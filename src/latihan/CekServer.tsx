import { useEffect, useState } from "react";
import { BASE_URL } from "../api/konfigurasi";

// Soal 4: memanggil health check lewat alamat RELATIF (proxy Vite), tanpa CORS_ORIGINS.
export default function CekServer() {
  const [teks, setTeks] = useState("Memeriksa server...");

  useEffect(() => {
    const pengendali = new AbortController(); // dibatalkan saat komponen dilepas (cleanup)

    fetch(`${BASE_URL}/health`, { signal: pengendali.signal })
      .then((res) => res.json())
      .then((data: unknown) => setTeks(JSON.stringify(data))) // sementara: belum bertipe
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return; // dibatalkan: abaikan
        setTeks("Server tidak terjangkau");
      });

    return () => pengendali.abort();
  }, []);

  return <p>{teks}</p>;
}
