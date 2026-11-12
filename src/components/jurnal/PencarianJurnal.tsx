import { useEffect, useRef } from "react";
import styles from "../ui/Form.module.css";

interface PencarianJurnalProps {
  nilai: string;
  onUbah: (nilai: string) => void;
}

export default function PencarianJurnal({ nilai, onUbah }: PencarianJurnalProps) {
  const inputRef = useRef<HTMLInputElement>(null); // useRef: pegangan ke elemen DOM

  // Efek: memasang pendengar di window (sistem di luar React), lengkap dengan cleanup
  useEffect(() => {
    function tekanTombol(e: KeyboardEvent) {
      // jangan merebut tombol "/" saat pengguna sedang mengetik di kolom lain
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", tekanTombol);
    return () => window.removeEventListener("keydown", tekanTombol); // CLEANUP: bersihkan saat dilepas
  }, []);

  return (
    <div className={styles.kolom}>
      <label className={styles.label} htmlFor="cari-jurnal">
        Cari kegiatan
      </label>
      <input
        ref={inputRef}
        id="cari-jurnal"
        type="search"
        className={styles.kontrol}
        value={nilai}
        onChange={(e) => onUbah(e.target.value)}
        placeholder='Tekan "/" untuk mencari'
      />
    </div>
  );
}