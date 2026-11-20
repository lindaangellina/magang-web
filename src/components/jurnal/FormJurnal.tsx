import { useRef, useState } from "react";
import type { ChangeEventHandler, FormEventHandler } from "react";
import { keApiError } from "../../api/errors";
import { buatJurnal } from "../../api/jurnal";
import { pesanUntukPengguna, teksKodeLaporan } from "../../api/pesan";
import { detailKeErrors } from "../../utils/detailError";
import { validasiFormJurnal } from "../../utils/validasiJurnal";
import type { FormJurnalErrors, FormJurnalState } from "../../utils/validasiJurnal";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import styles from "../ui/Form.module.css";

interface FormJurnalProps {
  onBerhasil: () => void; // peristiwa NAIK: jurnal sudah tersimpan di server, pemilik daftar yang memuat ulang
}

// Satu union untuk seluruh siklus pengiriman (tidak ada boolean loading/error terpisah)
type StatusKirim =
  | { status: "diam" }
  | { status: "mengirim" }
  | { status: "tersimpan" }
  | { status: "gagal"; pesan: string | null; umum: string[]; kodeLaporan: string | null };

// Di luar komponen supaya tidak dibuat ulang di setiap render
const NILAI_AWAL: FormJurnalState = { kegiatan: "", hambatan: "", linkCommit: "" };

export default function FormJurnal({ onBerhasil }: FormJurnalProps) {
  // State biasa: server adalah sumber kebenaran, tidak ada lagi localStorage untuk jurnal
  const [nilai, setNilai] = useState<FormJurnalState>(NILAI_AWAL);
  const [errors, setErrors] = useState<FormJurnalErrors>({});
  const [kirim, setKirim] = useState<StatusKirim>({ status: "diam" });

  // Ref untuk memindahkan fokus ke kolom pertama yang salah (Soal 4)
  const kegiatanRef = useRef<HTMLTextAreaElement>(null);
  const hambatanRef = useRef<HTMLTextAreaElement>(null);
  const linkCommitRef = useRef<HTMLInputElement>(null);

  function fokusKolomPertama(e: FormJurnalErrors) {
    if (e.kegiatan) kegiatanRef.current?.focus();
    else if (e.hambatan) hambatanRef.current?.focus();
    else if (e.linkCommit) linkCommitRef.current?.focus();
  }

  // SATU handler untuk semua kolom: name di elemen = nama properti di state
  const ubah: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const { name, value } = e.target;
    setNilai((sebelumnya) => ({ ...sebelumnya, [name]: value })); // [name]: kunci dinamis
    setErrors((sebelumnya) => ({ ...sebelumnya, [name]: undefined })); // hapus error kolom yang sedang diedit
    setKirim((s) => (s.status === "tersimpan" ? { status: "diam" } : s)); // pesan "tersimpan" hilang saat mulai mengetik lagi
  };

  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault(); // cegah browser memuat ulang halaman
    if (kirim.status === "mengirim") return; // pengaman kedua selain tombol nonaktif (mis. Enter dua kali)

    const hasil = validasiFormJurnal(nilai);
    setErrors(hasil);
    if (Object.keys(hasil).length > 0) {
      fokusKolomPertama(hasil); // ada error di klien: hentikan, fokus ke kolom pertama yang salah
      return;
    }

    setKirim({ status: "mengirim" });
    try {
      await buatJurnal({
        kegiatan: nilai.kegiatan.trim(),
        // Kolom opsional yang kosong DIHILANGKAN (undefined), bukan null: CreateJurnalRequest tidak menerima null
        hambatan: nilai.hambatan.trim() || undefined,
        linkCommit: nilai.linkCommit.trim() || undefined,
      });
      setNilai(NILAI_AWAL); // kosongkan form HANYA setelah server menyatakan sukses
      setErrors({});
      setKirim({ status: "tersimpan" });
      onBerhasil();
    } catch (err) {
      const error = keApiError(err);
      // Hanya 422 yang membawa detail per kolom; error lain cukup satu pesan umum
      const { kolom, umum } = error.kode === "VALIDATION_ERROR" ? detailKeErrors(error.detail) : { kolom: {}, umum: [] };
      const adaKolom = Object.keys(kolom).length > 0;
      setErrors(kolom);
      fokusKolomPertama(kolom);
      setKirim({
        status: "gagal",
        pesan: adaKolom && umum.length === 0 ? null : pesanUntukPengguna(error),
        umum,
        kodeLaporan: teksKodeLaporan(error),
      });
      // Isian pengguna TIDAK dikosongkan saat gagal: mereka tinggal memperbaiki
    }
  };

  const mengirim = kirim.status === "mengirim";

  return (
    <form className={styles.form} onSubmit={(e) => void submit(e)} noValidate>
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

      {kirim.status === "gagal" && (kirim.pesan !== null || kirim.umum.length > 0) && (
        <Alert tipe="bahaya">
          {kirim.pesan !== null && <p>{kirim.pesan}</p>}
          {kirim.umum.length > 0 && (
            <ul>
              {kirim.umum.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          )}
          {kirim.kodeLaporan !== null && <p>{kirim.kodeLaporan}</p>}
        </Alert>
      )}
      {kirim.status === "tersimpan" && <Alert tipe="sukses">Jurnal tersimpan.</Alert>}

      <div className={styles.aksi}>
        <Button type="submit" disabled={mengirim}>
          {mengirim ? "Menyimpan..." : "Simpan jurnal"}
        </Button>
      </div>
    </form>
  );
}
