import { useRef, useState } from "react";
import type { ChangeEventHandler, FormEventHandler } from "react";
import { login } from "../../api/auth";
import { keApiError } from "../../api/errors";
import { pesanUntukLogin, teksKodeLaporan } from "../../api/pesan";
import type { Peserta } from "../../api/types";
import { detailKeErrorsLogin } from "../../utils/detailError";
import { validasiFormLogin } from "../../utils/validasiLogin";
import type { FormLoginErrors, FormLoginState } from "../../utils/validasiLogin";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import styles from "../ui/Form.module.css";

interface FormLoginProps {
  onBerhasil: (peserta: Peserta) => void;
}

// Satu union menggantikan boolean "sedangMengirim" + "pesanError" yang bisa saling bertentangan
type StatusKirim =
  | { status: "diam" }
  | { status: "mengirim" }
  | { status: "gagal"; pesan: string | null; kodeLaporan: string | null };

const NILAI_AWAL: FormLoginState = { email: "", password: "" };

export default function FormLogin({ onBerhasil }: FormLoginProps) {
  const [nilai, setNilai] = useState<FormLoginState>(NILAI_AWAL);
  const [errors, setErrors] = useState<FormLoginErrors>({});
  const [kirim, setKirim] = useState<StatusKirim>({ status: "diam" });

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function fokusKolomPertama(e: FormLoginErrors) {
    if (e.email) emailRef.current?.focus();
    else if (e.password) passwordRef.current?.focus();
  }

  const ubah: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setNilai((sebelumnya) => ({ ...sebelumnya, [name]: value }));
    setErrors((sebelumnya) => ({ ...sebelumnya, [name]: undefined }));
  };

  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (kirim.status === "mengirim") return; // cegah kirim ganda (Enter dua kali)

    const hasil = validasiFormLogin(nilai);
    setErrors(hasil);
    if (Object.keys(hasil).length > 0) {
      fokusKolomPertama(hasil);
      return;
    }

    setKirim({ status: "mengirim" });
    try {
      const peserta = await login(nilai.email.trim(), nilai.password);
      onBerhasil(peserta); // setelah ini form dilepas oleh App: jangan set state lagi di sini
    } catch (err) {
      const error = keApiError(err);
      // Hanya 422 yang punya detail per kolom; selain itu satu pesan umum dari pesanUntukLogin
      const { kolom, umum } = error.kode === "VALIDATION_ERROR" ? detailKeErrorsLogin(error.detail) : { kolom: {}, umum: [] };
      const adaKolom = Object.keys(kolom).length > 0;
      setErrors(kolom);
      fokusKolomPertama(kolom);
      setKirim({
        status: "gagal",
        pesan: adaKolom && umum.length === 0 ? null : pesanUntukLogin(error),
        kodeLaporan: teksKodeLaporan(error),
      });
    }
  };

  const mengirim = kirim.status === "mengirim";

  return (
    <form className={styles.form} onSubmit={(e) => void submit(e)} noValidate>
      <div className={styles.kolom}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          className={styles.kontrol}
          value={nilai.email}
          onChange={ubah}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className={styles.error} role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className={styles.kolom}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          ref={passwordRef}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className={styles.kontrol}
          value={nilai.password}
          onChange={ubah}
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <p id="password-error" className={styles.error} role="alert">
            {errors.password}
          </p>
        )}
      </div>

      {kirim.status === "gagal" && kirim.pesan !== null && (
        <Alert tipe="bahaya">
          <p>{kirim.pesan}</p>
          {kirim.kodeLaporan !== null && <p>{kirim.kodeLaporan}</p>}
        </Alert>
      )}

      <div className={styles.aksi}>
        <Button type="submit" disabled={mengirim}>
          {mengirim ? "Masuk..." : "Masuk"}
        </Button>
      </div>
    </form>
  );
}
