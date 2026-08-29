import { Link } from "react-router-dom";
import { categoryLabel } from "../../utils/storeUtils";

export default function CategoryStrip({ icons, categories, lang }) {
  const items = icons?.length
    ? icons.map((icon) => ({
        key: icon.id || icon.categoryId,
        href: icon.categoryId ? `/?cat=${encodeURIComponent(icon.categoryId)}` : "/",
        icon: icon.icon || "🛍️",
        label: lang === "bn" ? icon.labelBn || icon.label : icon.label,
      }))
    : categories.slice(0, 12).map((c) => ({
        key: c.id,
        href: `/?cat=${encodeURIComponent(c.id)}`,
        icon: "🛍️",
        label: categoryLabel(c, lang),
      }));

  if (!items.length) return null;

  return (
    <section className="category-strip" aria-label="Categories">
      <div className="category-strip__row">
        {items.map((item) => (
          <Link key={item.key} className="category-strip__item" to={item.href}>
            <span className="category-strip__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="category-strip__label">{item.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
