import Badge from "../ui/Badge";
import type { StatusReview } from "../../types/jurnal";

const label: Record<StatusReview, string> = {
  belum: "Belum direview",
  sudah: "Sudah direview",
};

const variasi: Record<StatusReview, "netral" | "sukses"> = {
  belum: "netral",
  sudah: "sukses",
};

export default function StatusBadge({ status }: { status: StatusReview }) {
  return <Badge variasi={variasi[status]}>{label[status]}</Badge>;
}
