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

## Catatan Minggu 17 Selasa

### Struktur

```
src/
  components/   komponen (satu komponen per file, export default)
  types/        tipe (peserta.ts)
  data/         data tiruan (pesertaTiruan.ts)
  App.tsx       hanya menyusun halaman
```

Data tiruan ditaruh di `src/data` supaya `App.tsx` tetap hanya berisi penyusunan halaman, dan nanti mudah diganti dengan data asli dari API.

### Soal 2: tiga penolakan TypeScript

| Kesalahan | Pesan yang muncul |
|---|---|
| `fase="1"` (string, harusnya number) | `Type 'string' is not assignable to type 'number'.` ts(2322). Detail: `The expected type comes from property 'fase' which is declared here on type 'IntrinsicAttributes & PesertaRingkasProps'` |
| Prop tidak dikenal `umur={17}` | `Type '{ nama: string; sekolah: string; fase: number; umur: number; }' is not assignable to type 'IntrinsicAttributes & PesertaRingkasProps'.` ts(2322). Detail: `Property 'umur' does not exist on type 'IntrinsicAttributes & PesertaRingkasProps'.` |
| Prop wajib `nama` tidak diberikan | `Property 'nama' is missing in type '{ sekolah: string; fase: number; }' but required in type 'PesertaRingkasProps'.` ts(2741) |

Ketiganya ditolak di editor, sebelum aplikasi dijalankan.

### Soal 3: Pick vs Omit

`Pick<Peserta, "nama" | "sekolah" | "fase">` mengambil hanya field yang disebutkan. Saya pakai untuk `PesertaRingkas`, karena komponen itu cuma butuh tiga field.

`Omit<Peserta, "email">` mengambil semua field kecuali yang disebutkan. Saya pakai untuk `PesertaTanpaEmail`, karena komponen itu butuh hampir semua field dan hanya email yang tidak boleh ikut.

Kapan memilih yang mana:
- Pilih `Pick` kalau yang dibutuhkan hanya sedikit field.
- Pilih `Omit` kalau yang dibutuhkan hampir semua field dan hanya perlu membuang satu atau dua.

Perbedaan pentingnya: kalau nanti `Peserta` ditambah field baru, `Omit` otomatis ikut membawanya, jadi bisa tanpa sengaja menyertakan data sensitif. `Pick` tetap aman karena hanya mengambil field yang kita sebut sendiri.

### Soal 6: komponen murni

Komponen percobaan `NomorUrutTidakMurni` menaikkan variabel `urutan` yang ada di luar komponen setiap kali render. Dipakai tiga kali di dev (StrictMode), nomor yang tampil bukan 1, 2, 3 tetapi:

```
Nomor 2
Nomor 4
Nomor 6
```

Penyebabnya: StrictMode sengaja merender setiap komponen dua kali untuk membongkar efek samping, sehingga `urutan` naik dua kali per komponen. ESLint juga menolak pola ini (`react-hooks/globals`: `Cannot reassign variables declared outside of the component/hook`).

Perbaikannya `NomorUrut`, yang menerima `nomor` lewat props (`nomor={1}`). Komponen itu murni: props yang sama selalu menghasilkan tampilan yang sama, dan tidak mengubah apa pun di luar dirinya. File percobaan sudah dihapus dan tidak di-commit.

### Alur data (satu arah)

```
App
 └── Kartu (judul, children)
      └── PesertaCard (peserta, tampilkanEmail)
           └── InfoBaris (label, nilai)
```

Data hanya mengalir dari induk ke anak lewat props; anak hanya membaca props dan tidak mengubahnya.