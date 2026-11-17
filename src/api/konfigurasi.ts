// Alamat dasar API. Dipakai oleh semua pemanggilan di aplikasi.
// Pakai ||, bukan ??: jika VITE_API_URL ada tetapi KOSONG (""), ?? tidak menggantinya
// dan semua alamat jadi rusak. || memakai nilai bawaan "/api/v1" untuk string kosong juga.
export const BASE_URL: string = import.meta.env.VITE_API_URL || "/api/v1";
