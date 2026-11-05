import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import styles from "./Badge.module.css";

interface BadgeProps {
  variasi?: "netral" | "info" | "sukses" | "bahaya";
  children: ReactNode;
}

// Badge generik: tidak tahu apa-apa soal jurnal, hanya teks kecil berwarna
export default function Badge({ variasi = "netral", children }: BadgeProps) {
  return <span className={cx(styles.badge, styles[variasi])}>{children}</span>;
}
