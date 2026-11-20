// Validasi login di klien: hanya kenyamanan. Server (LoginDto) tetap penentu akhir.
// Sengaja TIDAK memeriksa kekuatan password: server juga tidak (akun lama tidak boleh terkunci).
export interface FormLoginState {
  email: string;
  password: string;
}

export type FormLoginErrors = Partial<Record<keyof FormLoginState, string>>;

const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validasiFormLogin(nilai: FormLoginState): FormLoginErrors {
  const errors: FormLoginErrors = {};
  const email = nilai.email.trim();

  if (email === "") errors.email = "Email wajib diisi";
  else if (!POLA_EMAIL.test(email)) errors.email = "Format email tidak valid";

  if (nilai.password === "") errors.password = "Password wajib diisi"; // password tidak di-trim

  return errors;
}
