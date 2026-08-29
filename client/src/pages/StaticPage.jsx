export default function StaticPage({ title, children }) {
  return (
    <div className="container content-card" style={{ padding: "2rem", margin: "2rem auto" }}>
      <h1 className="page-title">{title}</h1>
      <div className="page-lead">{children}</div>
    </div>
  );
}
