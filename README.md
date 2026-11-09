# magang-web

Halaman daftar jurnal harian peserta magang, dibangun dengan React + TypeScript + Vite. Proyek ini adalah pembuka Fase 3 dan dikerjakan terpisah dari backend (`api-magang`). Di Minggu 17 datanya masih tiruan (statis) dengan bentuk yang sama dengan response API; state dan pemanggilan API menyusul di Minggu 18 dan 19.

Halaman menampilkan: header dengan nama peserta, ringkasan (total, sudah direview, belum), dan daftar jurnal dari yang terbaru. Setiap jurnal menampilkan tanggal, status review, kegiatan, hambatan, catatan mentor, lampiran, dan tautan commit; field yang kosong atau `null` tidak ditampilkan.

## Menjalankan

Syarat: Node.js 22 LTS atau lebih baru.

```bash
git clone https://github.com/lindaangellina/magang-web.git
cd magang-web
npm install
npm run dev       # dev server di http://localhost:5173
npm run lint      # periksa gaya kode (ESLint)
npm run build     # periksa tipe (tsc) lalu bangun versi produksi ke dist/
npm run preview   # jalankan hasil build di http://localhost:4173
```

Galeri semua komponen UI (halaman sementara) dibuka di `http://localhost:5173/?halaman=galeri`.

Catatan versi: template Vite terbaru memasang TypeScript 7, yang bentrok dengan `typescript-eslint` (butuh di bawah 6.1). Solusinya TypeScript diturunkan ke 5.9 (`npm install -D typescript@~5.9.0`).

## Struktur Folder

```
src/
├── components/
│   ├── ui/          Button, Alert, Kartu, Badge (generik, tanpa tahu soal jurnal)
│   ├── jurnal/      JurnalCard, DaftarJurnal, StatusBadge, RingkasanJurnal, DetailLampiran
│   └── layout/      Header
├── data/            data tiruan: jurnal.ts, pesertaTiruan.ts (sementara)
├── pages/           GaleriKomponen (halaman sementara)
├── types/           peserta.ts, jurnal.ts
├── utils/           cx.ts, format.ts, jurnal.ts (hitungRingkasan, urutkanTerbaru)
├── App.tsx          hanya menyusun halaman
├── App.module.css
├── main.tsx
└── index.css        variabel desain (design token)
```

Setiap komponen punya `.module.css` sendiri (CSS Modules) dan memakai variabel desain dari `index.css`.

## Tiga Keputusan Desain

1. **Komponen `ui` dipisah dari komponen `jurnal`.** `Button`, `Alert`, `Badge`, dan `Kartu` tidak mengenal istilah jurnal, jadi bisa dipakai ulang di halaman lain (peserta, mentor). Komponen `jurnal` yang menyusun komponen `ui`: contohnya `StatusBadge` hanya menerjemahkan status review menjadi `Badge` berwarna, sehingga warna tidak ditulis dua kali.
2. **Turunan data dihitung di fungsi murni, bukan ditulis manual atau disimpan.** `hitungRingkasan` menghitung total, sudah, dan belum langsung dari array setiap render, sehingga angkanya tidak mungkin berbeda dari datanya. `urutkanTerbaru` mengurutkan salinan (`[...jurnal].sort(...)`) karena `sort` mengubah array dan props tidak boleh diubah. Fungsi murni di `utils` juga lebih mudah diuji nanti.
3. **Field opsional dari API ditangani di titik tampilnya.** Field bisa `undefined` atau `null`, jadi `JurnalCard` memakai pemeriksaan `&&` untuk hambatan, catatan mentor, dan tautan commit, serta `lampiran ?? []` untuk lampiran. Hasilnya teks "null" atau elemen kosong tidak pernah muncul. Daftar lampiran memakai elemen bawaan `<details>`, jadi bisa dibuka dengan keyboard tanpa `useState`, yang baru dipelajari Minggu 18.

Bonus yang dikerjakan: komponen `DetailLampiran`, varian tampilan padat untuk `JurnalCard` (`variasi="padat"`, union string literal), dan halaman galeri komponen tetap dipertahankan.

Catatan: sebagian komponen latihan Selasa sampai Kamis (misalnya `PesertaCard`, `NomorUrut`, `DaftarPeserta`, `HasilJurnal`) tidak dipakai di halaman akhir sehingga dihapus pada Jumat; kodenya tetap ada di riwayat commit. Tipe `Jurnal` mengikuti spesifikasi Jumat (`statusReview` bernilai `belum` atau `sudah`), dan di Minggu 19 akan diganti tipe yang dihasilkan dari dokumen OpenAPI.

## Catatan Latihan Harian (Minggu 17)

Hasil percobaan dan jawaban soal Senin sampai Kamis.

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

## Catatan Minggu 17 Rabu

### Soal 1: peringatan key

Setelah `key={p.id}` dihapus dari `<li>` di `DaftarPeserta`, konsol browser menampilkan:

```
Each child in a list should have a unique "key" prop.

Check the render method of `DaftarPeserta`. See https://react.dev/link/warning-keys for more information.
```

Peringatan itu menunjuk `DaftarPeserta.tsx` baris 15 (`<li>` di dalam `.map`).

Diperbaiki dengan mengembalikan `key={p.id}`.

### Soal 2: keadaan kosong

`DaftarPeserta` memakai early return: kalau `peserta.length === 0`, komponen langsung mengembalikan `<p>Belum ada peserta.</p>`. Diuji dengan `<DaftarPeserta peserta={[]} />` di `App.tsx`.

### Soal 4: jebakan 0 &&

Dengan `{jumlah && <p>Total {jumlah} jurnal</p>}` dan `jumlah = 0`, yang tampil di layar adalah:

Angka `0` tampil sendiri sebagai satu baris di bawah "Total 4 jurnal", di kartu "Ringkasan Jurnal".

Penyebabnya: `0 && ...` menghasilkan angka `0`, dan React menampilkan angka 0 sebagai teks (berbeda dengan `false`, `null`, atau string kosong yang tidak tampil). Diperbaiki dengan perbandingan boolean: `{jumlah > 0 && <p>Total {jumlah} jurnal</p>}`.

### Soal 5: turunan data

`RingkasanJurnal` menghitung total, sudah direview, dan belum direview dengan `filter` langsung saat render dari props, tanpa menyimpan hasilnya di variabel terpisah di luar komponen. Kalau data berubah, hasilnya otomatis ikut berubah.

### Soal 6: urut tanpa merusak data

`JurnalTerbaru` mengurutkan salinan: `[...jurnal].sort(...)`. Buktinya, kartu "Jurnal (urutan asli)" di bawahnya tetap menampilkan urutan semula (id 1, 2, 3, 4), sedangkan kartu "Jurnal Terbaru" menampilkan id 4, 2, 3, 1.

### Soal 7: props union

`HasilJurnal` mendukung tiga status (`memuat`, `berhasil` dengan `data`, `gagal` dengan `pesan`), dan ketiganya diuji di `App.tsx`. Percobaan `<HasilJurnal status="berhasil" />` tanpa `data` ditolak TypeScript:

```
Type '{ status: "berhasil"; }' is not assignable to type 'IntrinsicAttributes & HasilJurnalProps'. ts(2322)
Property 'data' is missing in type '{ status: "berhasil"; }' but required in type '{ status: "berhasil"; data: Jurnal[]; }'.
'data' is declared here. (HasilJurnal.tsx, baris 7)
```

### Soal 8: kenapa key sebaiknya ID dari database, bukan indeks

Key dipakai React untuk mengenali item mana yang sama saat daftar berubah (ditambah, dihapus, atau diurutkan ulang). ID dari database melekat pada datanya sehingga tetap sama walaupun posisinya berpindah, sedangkan indeks menempel pada posisi. Kalau item pertama dihapus, item kedua berpindah ke indeks 0 dan React mengira itu item yang sama, sehingga kondisi seperti isi input bisa menempel di item yang salah. Karena itu key harus unik di antara saudaranya dan stabil, yaitu ID dari data, bukan indeks atau `Math.random()`.

## Catatan Minggu 17 Kamis

### Struktur komponen UI

```
src/
  index.css                  variabel desain (design token) dan gaya dasar
  utils/cx.ts                penggabung nama class
  components/
    ui/                      komponen dasar: Button, Alert, Badge, Kartu (masing-masing punya .module.css)
    jurnal/                  komponen khusus jurnal: StatusBadge, JurnalCard
  pages/GaleriKomponen.tsx   halaman sementara: semua varian komponen UI
```

### Soal 1: variabel desain

Warna, jari-jari, dan nilai lain ditulis sekali sebagai variabel di `:root` (`index.css`), lalu dipakai lewat `var(--warna-utama)`. Percobaan: saya mengubah `--warna-utama` dari `#2563eb` menjadi ungu (`#7c3aed`), dan tombol primary, tombol secondary, badge info, serta tautan ikut berubah warna tanpa saya menyentuh file komponennya satu per satu.

Manfaatnya: satu sumber kebenaran, jadi mengganti tema atau merek cukup mengubah satu tempat, tampilan seluruh aplikasi tetap konsisten, dan tidak ada warna yang tertinggal berbeda karena lupa diganti.

### Soal 2: Button

- `variant="ngasal"` ditolak TypeScript di editor:
  ```
  Type '"ngasal"' is not assignable to type '"primary" | "secondary" | "danger" | undefined'. ts(2322)
  The expected type comes from property 'variant' which is declared here on type 'IntrinsicAttributes & Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement...' (Button.tsx, baris 7)
  ```
- `Button` memakai `ComponentPropsWithoutRef<"button">`, jadi `disabled`, `onClick`, `type`, dan atribut tombol lain langsung bisa dipakai tanpa ditulis satu per satu.
- `type` bawaannya `button`, jadi tombol di dalam form tidak otomatis men-submit. Karena `{...rest}` ditaruh di akhir, pemakai bisa menimpanya dengan `type="submit"`. Buktinya di galeri: klik tombol bawaan tidak menulis apa-apa di konsol, klik tombol `type="submit"` menulis "form terkirim".

Varian berupa union string literal (bukan boolean `isPrimary`, `isDanger`) supaya nilai ngawur langsung error, dua varian tidak mungkin aktif bersamaan, dan autocomplete menampilkan semua pilihan.

### Soal 3 dan 4: Alert, Badge, Kartu, dan galeri

`Alert` (info, sukses, bahaya), `Badge` (netral, info, sukses, bahaya), dan `Kartu` dibuat dengan CSS Modules. `Alert` bahaya memakai `role="alert"`, sedangkan yang lain `role="status"`. `StatusBadge` memakai `Badge` (komposisi), jadi warna statusnya tidak ditulis ulang. Semua varian ditampilkan di halaman sementara `GaleriKomponen`.

CSS Modules membuat nama class otomatis unik per komponen, sehingga `.button` di satu komponen tidak bentrok dengan `.button` di komponen lain.

### Soal 5: callback onHapus

| Keadaan | Hasil |
|---|---|
| Tanpa `onHapus` | Tombol Hapus tidak muncul |
| Dengan `onHapus={(id) => console.log("hapus", id)}` | Klik Hapus: konsol menulis `hapus 2` |
| Salah: `onClick={onHapus(jurnal.id)}` | TypeScript menolak: `Type 'void' is not assignable to type 'MouseEventHandler<HTMLButtonElement> \| undefined'. ts(2322)`. Di konsol, `hapus 2` muncul sendiri saat halaman dimuat tanpa klik (dua kali karena StrictMode) |

Penjelasan: `onHapus(jurnal.id)` adalah pemanggilan fungsi, jadi dijalankan saat render dan yang diberikan ke `onClick` adalah hasilnya, bukan fungsinya. `() => onHapus(jurnal.id)` membungkusnya jadi fungsi yang baru dijalankan saat diklik.

### Soal 6: event bertipe

`cetakKoordinat(e: MouseEvent<HTMLButtonElement>)` mencetak `e.clientX` dan `e.clientY`. Hasil klik: `Diklik di posisi 94 806`.

### Soal 7: aksesibilitas dengan keyboard

| No | Temuan | Perbaikan |
|---|---|---|
| 1 | Tombol yang `disabled` dilewati saat Tab, jadi pengguna keyboard tidak tahu tombol itu ada | Tombol nonaktif memang tidak bisa difokus oleh browser; saya beri teks penjelasan di galeri bahwa tombol yang pucat sedang nonaktif |
| 2 | Kotak fokus di tombol berwarna kurang tegas, sehingga posisi fokus sulit diikuti | Menambah `.button:focus-visible { outline: 3px solid var(--warna-teks); outline-offset: 2px; }` di `Button.module.css` |
| 3 | Tiga tautan "Tautan Belajar" membuka tab baru (`target="_blank"`) tanpa pemberitahuan | Menambahkan teks "(tab baru)" di setiap tautan |

Catatan: tombol Hapus yang kelak muncul berkali-kali di daftar akan terdengar sama bagi pembaca layar; perbaikannya `aria-label` yang menyebut kegiatannya, dikerjakan saat daftar jurnal dipakai di halaman sungguhan.

## Catatan Minggu 18 Senin: useState

### Soal 2: variabel biasa gagal

`PenghitungLet` memakai `let jumlah`. Setiap tombol diklik, `console.log` menampilkan angka yang naik (1, 2, 3), tetapi layar tetap "Jumlah (let): 0". Dua alasannya: (1) React tidak tahu variabel biasa berubah, jadi komponen tidak digambar ulang; (2) kalaupun digambar ulang, fungsi komponen dijalankan dari awal sehingga `jumlah` kembali 0. ESLint (`react-hooks/immutability`) juga menolak file ini dengan pesan "Cannot reassign variable after render completes... Consider using state instead", jadi saya mematikan aturan itu hanya untuk file demo tersebut dengan komentar penjelasan.

### Soal 3 dan 6: Penghitung dan state milik instans

`Penghitung` memakai `useState(0)` dengan tombol Tambah, Kurang (memakai `Math.max(0, j - 1)` supaya tidak di bawah 0), dan Reset. Dua `<Penghitung />` berdampingan punya state terpisah: mengklik satu tidak mengubah yang lain. Di React DevTools (tab Components) nilai `State` salah satunya bisa diubah langsung, dan hanya penghitung itu yang berubah angkanya.

### Soal 4: snapshot

| Fungsi | Hasil setelah satu klik | Penjelasan |
|---|---|---|
| `tambahTigaSalah` | 1 | Tiga kali `setJumlah(jumlah + 1)`, dan `jumlah` di render itu tetap 0, jadi ketiganya menjadwalkan nilai 1 |
| `tambahTigaBenar` | 3 | `setJumlah((j) => j + 1)` memakai nilai terbaru dari antrean |

`console.log(jumlah)` tepat setelah `setJumlah` menampilkan nilai lama (0) karena state adalah foto pada saat render. Setter hanya meminta React menggambar ulang dengan nilai baru, dan nilai itu baru terlihat di render berikutnya.

### Soal 5: toggle detail di JurnalCard

`JurnalCard` punya state `terbuka` (boolean). Tombol "Tampilkan detail" / "Sembunyikan detail" memakai `aria-expanded` dan `aria-controls`. Hambatan, catatan mentor, dan lampiran hanya dirender saat `terbuka` bernilai true. Tombol hanya muncul jika kartu punya detail (nilai turunan `adaDetail`, bukan state). Setiap kartu punya state sendiri, jadi membuka satu kartu tidak membuka kartu lain.

### Soal 7: mengetik state

| Pemanggilan | Tipe |
|---|---|
| `useState("")` | string (diinfer) |
| `useState(false)` | boolean (diinfer) |
| `useState<Jurnal[]>([])` | array objek |
| `useState<Jurnal \| null>(null)` | objek atau null |
| `useState<"semua" \| StatusReview>("semua")` | union literal |

`useState([])` bermasalah karena TypeScript menginfer `never[]`: array yang tidak boleh berisi apa pun. Akibatnya `setDaftar(jurnalTiruan)` ditolak. Array kosong wajib diberi generic.

### Soal 8: melanggar aturan hooks

`useState` saya pindahkan ke dalam `if (jumlah > 0)` di `Penghitung`. ESLint langsung menegur: `React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render. (react-hooks/rules-of-hooks)`. Saat tombol Tambah diklik, konsol browser menampilkan `React has detected a change in the order of Hooks called by Penghitung` beserta `Uncaught Error: Rendered more hooks than during the previous render`, dan halaman menjadi kosong. Pada render pertama (jumlah 0) komponen memanggil satu hook, pada render kedua (jumlah 1) dua hook. React mengenali state dari urutan pemanggilan hook, sehingga urutannya harus sama di setiap render. Setelah blok itu dihapus, error hilang.

### Soal 9: props, state, dan data turunan

Props adalah data yang diberikan komponen induk dan hanya boleh dibaca, contohnya `jurnal` dan `onHapus` yang diterima `JurnalCard`. State adalah data milik komponen itu sendiri yang bisa berubah lewat setter dan membuat tampilan digambar ulang, contohnya `terbuka` di `JurnalCard` yang menentukan apakah detail tampil. Data turunan adalah nilai yang bisa dihitung dari props atau state yang sudah ada, sehingga tidak perlu disimpan sebagai state baru, contohnya jumlah jurnal yang belum direview dari `hitungRingkasan(jurnal)` yang dihitung saat render. Kalau nilai itu disimpan sebagai state, ia bisa tidak sinkron dengan data aslinya.