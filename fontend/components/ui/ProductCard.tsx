import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  id: string;
  name: string;
  image: string;
  href?: string;
  price: number | string;
  discount?: number;
  badge?: string;
  emoji?: string;
  onAddToCart?: () => void;
  compact?: boolean;
};

export default function ProductCard({ id, name, image, href = `/products/${id}`, price, discount, badge, emoji, onAddToCart, compact = false }: ProductCardProps) {
  const numericPrice = typeof price === "number" ? price : Number(price.replace(/[^0-9.]/g, ""));
  const salePrice = discount ? numericPrice * (1 - discount) : undefined;
  return (
    <Link href={href} style={{ textDecoration: "none", flex: "0 0 auto" }}>
      <article id={`product-${id}`} style={{ minWidth: compact ? "200px" : undefined, background: "white", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-card)", overflow: "hidden", position: "relative" }}>
        {badge && <span style={{ position: "absolute", top: "10px", left: "10px", zIndex: 1, background: "var(--color-green-dark)", color: "white", fontFamily: "Poppins", fontSize: "11px", padding: "3px 10px", borderRadius: "var(--radius-full)" }}>{badge}</span>}
        <div style={{ height: compact ? "120px" : "150px", position: "relative", background: "var(--color-bg-secondary)" }}>
          <Image src={image} alt={name} fill sizes={compact ? "200px" : "(max-width:768px) 50vw, 200px"} style={{ objectFit: "cover" }} />
        </div>
        <div style={{ padding: compact ? "10px" : "14px 16px", textAlign: compact ? "center" : undefined }}>
          {emoji && <div style={{ fontSize: "22px", marginBottom: "6px" }}>{emoji}</div>}
          <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: compact ? "14px" : "14px", color: "var(--color-text-primary)", marginBottom: "6px" }}>{name}</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            {salePrice && <span style={{ textDecoration: "line-through", color: "#9B9B9B", fontSize: "13px" }}>${numericPrice.toFixed(2)}</span>}
            <span style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-green-dark)" }}>${(salePrice ?? numericPrice).toFixed(2)}</span>
            {onAddToCart && <button onClick={(event) => { event.preventDefault(); onAddToCart(); }} aria-label={`Add ${name} to cart`} style={{ background: "var(--color-green-dark)", color: "white", border: "none", padding: compact ? "8px 14px" : "6px 10px", borderRadius: "999px", cursor: "pointer" }}>{compact ? "+ Add to Cart" : "+"}</button>}
          </div>
        </div>
      </article>
    </Link>
  );
}
