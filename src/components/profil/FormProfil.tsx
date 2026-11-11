import { useRef, useState } from "react";
import type { ChangeEventHandler, FormEventHandler } from "react";
import { validasiFormProfil } from "../../utils/validasiProfil";
import type { FormProfilErrors, FormProfilState, ProfilBaru } from "../../utils/validasiProfil";
import Button from "../ui/Button";
import styles from "../ui/Form.module.css";

interface FormProfilProps {
  onSimpan: (data: ProfilBaru) => void;
}

const NILAI_AWAL: FormProfilState = { nama: "", telepon: "" };

// SOAL 8 — Pola yang sama dengan FormJurnal: state terkontrol, validasi murni, error per kolom.
export default function FormProfil({ onSimpan }: FormProfilProps) {
  const [nilai, setNilai] = useState<FormProfilState>(NILAI_AWAL);
  const [errors, setErrors] = useState<FormProfilErrors>({});
  const namaRef = useRef<HTMLInputElement>(null);
  const teleponRef = useRef<HTMLInputElement>(null);

  const ubah: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setNilai((sebelumnya) => ({ ...sebelumnya, [name]: value }));
    setErrors((sebelumnya) => ({ ...sebelumnya, [name]: undefined }));
  };

  const kirim: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const hasil = validasiFormProfil(nilai);
    setErrors(hasil);
    if (Object.keys(hasil).length > 0) {
      if (hasil.nama) namaRef.current?.focus();
      else if (hasil.telepon) teleponRef.current?.focus();
      return;
    }

    onSimpan({ nama: nilai.nama.trim(), telepon: nilai.telepon.trim() || null });
    setNilai(NILAI_AWAL);
  };

  return (
    <form className={styles.form} onSubmit={kirim} noValidate>
      <div className={styles.kolom}>
        <label className={styles.label} htmlFor="profil-nama">
          Nama
        </label>
        <input
          ref={namaRef}
          id="profil-nama"
          name="nama"
          className={styles.kontrol}
          value={nilai.nama}
          onChange={ubah}
          aria-invalid={errors.nama ? true : undefined}
          aria-describedby={errors.nama ? "profil-nama-error" : undefined}
        />
        {errors.nama && (
          <p id="profil-nama-error" className={styles.error} role="alert">
            {errors.nama}
          </p>
        )}
      </div>

      <div className={styles.kolom}>
        <label className={styles.label} htmlFor="profil-telepon">
          Telepon (opsional)
        </label>
        <input
          ref={teleponRef}
          id="profil-telepon"
          name="telepon"
          className={styles.kontrol}
          inputMode="tel"
          value={nilai.telepon}
          onChange={ubah}
          aria-invalid={errors.telepon ? true : undefined}
          aria-describedby={errors.telepon ? "profil-telepon-error" : undefined}
        />
        {errors.telepon && (
          <p id="profil-telepon-error" className={styles.error} role="alert">
            {errors.telepon}
          </p>
        )}
      </div>

      <div className={styles.aksi}>
        <Button type="submit">Simpan profil</Button>
      </div>
    </form>
  );
}
