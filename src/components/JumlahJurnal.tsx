interface JumlahJurnalProps {
  jumlah: number;
}

export default function JumlahJurnal({ jumlah }: JumlahJurnalProps) {
  // Percobaan Soal 4: ubah sementara menjadi {jumlah && <p>Total {jumlah} jurnal</p>}
  // lalu lihat apa yang tampil saat jumlah = 0. Kembalikan setelah dicatat.
  return <>{jumlah > 0 && <p>Total {jumlah} jurnal</p>}</>;
}