import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

// Custom hook generik: dipakai seperti useState, tetapi nilainya disimpan di localStorage.
export function useLocalStorage<T>(
  kunci: string,
  nilaiAwal: T,
  valid: (data: unknown) => data is T, // type guard: pemeriksa bentuk data
): [T, Dispatch<SetStateAction<T>>] {
  const [nilai, setNilai] = useState<T>(() => {
    // inisialisasi malas: fungsi ini hanya dijalankan SEKALI (render pertama)
    try {
      const tersimpan = localStorage.getItem(kunci);
      if (tersimpan === null) return nilaiAwal;

      const data: unknown = JSON.parse(tersimpan);
      return valid(data) ? data : nilaiAwal; // bentuk salah: pakai nilai awal
    } catch {
      return nilaiAwal; // JSON rusak atau akses ditolak
    }
  });

  // Efek: menyinkronkan state dengan sistem di luar React (penyimpanan browser)
  useEffect(() => {
    try {
      localStorage.setItem(kunci, JSON.stringify(nilai));
    } catch {
      // penyimpanan penuh atau diblokir: abaikan
    }
  }, [kunci, nilai]);

  return [nilai, setNilai]; // tuple bertipe tepat, seperti useState
}
