import type { Peran } from "../../types/peserta";
import Button from "../ui/Button";
import styles from "./SaklarPeran.module.css";

interface SaklarPeranProps {
  peran: Peran;
  onUbah: (peran: Peran) => void;
}

const pilihan: { nilai: Peran; label: string }[] = [
  { nilai: "peserta", label: "Peserta" },
  { nilai: "mentor", label: "Mentor" },
];

export default function SaklarPeran({ peran, onUbah }: SaklarPeranProps) {
  return (
    <div className={styles.saklar} role="group" aria-label="Pilih peran">
      <span className={styles.judul}>Masuk sebagai:</span>
      {pilihan.map((p) => (
        <Button
          key={p.nilai}
          ukuran="sm"
          variant={peran === p.nilai ? "primary" : "secondary"}
          aria-pressed={peran === p.nilai}
          onClick={() => onUbah(p.nilai)}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}
