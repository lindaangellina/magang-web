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

## Catatan Minggu 18 Selasa: state immutable dan lifting state up

### Soal 1 dan 2: Hapus dan ubah status

State jurnal (`useState<Jurnal[]>(jurnalTiruan)`) saya pindahkan ke `App`, sehingga `App` menjadi satu-satunya pemilik data. `hapusJurnal` memakai `filter`, sedangkan `ubahStatus` memakai `map` dan spread `{ ...j, statusReview: status }`. Keduanya mengembalikan array baru lewat bentuk fungsi `setJurnal((daftar) => ...)`. `DaftarJurnal` dan `JurnalCard` hanya menerima callback `onHapus` dan `onUbahStatus`, dan `RingkasanJurnal` ikut berubah otomatis karena angkanya dihitung dari state yang sama. Daftar jurnal per peserta tetap data turunan (`jurnal.filter(...)` saat render), bukan state kedua.

### Soal 3: readonly

Props array saya ketik `readonly Jurnal[]` (`DaftarJurnal`, `RingkasanJurnal`, `hitungRingkasan`, `urutkanTerbaru`). Saat saya menulis `jurnal.push(...)` di komponen anak, TypeScript menolak: `Property 'push' does not exist on type 'readonly Jurnal[]'. ts(2339)`. Setelah itu baris tersebut saya hapus.

### Soal 4: mutasi

`hapusSalah` memakai `splice` lalu `setDaftar(daftar)`. Gejalanya: konsol menampilkan isi array yang sudah berkurang, tetapi layar tidak berubah. Barisnya baru hilang setelah saya menekan "Picu render lain". Penyebabnya, array yang diberikan ke `setDaftar` masih referensi yang sama, sehingga React membandingkan dengan `Object.is`, menganggap tidak ada perubahan, dan tidak menggambar ulang. Versi benar memakai `filter`, yang menghasilkan array baru, sehingga baris langsung hilang.

### Soal 5: bug key indeks

Pada daftar `key={indeks}`, saya mengetik "AAA" di kolom samping "Satu", lalu menghapus yang pertama. "Satu" hilang, tetapi "AAA" berpindah ke samping "Dua". Pada daftar `key={nama}` saya mengetik "BBB" di samping "Satu" dengan cara yang sama, dan "BBB" ikut hilang bersama "Satu". React mengenali elemen lewat `key`. Setelah penghapusan, "Dua" berpindah ke indeks 0, sehingga React memakai ulang elemen `li` dengan key 0 beserta isi input-nya untuk "Dua". Input tidak dikontrol oleh data, jadi isinya tertinggal di elemen yang sama. Dengan `key={nama}` setiap item membawa identitasnya sendiri, sehingga isi inputnya ikut hilang bersama item itu.

### Soal 6: fungsi murni untuk daftar

`src/utils/daftar.ts` berisi `tambahPeserta`, `hapusPeserta`, `gantiPeserta`, `ubahStatusPeserta`, dan `urutkanPesertaByNama`. Semuanya menerima `readonly Peserta[]` dan mengembalikan `Peserta[]` baru. Di halaman latihan, data asli `pesertaTiruan` tetap utuh walau daftarnya diubah.

### Soal 7: objek bersarang

State `{ nama, alamat: { kota, kodePos } }` diubah dengan spread bertingkat: `{ ...lama, alamat: { ...lama.alamat, kota: kotaBaru } }`. Hanya `kota` yang berubah, `nama` dan `kodePos` tetap. Tiap tingkat yang berubah harus disalin: objek luar dan objek `alamat`.

### Soal 8: aliran data

```
App  (state: jurnal; hapusJurnal, ubahStatus)
 ├─ Header                (props: judul, namaPeserta)
 ├─ RingkasanJurnal       (props: jurnal)                          data turun
 └─ DaftarJurnal          (props: jurnal, onHapus, onUbahStatus)   data turun
      └─ JurnalCard       (props: jurnal, onHapus, onUbahStatus)   data turun
           ├─ StatusBadge
           ├─ DetailLampiran
           └─ Button      (klik) → onHapus(id) / onUbahStatus(id, status)  peristiwa naik
```

Data turun lewat props dari `App` ke `JurnalCard`. Peristiwa naik lewat callback: klik tombol di `JurnalCard` memanggil `onHapus` atau `onUbahStatus`, yang sebenarnya adalah `hapusJurnal` dan `ubahStatus` milik `App`. Hanya `App` yang memanggil `setJurnal`, lalu semua anak menerima data terbaru.

## Catatan Minggu 18 Rabu: form terkontrol dan validasi

### Soal 1: fungsi validasi

`validasiFormJurnal` (di `src/utils/validasiJurnal.ts`) adalah fungsi murni: menerima nilai form dan mengembalikan objek error per kolom (`Partial<Record<keyof FormJurnalState, string>>`). Hasil ujinya:

| Masukan | Hasil |
|---|---|
| Kegiatan 9 karakter | `Kegiatan minimal 10 karakter` |
| Kegiatan 10 karakter | tidak ada error |
| Kegiatan 2000 karakter | tidak ada error |
| Kegiatan 2001 karakter | `Kegiatan maksimal 2000 karakter` |
| Kegiatan hanya spasi | `Kegiatan minimal 10 karakter` (di-`trim` dulu) |
| Link `javascript:alert(1)` | `Link commit harus berupa URL yang valid` (protokol selain http/https ditolak) |
| Link kosong | tidak ada error (kolom opsional) |

### Soal 2: FormJurnal

`FormJurnal` memakai state terkontrol (`value` dan `onChange`), `label` dengan `htmlFor`, `aria-invalid`, `aria-describedby`, dan pesan error `role="alert"`. Form hanya memberi kabar lewat `onTambah`. `App` yang membuat objek `Jurnal` baru (`statusReview: "belum"`, `createdAt` sekarang) dan menaruhnya di paling atas daftar. Kolom opsional yang kosong dikirim sebagai `null`, seperti API. Form dikosongkan setelah berhasil, dan ringkasan ikut berubah karena dihitung dari state yang sama.

### Soal 3: satu handler

Satu fungsi `ubah` melayani semua kolom: `const { name, value } = e.target; setNilai((s) => ({ ...s, [name]: value }))`. Kurung siku membuat nama properti dihitung dari isi variabel `name` saat dijalankan, jadi `name="kegiatan"` mengubah `nilai.kegiatan`. Bahayanya, `name` bertipe `string` biasa sehingga TypeScript tidak bisa memeriksa bahwa nama itu benar-benar kunci state. Kalau atribut `name` salah ketik, state menerima properti baru yang salah tanpa error kompilasi, dan kolom aslinya tidak pernah berubah. Cara yang lebih aman adalah menambah type guard yang memeriksa `name` sebelum dipakai.

### Soal 4: perilaku error

Pesan error sebuah kolom dihapus saat kolom itu mulai diedit (`setErrors` menimpa kunci itu dengan `undefined`). Saat submit gagal, fokus dipindahkan ke kolom pertama yang salah memakai `useRef` pada tiap kolom, lalu `ref.current?.focus()` sesuai urutan kegiatan, hambatan, link commit.

### Soal 5: jebakan form terkontrol

| Kesalahan | Peringatan di konsol | Perbaikan |
|---|---|---|
| `<input value="tetap" />` tanpa `onChange` | `You provided a value prop to a form field without an onChange handler. This will render a read-only field. If the field should be mutable use defaultValue. Otherwise, set either onChange or readOnly.` | Tambah `onChange`, atau `readOnly`, atau pakai `defaultValue` |
| State dimulai dari `undefined` lalu diisi saat mengetik | `A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen.` | Mulai state dari string kosong `""` |

### Soal 6: keyboard

Form diisi dan dikirim hanya dengan keyboard. Urutan Tab: Kegiatan, Hambatan, Link commit, lalu tombol Simpan jurnal, dan Enter pada tombol itu mengirim form. Urutan ini mengikuti urutan elemen di HTML, tanpa `tabindex`. Fokus tampak jelas berkat `:focus-visible`, dan saat submit gagal fokus langsung pindah ke kolom yang salah.

### Soal 7: aman karena React

Jurnal dengan isi `<b>tebal</b>` dan `<img src=x onerror=alert(1)>` tampil persis sebagai teks, lengkap dengan tanda `<` dan `>`. Tidak ada teks tebal dan tidak ada `alert`. React meng-escape teks yang ditampilkan lewat `{}`, sehingga isinya diperlakukan sebagai teks, bukan HTML. Dengan `dangerouslySetInnerHTML`, string itu akan diurai sebagai HTML: `<img src=x>` gagal dimuat, lalu `onerror` menjalankan skrip penyerang. Itu adalah XSS. Karena itu `dangerouslySetInnerHTML` tidak boleh dipakai dengan data dari pengguna atau API tanpa pembersihan. Validasi di klien juga bukan pengaman, karena siapa pun bisa memanggil API langsung. Keamanan sesungguhnya ada di server.

### Soal 8: form Profil

`FormProfil` memakai pola yang sama dengan `FormJurnal`. Nama minimal 3 karakter, dan telepon opsional dengan pola `^08\d{8,12}$` (08 diikuti 8 sampai 12 digit). Fungsi `validasiFormProfil` murni, dan telepon yang kosong dikirim sebagai `null`.

| Telepon | Hasil |
|---|---|
| `0812345678` (10 digit) | valid |
| `08123456789012` (14 digit) | valid |
| `081234567` (9 digit) | ditolak |
| `081234567890123` (15 digit) | ditolak |
| `+62812345678` | ditolak |

## Catatan Minggu 18 Kamis: data turunan, useEffect, dan custom hook

### Soal 1: data turunan

Di `App`, state hanya `jurnal`, `filter`, dan `kataKunci`. Daftar yang tampil dihitung setiap render: `jurnalPeserta.filter(status).filter(kegiatan)`, dan jumlah "Menampilkan x dari y jurnal" juga dihitung dari hasil itu. Urutan terbaru dulu dilakukan di `DaftarJurnal` pada salinan array (`[...jurnal].sort(...)`). Ringkasan tetap dihitung dari semua jurnal, bukan dari yang terfilter. Select status memakai type guard `adalahFilterStatus`, sehingga string dari `e.target.value` menjadi `FilterStatus` tanpa `as`.

### Soal 2: anti-pola

Di halaman latihan, hasil filter saya simpan sebagai state (`tampilSalah`) berdampingan dengan versi data turunan. Saat tombol "Tambah item" diklik, item baru muncul di daftar data turunan, tetapi tidak muncul di daftar yang disimpan sebagai state. Saat "Hapus item pertama" diklik, item hilang di daftar benar tetapi tetap tampil di daftar salah. Daftar salah baru kembali sinkron setelah filter diklik ulang. Penyebabnya, ada dua sumber kebenaran (`item` dan `tampilSalah`), dan setiap handler harus ingat memperbarui keduanya. Satu yang lupa membuat data basi. Perbaikannya, hitung saja saat render.

### Soal 3: judul dinamis

`useEffect(() => { document.title = ... }, [jurnal.length])` menyinkronkan judul tab dengan jumlah jurnal. Saat array dependency saya ubah menjadi `[]`, ESLint menegur `React Hook useEffect has a missing dependency: 'jurnal.length'`, dan judul tab hanya diatur sekali setelah render pertama. Setelah jurnal ditambah atau dihapus, judulnya tidak ikut berubah. Array dependency menentukan kapan efek dijalankan ulang, dan semua nilai yang dipakai di dalam efek harus tercantum.

### Soal 4: pintasan "/" dan cleanup

`PencarianJurnal` memasang pendengar `keydown` di `window` dan melepasnya lewat fungsi cleanup. Saat cleanup saya hapus dan `console.log` ditambahkan di `tekanTombol`, menekan "/" sekali membuat handler berjalan dua kali, karena ada dua pendengar yang tidak pernah dilepas (efek dipasang dua kali oleh StrictMode, dan tidak ada yang membersihkan). Setelah cleanup dikembalikan, handler hanya berjalan sekali.

### Soal 5: StrictMode

Efek dengan `console.log("pasang")` dan cleanup `console.log("lepas")` menampilkan urutan `pasang`, `lepas`, `pasang` di development. React sengaja memasang, melepas, lalu memasang lagi untuk memeriksa apakah cleanup benar-benar membatalkan apa yang dipasang efek. Efek yang benar aman dipasang berkali-kali. Di produksi hanya `pasang` sekali.

### Soal 6 dan 7: useLocalStorage dan data rusak

`useLocalStorage<T>(kunci, nilaiAwal, valid)` membaca localStorage sekali lewat inisialisasi malas, memeriksa bentuk datanya dengan type guard, dan menulis kembali lewat efek setiap nilai berubah. Jurnal yang ditambahkan tetap ada setelah halaman di-reload, dan terlihat di DevTools, Application, Local Storage, kunci `jurnal-magang-v1`.

Saya merusak isi `jurnal-magang-v1` dengan dua cara:

| Isi localStorage | Dengan type guard | Dengan `as` (guard dihapus) |
|---|---|---|
| Teks sembarang, bukan JSON | Aplikasi jalan dengan data awal (`JSON.parse` gagal dan ditangkap `catch`) | Sama, karena `JSON.parse` ada di dalam `try` |
| `{"a":1}` (JSON valid, bentuk salah) | Aplikasi jalan dengan data awal | Crash: `TypeError: jurnal.filter is not a function`, halaman kosong |

`as` hanya mengaku bahwa tipenya benar tanpa memeriksa. Data dari localStorage adalah input tidak tepercaya: pengguna bisa mengeditnya, atau isinya dari versi aplikasi yang lama. Interface TypeScript lenyap saat program berjalan (type erasure), jadi bentuk data harus diperiksa saat runtime. Guard saya juga memeriksa `pesertaId`, karena `App` memakainya untuk memfilter.

### Soal 8: usePenundaan

`usePenundaan(nilai, 300)` mengembalikan nilai yang baru berubah 300 ms setelah nilai berhenti berubah. Cleanup `clearTimeout` membatalkan pengatur waktu lama setiap kali nilai berubah lagi. Di halaman latihan, kata kunci asli berubah di setiap ketikan, sedangkan yang tertunda tertinggal sampai pengetikan berhenti. Pencarian di `App` memakai nilai yang tertunda ini.

### Soal 9: efek, event handler, atau data turunan

| Kasus | Jenis | Alasan |
|---|---|---|
| a. Menghitung jumlah jurnal belum direview | Data turunan | Bisa dihitung dari `jurnal` saat render, tidak perlu state |
| b. Mengosongkan form setelah berhasil disimpan | Event handler | Terjadi karena pengguna menekan Simpan, jadi `setNilai(NILAI_AWAL)` ditaruh di handler submit |
| c. Menyimpan jurnal ke localStorage setiap berubah | Efek | Menyinkronkan state dengan sistem di luar React (penyimpanan browser) |
| d. Mengatur judul tab sesuai jumlah jurnal | Efek | `document.title` ada di luar React |
| e. Menampilkan pesan "Berhasil disimpan" setelah Simpan | Event handler | Respons langsung terhadap aksi pengguna |
| f. Mengurutkan daftar dari terbaru | Data turunan | Hasil hitungan dari data yang ada, dilakukan pada salinan saat render |