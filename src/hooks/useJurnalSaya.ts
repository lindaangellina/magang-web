// src/hooks/useJurnalSaya.ts
import { useCallback, useEffect, useState } from "react";
import { ambilJurnalSaya } from "../api/jurnal";
import { keApiError } from "../api/errors";
import type { ApiError } from "../api/errors";
import type { StatusPermintaan } from "./status";

type HasilJurnal = Awaited<ReturnType<typeof ambilJurnalSaya>>;

// Hasil yang SUDAH selesai, ditandai untuk permintaan mana ia dihasilkan
type Selesai =
  | { kunci: string; status: "berhasil"; data: HasilJurnal }
  | { kunci: string; status: "gagal"; error: ApiError };

export function useJurnalSaya(halaman: number) {
  // versi: dinaikkan untuk memuat ulang, sehingga tombol "Coba lagi" bisa memicu efek tanpa mengubah halaman.
  const [versi, setVersi] = useState(0);
  const [selesai, setSelesai] = useState<Selesai | null>(null);

  // kunci: identitas permintaan saat ini, supaya hasil lama tidak pernah dianggap hasil untuk permintaan baru.
  const kunci = `${halaman}:${versi}`;

  useEffect(() => {
    // AbortController: membuat permintaan bisa dibatalkan, supaya jawaban lama yang lambat tidak menimpa data baru.
    const pengendali = new AbortController();

    ambilJurnalSaya({ halaman, signal: pengendali.signal })
      .then((data) => setSelesai({ kunci, status: "berhasil", data }))
      .catch((err: unknown) => {
        // signal.aborted: pembatalan sengaja bukan kegagalan sungguhan, jadi jangan ditampilkan sebagai error.
        if (pengendali.signal.aborted) return;
        setSelesai({ kunci, status: "gagal", error: keApiError(err) });
      });

    // Cleanup: batalkan permintaan lama setiap kali efek berjalan ulang atau komponen dilepas.
     return () => pengendali.abort();
  }, [halaman, kunci]);

  // Status turunan: "memuat" dihitung dari data lain (bukan disimpan), karena jika hasil tersimpan bukan
  // untuk permintaan saat ini berarti permintaan saat ini masih berjalan, dan ini menghindari setState sinkron di efek.
  const hasil: StatusPermintaan<HasilJurnal> =
    selesai !== null && selesai.kunci === kunci ? selesai : { status: "memuat" };

  const muatUlang = useCallback(() => setVersi((v) => v + 1), []);

  return { hasil, muatUlang };
}
