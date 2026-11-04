# magang-web

Antarmuka web untuk API Magang Batch 4, dibangun dengan React + TypeScript + Vite. Proyek ini adalah pembuka Fase 3 dan dikerjakan terpisah dari backend (`api-magang`).

## Menjalankan

Syarat: Node.js 22 LTS atau lebih baru.

```bash
npm install
npm run dev       # dev server di http://localhost:5173
npm run build     # periksa tipe (tsc) lalu bangun versi produksi ke dist/
npm run preview   # jalankan hasil build di http://localhost:4173
```

Catatan versi: template Vite terbaru memasang TypeScript 7, yang bentrok dengan `typescript-eslint` (butuh di bawah 6.1). Solusinya TypeScript diturunkan ke 5.9 (`npm install -D typescript@~5.9.0`).

## Catatan Minggu 17 Senin

### Soal 5: build dan preview

Hasil `npm run build`:

| File di `dist/` | Ukuran | Setelah gzip |
|---|---|---|
| `index.html` | 0.46 kB | 0.29 kB |
| `assets/index-*.css` | 1.91 kB | 0.85 kB |
| `assets/index-*.js` | 220.07 kB | 68.84 kB |

Dev server menyajikan kode apa adanya dengan HMR dan tanpa pemeriksaan tipe (port 5173). Build memeriksa tipe lebih dulu, menggabungkan dan memperkecil kode, dan hasilnya tidak punya HMR: perubahan di `App.tsx` baru terlihat di `npm run preview` (port 4173) setelah build ulang.

### Soal 6: tiga error JSX yang sengaja dibuat

| Error | Pesan yang muncul | Perbaikan |
|---|---|---|
| Elemen bersebelahan tanpa pembungkus (menghapus `<>` dan `</>`) | Layar merah di browser dan terminal: `[PARSE_ERROR] Expected ',' or ')' but found 'Identifier'` | Kembalikan Fragment `<> ... </>` |
| Objek di dalam `{}` (`<p>{siswa}</p>`) | Halaman kosong; konsol: `Uncaught Error: Objects are not valid as a React child (found: object with keys {nama, sekolah})` | Ambil propertinya: `{siswa.nama}` |
| `class` bukan `className` | VS Code: `ts(2322) Property 'class' does not exist ... Did you mean 'className'?`; konsol: `Invalid DOM property 'class'. Did you mean 'className'?` (halaman tetap tampil) | Ganti menjadi `className` |

### Soal 8: jawaban

Pendekatan imperatif memerintahkan langkah demi langkah cara mengubah tampilan (membuat elemen, mengisi teks, lalu memasangnya), sedangkan pendekatan deklaratif seperti React hanya mendeskripsikan hasil akhirnya dan React yang mengurus langkahnya. Model mentalnya: tampilan = komponen(data), jadi saya cukup mengubah data dan React memperbarui layar secukupnya. Frontend dan backend dibuat sebagai dua aplikasi terpisah karena keduanya berjalan di tempat yang berbeda (browser pengguna dan server), punya tugas berbeda (menampilkan data dan menyediakan data), dan bisa dikembangkan, diuji, serta dipasang sendiri-sendiri. Keduanya berkomunikasi lewat HTTP dan JSON, itulah alasan API didokumentasikan dengan Swagger dan CORS disiapkan.