/* eslint-disable react-hooks/immutability -- file ini sengaja salah untuk demo Soal 2 (let tidak memicu render ulang) */
// SOAL 2 — Versi SALAH: memakai variabel biasa (let), bukan state.
// Tombol diklik: console.log menunjukkan angkanya naik, tetapi layar tetap "Jumlah: 0".
// Alasan: (1) React tidak tahu variabel biasa berubah, jadi komponen tidak digambar ulang;
//         (2) kalaupun digambar ulang, fungsi dijalankan dari awal sehingga jumlah kembali 0.
// ESLint mungkin ikut memberi peringatan di sini. Itu wajar: file ini sengaja salah.
export default function PenghitungLet() {
  let jumlah = 0;

  function tambah() {
    jumlah = jumlah + 1;
    console.log("nilai let di memori:", jumlah);
  }

  return <button onClick={tambah}>Jumlah (let): {jumlah}</button>;
}