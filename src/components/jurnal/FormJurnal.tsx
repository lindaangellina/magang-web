import { useRef, useState } from "react";
import type { ChangeEventHandler, FormEventHandler } from "react";
import type { JurnalBaru } from "../../types/jurnal";
import { validasiFormJurnal } from "../../utils/validasiJurnal";
import type { FormJurnalErrors, FormJurnalState } from "../../utils/validasiJurnal";
import Button from "../ui/Button";
import styles from "../ui/Form.module.css";

interface FormJurnalProps {
  onTambah: (data: JurnalBaru) => void; // peristiwa NAIK: form hanya memberi kabar, App yang mengubah state
}

// Di luar komponen supaya tidak dibuat ulang di setiap render
const NILAI_AWAL: FormJurnalState = { kegiatan: "", hambatan: "", linkCommit: "" };

export default function FormJurnal({ onTambah }: FormJurnalProps) {
  const [nilai, setNilai] = useState<FormJurnalState>(NILAI_AWAL);
  const [errors, setErrors] = useState<FormJurnalErrors>({});

  // Ref untuk memindahkan fokus ke kolom pertama yang salah (Soal 4)
  const kegiatanRef = useRef<HTMLTextAreaElement>(null);
  const hambatanRef = useRef<HTMLTextAreaElement>(null);
  const linkCommitRef = useRef<HTMLInputElement>(null);

  // SATU handler untuk semua kolom: name di elemen = nama properti di state
  const ubah: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const { name, value } = e.target;
    setNilai((sebelumnya) => ({ ...sebelumnya, [name]: value })); // [name]: kunci dinamis
    setErrors((sebelumnya) => ({ ...sebelumnya, [name]: undefined })); // hapus error kolom yang sedang diedit
  };

  const kirim: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault(); // cegah browser memuat ulang halaman

    const hasil = validasiFormJurnal(nilai);
    setErrors(hasil);
    if (Object.keys(hasil).length > 0) {
      // Ada error: hentikan, dan fokus ke kolom pertama yang salah
      if (hasil.kegiatan) kegiatanRef.current?.focus();
      else if (hasil.hambatan) hambatanRef.current?.focus();
      else if (hasil.linkCommit) linkCommitRef.current?.focus();
      return;
    }

    onTambah({
      kegiatan: nilai.kegiatan.trim(),
      hambatan: nilai.hambatan.trim() || null, // kolom opsional kosong menjadi null (seperti API)
      linkCommit: nilai.linkCommit.trim() || null,
    });
    setNilai(NILAI_AWAL); // kosongkan form
  };

  return (
    <form className={styles.form} onSubmit={kirim} noValidate>
      <div className={styles.kolom}>
        <label className={styles.label} htmlFor="kegiatan">
          Kegiatan hari ini
        </label>
        <textarea
          ref={kegiatanRef}
          id="kegiatan"
          name="kegiatan"
          className={styles.kontrol}
          rows={3}
          value={nilai.kegiatan}
          onChange={ubah}
          aria-invalid={errors.kegiatan ? true : undefined}
          aria-describedby={errors.kegiatan ? "kegiatan-error" : undefined}
        />
        {errors.kegiatan && (
          <p id="kegiatan-error" className={styles.error} role="alert">
            {errors.kegiatan}
          </p>
        )}
      </div>

      <div className={styles.kolom}>
        <label className={styles.label} htmlFor="hambatan">
          Hambatan (opsional)
        </label>
        <textarea
          ref={hambatanRef}
          id="hambatan"
          name="hambatan"
          className={styles.kontrol}
          rows={2}
          value={nilai.hambatan}
          onChange={ubah}
          aria-invalid={errors.hambatan ? true : undefined}
          aria-describedby={errors.hambatan ? "hambatan-error" : undefined}
        />
        {errors.hambatan && (
          <p id="hambatan-error" className={styles.error} role="alert">
            {errors.hambatan}
          </p>
        )}
      </div>

      <div className={styles.kolom}>
        <label className={styles.label} htmlFor="linkCommit">
          Link commit (opsional)
        </label>
        <input
          ref={linkCommitRef}
          id="linkCommit"
          name="linkCommit"
          className={styles.kontrol}
          value={nilai.linkCommit}
          onChange={ubah}
          aria-invalid={errors.linkCommit ? true : undefined}
          aria-describedby={errors.linkCommit ? "linkCommit-error" : undefined}
        />
        {errors.linkCommit && (
          <p id="linkCommit-error" className={styles.error} role="alert">
            {errors.linkCommit}
          </p>
        )}
      </div>

      <div className={styles.aksi}>
        <Button type="submit">Simpan jurnal</Button>
      </div>
    </form>
  );
}
