export function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
// formatTanggal("2026-10-28T03:15:00.000Z") menghasilkan "28 Oktober 2026"