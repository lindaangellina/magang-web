interface NomorUrutProps {
  nomor: number;
}

// Murni: props yang sama selalu menghasilkan tampilan yang sama
export default function NomorUrut({ nomor }: NomorUrutProps) {
  return <p>Nomor {nomor}</p>;
}