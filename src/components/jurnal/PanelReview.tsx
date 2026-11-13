import { useRef, useState } from "react";
import type { ChangeEventHandler, FormEventHandler } from "react";
import type { Jurnal, ReviewJurnal, StatusReview } from "../../types/jurnal";
import { validasiReview } from "../../utils/validasiJurnal";
import Button from "../ui/Button";
import formStyles from "../ui/Form.module.css";
import styles from "./PanelReview.module.css";

interface PanelReviewProps {
  id: string; // id elemen, supaya tombol "Review" bisa mengaitkannya lewat aria-controls
  jurnal: Jurnal;
  onSimpan: (review: ReviewJurnal) => void; // peristiwa NAIK: panel hanya memberi kabar
  onBatal: () => void;
}

export default function PanelReview({ id, jurnal, onSimpan, onBatal }: PanelReviewProps) {
  // Hanya nilai AWAL dari catatan yang ada. Panel dibuat baru setiap dibuka, jadi tidak perlu disinkronkan lagi.
  const [catatan, setCatatan] = useState(jurnal.catatanMentor ?? "");
  const [error, setError] = useState<string | undefined>(undefined);
  const catatanRef = useRef<HTMLTextAreaElement>(null);

  const idCatatan = `${id}-catatan`;
  const idPetunjuk = `${id}-petunjuk`;
  const idError = `${id}-error`;

  const ubah: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setCatatan(e.target.value);
    setError(undefined); // hapus error saat kolom mulai diedit
  };

  function simpan(status: StatusReview) {
    const pesan = validasiReview(status, catatan); // aturan yang sama dengan API
    if (pesan) {
      setError(pesan);
      catatanRef.current?.focus();
      return;
    }
    onSimpan({ status, catatanMentor: catatan.trim() || null }); // catatan kosong menjadi null
  }

  const kirim: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    simpan("sudah"); // tombol submit = tandai sudah direview
  };

  return (
    <form id={id} className={styles.panel} onSubmit={kirim} noValidate aria-label="Review jurnal">
      <div className={formStyles.kolom}>
        <label className={formStyles.label} htmlFor={idCatatan}>
          Catatan mentor
        </label>
        <textarea
          ref={catatanRef}
          id={idCatatan}
          className={formStyles.kontrol}
          rows={3}
          value={catatan}
          onChange={ubah}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${idPetunjuk} ${idError}` : idPetunjuk}
        />
        <p id={idPetunjuk} className={styles.petunjuk}>
          Wajib minimal 5 karakter untuk menandai sudah direview. Opsional jika dikembalikan ke belum.
        </p>
        {error && (
          <p id={idError} className={formStyles.error} role="alert">
            {error}
          </p>
        )}
      </div>
      <div className={formStyles.aksi}>
        <Button type="submit" ukuran="sm">
          Tandai sudah direview
        </Button>
        <Button variant="secondary" ukuran="sm" onClick={() => simpan("belum")}>
          Kembalikan ke belum
        </Button>
        <Button variant="secondary" ukuran="sm" onClick={onBatal}>
          Batal
        </Button>
      </div>
    </form>
  );
}
