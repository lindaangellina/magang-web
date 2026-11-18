// src/api/pesan.ts: fungsi murni (mudah diuji di Minggu 23)
import type { ApiError } from "./errors";

export function pesanUntukPengguna(error: ApiError): string {
  switch (error.kode) {
    case "NETWORK_ERROR":
      return "Tidak dapat terhubung ke server. Periksa koneksi internetmu lalu coba lagi.";
    case "UNAUTHORIZED":
    case "TOKEN_EXPIRED":
    case "INVALID_TOKEN":
      return "Sesimu berakhir atau belum login. Silakan login kembali.";
    case "FORBIDDEN":
      return "Kamu tidak memiliki akses untuk aksi ini.";
    case "NOT_FOUND":
      return "Data yang dicari tidak ditemukan.";
    case "RATE_LIMITED":
      return "Terlalu banyak percobaan. Tunggu beberapa saat lalu coba lagi.";
    case "PAYLOAD_TOO_LARGE":
      return "Data yang dikirim terlalu besar.";
    case "VALIDATION_ERROR":
      return "Data yang dikirim belum valid. Periksa kembali isianmu.";
    default:
      return "Terjadi kesalahan di server. Coba lagi beberapa saat lagi.";
  }
}

// "Kode laporan: ..." bila server mengirim requestId; null bila tidak ada (mis. NETWORK_ERROR)
export function teksKodeLaporan(error: ApiError): string | null {
  return error.requestId !== undefined ? `Kode laporan: ${error.requestId}` : null;
}
