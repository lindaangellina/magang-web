import type { ReactNode } from "react";

interface KartuProps {
  judul: string;
  children: ReactNode; // apa pun yang bisa dirender: teks, elemen, array, null
}

export default function Kartu({ judul, children }: KartuProps) {
  return (
    <section className="kartu">
      <h2>{judul}</h2>
      <div>{children}</div>
    </section>
  );
}