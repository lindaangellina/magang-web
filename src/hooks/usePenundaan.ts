import { useEffect, useState } from "react";

// Debounce: hasilnya baru berubah `ms` milidetik setelah nilai BERHENTI berubah.
export function usePenundaan<T>(nilai: T, ms: number): T {
  const [tertunda, setTertunda] = useState(nilai);

  useEffect(() => {
    const pengatur = setTimeout(() => setTertunda(nilai), ms);
    return () => clearTimeout(pengatur); // batalkan jika nilai berubah lagi sebelum ms habis
  }, [nilai, ms]);

  return tertunda;
}
