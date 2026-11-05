import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import styles from "./Alert.module.css";

interface AlertProps {
  tipe: "info" | "sukses" | "bahaya";
  children: ReactNode;
}

export default function Alert({ tipe, children }: AlertProps) {
  return (
    <div role={tipe === "bahaya" ? "alert" : "status"} className={cx(styles.alert, styles[tipe])}>
      {children}
    </div>
  );
}
