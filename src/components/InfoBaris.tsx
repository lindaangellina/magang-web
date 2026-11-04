interface InfoBarisProps {
  label: string;
  nilai: string | number;
}

export default function InfoBaris({ label, nilai }: InfoBarisProps) {
  return (
    <p className="info-baris">
      <span className="info-label">{label}:</span> {nilai}
    </p>
  );
}