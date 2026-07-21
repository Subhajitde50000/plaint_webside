import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = { id: string; label: string; image: string; emoji?: string };

export default function CategoryCard({ id, label, image, emoji }: CategoryCardProps) {
  return (
    <Link href={`/plants/${id}`} style={{ textDecoration: "none", flex: "0 0 auto" }}>
      <article id={`cat-card-${id}`} style={{ minWidth: "280px", maxWidth: "300px", background: "var(--color-white)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-card)", overflow: "hidden", scrollSnapAlign: "start", transition: "transform 0.25s ease, box-shadow 0.25s ease" }}>
        <div style={{ height: "260px", overflow: "hidden", position: "relative" }}>
          <Image src={image} alt={label} fill sizes="300px" style={{ objectFit: "cover" }} />
        </div>
        <div style={{ padding: "20px", textAlign: "center" }}>
          {emoji && <div style={{ fontSize: "28px", marginBottom: "8px" }}>{emoji}</div>}
          <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "18px", color: "var(--color-text-primary)", marginBottom: "6px" }}>{label}</h3>
          <span style={{ fontSize: "13px", color: "var(--color-text-secondary)", fontFamily: "DM Sans" }}>Shop Collection →</span>
        </div>
      </article>
    </Link>
  );
}
