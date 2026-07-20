import type { ReactNode } from "react";

type SectionProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function Section({ title, subtitle, action, children, className }: SectionProps) {
  return (
    <section className={className}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", marginBottom: "40px" }}>
        <div>
          {subtitle && <div style={{ marginBottom: "8px" }}>{subtitle}</div>}
          <h2 className="section-title">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
