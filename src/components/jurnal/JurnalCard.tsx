import { useId, useState } from "react";
import type { Jurnal, StatusReview } from "../../types/jurnal";
import { cx } from "../../utils/cx";
import { formatTanggal } from "../../utils/format";
import Button from "../ui/Button";
import DetailLampiran from "./DetailLampiran";
import StatusBadge from "./StatusBadge";
import styles from "./JurnalCard.module.css";

interface JurnalCardProps {
  jurnal: Jurnal;
  variasi?: "normal" | "padat"; // padat: hanya tanggal, status, dan kegiatan
  onHapus?: (id: number) => void; // opsional: tombol hanya muncul jika fungsinya diberikan
  onUbahStatus?: (id: number, status: StatusReview) => void; // opsional: sama, kartu hanya "memberi kabar" ke induk
}

export default function JurnalCard({ jurnal, variasi = "normal", onHapus, onUbahStatus }: JurnalCardProps) {
  // State milik kartu ini saja: setiap JurnalCard punya "terbuka" sendiri
  const [terbuka, setTerbuka] = useState(false);
  const idDetail = useId();

  const padat = variasi === "padat";
  // Field dari API bisa undefined atau null; jadikan array kosong supaya aman dipakai
  const lampiran = jurnal.lampiran ?? [];
  // Data turunan (bukan state): tombol detail hanya perlu ada kalau ada yang bisa ditampilkan
  const adaDetail = Boolean(jurnal.hambatan) || Boolean(jurnal.catatanMentor) || lampiran.length > 0;
  // Data turunan lagi: status tujuan dan teks tombol dihitung dari props, tidak disimpan sebagai state
  const statusBerikut: StatusReview = jurnal.statusReview === "sudah" ? "belum" : "sudah";
  const labelStatus = statusBerikut === "sudah" ? "Tandai sudah direview" : "Kembalikan ke belum";

  return (
    <article className={cx(styles.card, padat && styles.padat)}>
      <div className={styles.atas}>
        <time className={styles.tanggal} dateTime={jurnal.createdAt}>
          {formatTanggal(jurnal.createdAt)}
        </time>
        <StatusBadge status={jurnal.statusReview} />
      </div>
      <h3 className={styles.kegiatan}>{jurnal.kegiatan}</h3>

      {!padat && (
        <>
          {adaDetail && (
            <Button
              variant="secondary"
              ukuran="sm"
              aria-expanded={terbuka}
              aria-controls={idDetail}
              onClick={() => setTerbuka((t) => !t)}
            >
              {terbuka ? "Sembunyikan detail" : "Tampilkan detail"}
            </Button>
          )}

          {adaDetail && terbuka && (
            <div id={idDetail} className={styles.detail}>
              {/* null, undefined, dan string kosong tidak menampilkan apa-apa */}
              {jurnal.hambatan && (
                <p className={styles.baris}>
                  <span className={styles.label}>Hambatan:</span> {jurnal.hambatan}
                </p>
              )}
              {jurnal.catatanMentor && (
                <p className={styles.baris}>
                  <span className={styles.label}>Catatan mentor:</span> {jurnal.catatanMentor}
                </p>
              )}
              {lampiran.length > 0 && (
                <details className={styles.lampiran}>
                  <summary>Lampiran ({lampiran.length})</summary>
                  <DetailLampiran lampiran={lampiran} />
                </details>
              )}
            </div>
          )}

          {jurnal.linkCommit && (
            <div className={styles.bawah}>
              <a href={jurnal.linkCommit} target="_blank" rel="noreferrer">
                Lihat commit (tab baru)
              </a>
            </div>
          )}
          {(onHapus || onUbahStatus) && (
            <div className={styles.aksi}>
              {/* Dibungkus fungsi: dijalankan saat diklik, bukan saat render */}
              {onUbahStatus && (
                <Button
                  variant="secondary"
                  ukuran="sm"
                  aria-label={`${labelStatus}: ${jurnal.kegiatan}`}
                  onClick={() => onUbahStatus(jurnal.id, statusBerikut)}
                >
                  {labelStatus}
                </Button>
              )}
              {onHapus && (
                <Button
                  variant="danger"
                  ukuran="sm"
                  aria-label={`Hapus: ${jurnal.kegiatan}`}
                  onClick={() => onHapus(jurnal.id)}
                >
                  Hapus
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </article>
  );
}
