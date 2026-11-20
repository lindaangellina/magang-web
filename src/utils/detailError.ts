// src/utils/detailError.ts
// Fungsi MURNI: tanpa React, tanpa state, tanpa efek samping. Mudah diuji dan dipakai ulang.
import type { FieldError } from "../api/types";
import type { FormLoginState } from "./validasiLogin";
import type { FormJurnalErrors, FormJurnalState } from "./validasiJurnal";

// Hasil pemetaan: error per kolom yang dikenal form, dan sisanya sebagai pesan umum
interface HasilPeta<K extends string> {
  kolom: Partial<Record<K, string>>;
  umum: string[];
}

// Inti pemetaan, dipakai oleh form jurnal dan form login.
// `dikenal` = daftar nama kolom milik form. Tidak memakai `as`: find() mengembalikan elemen daftar itu sendiri (bertipe K).
export function petakanDetail<K extends string>(detail: readonly FieldError[], dikenal: readonly K[]): HasilPeta<K> {
  const kolom: Partial<Record<K, string>> = {};
  const umum: string[] = [];

  for (const d of detail) {
    const nama = dikenal.find((k) => k === d.field);
    if (nama === undefined) {
      umum.push(`${d.field}: ${d.pesan}`); // mis. lampiran.1.url: tidak punya kolom di form
    } else if (kolom[nama] === undefined) {
      kolom[nama] = d.pesan; // satu kolom, satu pesan: pesan pertama dari server yang dipakai
    }
  }

  return { kolom, umum };
}

const KOLOM_JURNAL: readonly (keyof FormJurnalState)[] = ["kegiatan", "hambatan", "linkCommit"];
const KOLOM_LOGIN: readonly (keyof FormLoginState)[] = ["email", "password"];

export function detailKeErrors(detail: readonly FieldError[]): { kolom: FormJurnalErrors; umum: string[] } {
  return petakanDetail(detail, KOLOM_JURNAL);
}

export function detailKeErrorsLogin(detail: readonly FieldError[]) {
  return petakanDetail(detail, KOLOM_LOGIN);
}
