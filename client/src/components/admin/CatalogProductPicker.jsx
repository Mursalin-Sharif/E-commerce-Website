import { useMemo, useState } from "react";
import { defaultCatalogProductIds, matchesCatalogProduct } from "../../utils/adminCatalogFilters";

export default function CatalogProductPicker({ kind, products = [], selectedIds = [], onChange, hint }) {
  const [showAll, setShowAll] = useState(false);
  const activeProducts = useMemo(() => products.filter((p) => p.active !== false), [products]);
  const defaults = useMemo(() => defaultCatalogProductIds(kind, activeProducts), [kind, activeProducts]);
  const visibleProducts = useMemo(() => {
    if (showAll) return activeProducts;
    return activeProducts.filter((p) => matchesCatalogProduct(kind, p, selectedIds));
  }, [activeProducts, kind, selectedIds, showAll]);

  return (
    <>
      <p style={{ color: "#757575", fontSize: "0.85rem", margin: "0 0 8px" }}>
        {hint || "Matching products only — wrong items hide korte “Show matching only” use korun."}
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10, alignItems: "center" }}>
        <button type="button" className="admin-panel__ghost-btn" onClick={() => onChange(defaults)}>
          Load defaults ({defaults.length})
        </button>
        <button type="button" className="admin-panel__ghost-btn" onClick={() => onChange([])}>
          Clear
        </button>
        <button type="button" className="admin-panel__ghost-btn" onClick={() => setShowAll((v) => !v)}>
          {showAll ? "Show matching only" : `Show all products (${activeProducts.length})`}
        </button>
        <span style={{ fontSize: "0.85rem", color: "#616161" }}>{selectedIds.length} selected</span>
      </div>
      <div className="check-grid">
        {visibleProducts.map((p) => (
          <label key={`${kind}-${p.id}`}>
            <input
              type="checkbox"
              checked={selectedIds.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(selectedIds);
                if (e.target.checked) ids.add(p.id);
                else ids.delete(p.id);
                onChange([...ids]);
              }}
            />
            {p.name}
          </label>
        ))}
      </div>
      {!visibleProducts.length ? <p style={{ color: "#757575", fontSize: "0.85rem" }}>No matching products. Try “Show all products”.</p> : null}
    </>
  );
}
