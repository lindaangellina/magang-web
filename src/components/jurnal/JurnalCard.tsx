import { useId, useState } from "react";
import type { Jurnal, ReviewJurnal } from "../../types/jurnal";
import { cx } from "../../utils/cx";
import { formatTanggal } from "../../utils/format";
import Button from "../ui/Button";
import DetailLampiran from "./DetailLampiran";
import PanelReview from "./PanelReview";
import StatusBadge from "./StatusBadge";
import styles from "./JurnalCard.module.css";

interface JurnalCardProps {
  jurnal: Jurnal;
  variasi?: "normal" | "padat"; // padat: hanya tanggal, status, dan kegiatan
  onHapus?: (id: number) => void; // opsional: tombol hanya muncul jika fungsinya diberikan
  onReview?: (id: number, review: ReviewJurnal) => void; // hanya diberikan saat mode mentor
}

export default function JurnalCard({ jurnal, variasi = "normal", onHapus, onReview }: JurnalCardProps) {
  // State LOKAL: hanya relevan untuk kartu ini, jadi tidak perlu diangkat ke App
  const [terbuka, setTerbuka] = useState(false); // detail (hambatan, lampiran)
  const [konfirmasiHapus, setKonfirmasiHapus] = useState(false); // konfirmasi hapus dua langkah
  const [panelReviewTerbuka, setPanelReviewTerbuka] = useState(false);
  const idDetail = useId();
  const idPanel = useId();

  const padat = variasi === "padat";
  // Field dari API bisa undefined atau null; jadikan array kosong supaya aman dipakai
  const lampiran = jurnal.lampiran ?? [];
  // Data turunan (bukan state): tombol detail hanya perlu ada kalau ada yang bisa ditampilkan
  const adaDetail = Boolean(jurnal.hambatan) || lampiran.length > 0;

  function simpanReview(review: ReviewJurnal) {
    onReview?.(jurnal.id, review);
    setPanelReviewTerbuka(false);
  }

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
          {/* Hasil review selalu terlihat. null, undefined, dan string kosong tidak menampilkan apa-apa */}
          {jurnal.catatanMentor && (
            <p className={styles.catatan}>
              <span className={styles.label}>Catatan mentor:</span> {jurnal.catatanMentor}
            </p>
          )}

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
              {jurnal.hambatan && (
                <p className={styles.baris}>
                  <span className={styles.label}>Hambatan:</span> {jurnal.hambatan}
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

          {(onHapus || onReview) && (
            <div className={styles.aksi}>
              {onReview && (
                <Button
                  variant="secondary"
                  ukuran="sm"
                  aria-expanded={panelReviewTerbuka}
                  aria-controls={idPanel}
                  aria-label={`${panelReviewTerbuka ? "Tutup review" : "Review"}: ${jurnal.kegiatan}`}
                  onClick={() => setPanelReviewTerbuka((p) => !p)}
                >
                  {panelReviewTerbuka ? "Tutup review" : "Review"}
                </Button>
              )}
              {onHapus &&
                (konfirmasiHapus ? (
                  <div className={styles.konfirmasi} role="group" aria-label={`Konfirmasi hapus: ${jurnal.kegiatan}`}>
                    <span>Yakin?</span>
                    {/* Dibungkus fungsi: dijalankan saat diklik, bukan saat render */}
                    <Button variant="danger" ukuran="sm" onClick={() => onHapus(jurnal.id)}>
                      Ya
                    </Button>
                    {/* Fokus awal di Batal: pilihan yang aman jika pengguna menekan Enter terburu-buru */}
                    <Button variant="secondary" ukuran="sm" autoFocus onClick={() => setKonfirmasiHapus(false)}>
                      Batal
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="danger"
                    ukuran="sm"
                    aria-label={`Hapus: ${jurnal.kegiatan}`}
                    onClick={() => setKonfirmasiHapus(true)}
                  >
                    Hapus
                  </Button>
                ))}
            </div>
          )}

          {onReview && panelReviewTerbuka && (
            <PanelReview id={idPanel} jurnal={jurnal} onSimpan={simpanReview} onBatal={() => setPanelReviewTerbuka(false)} />
          )}
        </>
      )}
    </article>
  );
}
