import Badge from "../ui/Badge";
import type { StatusReview } from "../../types/jurnal";

const label: Record<StatusReview, string> = {
  belum: "Belum direview",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
};

const variasi = {
  belum: "netral",
  disetujui: "sukses",
  ditolak: "bahaya",
} as const;

export default function StatusBadge({ status }: { status: StatusReview }) {
  return <Badge variasi={variasi[status]}>{label[status]}</Badge>;
}
