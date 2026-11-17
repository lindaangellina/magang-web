/// <reference types="vite/client" />

// Beri tahu TypeScript variabel environment yang kita pakai.
// Nilainya DITANAM ke bundle saat build dan bisa dibaca siapa pun: jangan isi rahasia.
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
