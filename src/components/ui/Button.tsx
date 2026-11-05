import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";
import styles from "./Button.module.css";

// Mewarisi SEMUA atribut tombol bawaan (onClick, disabled, type, dst) + varian milik kita
type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "danger";
  ukuran?: "sm" | "md";
};

export default function Button({
  variant = "primary",
  ukuran = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button" // bawaan aman: tidak otomatis men-submit form
      className={cx(styles.button, styles[variant], styles[ukuran], className)}
      {...rest} // rest di akhir: pemakai boleh menimpa (mis. type="submit")
    >
      {children}
    </button>
  );
}
