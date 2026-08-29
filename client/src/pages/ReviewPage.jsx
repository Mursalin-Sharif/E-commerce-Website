import { useStore } from "../context/StoreContext";

export default function ReviewPage() {
  const { reviews, lang } = useStore();
  const grouped = reviews.reduce((acc, r) => {
    const key = lang === "bn" ? r.categoryBn || r.category : r.category || "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return (
    <section className="reviews-page" style={{ background: "#002238", minHeight: "60vh", padding: "2rem 0" }}>
      <div className="container">
        <h1 style={{ color: "#fff" }}>{lang === "bn" ? "কাস্টমার রিভিউ" : "Customer Reviews"}</h1>
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} style={{ marginTop: "1.5rem" }}>
            <h2 style={{ color: "#f85606" }}>{cat}</h2>
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))" }}>
              {items.map((r, i) => (
                <article key={i} style={{ background: "#0a334d", color: "#e8eef5", padding: "1rem", borderRadius: 8 }}>
                  <strong>{r.name}</strong>
                  <p>{"★".repeat(r.rating || 5)}</p>
                  <p>{lang === "bn" ? r.textBn || r.text : r.text}</p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
