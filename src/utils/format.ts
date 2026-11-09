// timeZone dikunci ke WIB supaya tanggalnya sama untuk siapa pun yang membuka halaman
export function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}
// formatTanggal("2026-10-28T03:15:00.000Z") menghasilkan "28 Oktober 2026"
