export default function AdminDashboard() {
  return (
    <main
      style={{
        minHeight: "calc(100vh - 32px)",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "720px",
          textAlign: "center",
          padding: "48px 24px",
          borderRadius: "24px",
          border: "1px solid var(--admin-border-muted)",
          background: "var(--admin-bg-surface)",
          boxShadow: "var(--admin-shadow-xs)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--admin-accent)",
          }}
        >
          Admin Page
        </p>
        <h1
          style={{
            margin: "14px 0 0",
            fontSize: "clamp(28px, 5vw, 44px)",
            lineHeight: 1.1,
            color: "var(--admin-text)",
          }}
        >
          This page is not ready
        </h1>
        <p
          style={{
            margin: "12px 0 0",
            fontSize: "14px",
            lineHeight: 1.7,
            color: "var(--admin-text-muted)",
          }}
        >
          The admin dashboard template is in place, but this section is still under development.
        </p>
      </section>
    </main>
  );
}
