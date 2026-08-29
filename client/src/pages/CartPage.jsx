import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import {
  getProductById,
  productLabel,
  productImageUrl,
  searchFormatBdt,
  searchSalePrice,
} from "../utils/storeUtils";

export default function CartPage() {
  const { products, settings, lang } = useStore();
  const { items, removeFromCart, setCartQty } = useCart();
  const cartSettings = settings.cart || {};
  const title = lang === "bn" ? cartSettings.titleBn || "আপনার কার্ট" : cartSettings.title || "Your cart";
  const emptyMsg =
    lang === "bn" ? cartSettings.emptyMessageBn || "আপনার কার্ট খালি।" : cartSettings.emptyMessage || "Your cart is empty.";
  const continueLabel =
    lang === "bn" ? cartSettings.continueLabelBn || "কেনাকাটা চালিয়ে যান" : cartSettings.continueLabel || "Continue shopping";
  const continuePath = cartSettings.continueShoppingPath || "/";
  const checkoutEnabled = cartSettings.checkoutEnabled !== false;
  const checkoutLabel =
    lang === "bn" ? cartSettings.checkoutLabelBn || "চেকআউট করুন" : cartSettings.checkoutLabel || "Proceed to checkout";

  const lines = items
    .map((item) => {
      const product = getProductById(products, item.id);
      if (!product) return null;
      const sale = searchSalePrice(product);
      return { item, product, sale, lineTotal: sale * item.qty };
    })
    .filter(Boolean);

  const total = lines.reduce((sum, line) => sum + line.lineTotal, 0);

  return (
    <div className="container content-card" style={{ padding: "2rem", marginTop: "1.5rem" }}>
      <h1 className="page-title">{title}</h1>
      <div className="cart-panel" style={{ maxWidth: "100%" }}>
        {!lines.length ? (
          <p className="empty-state">{emptyMsg}</p>
        ) : (
          <>
            {lines.map(({ item, product, sale, lineTotal }) => (
              <div className="cart-item" key={item.id}>
                <div
                  className="cart-item__thumb"
                  style={{ backgroundImage: `url(${productImageUrl(product)})`, backgroundSize: "cover", backgroundPosition: "center" }}
                />
                <div>
                  <p className="cart-item__name">
                    <Link to={`/product/${encodeURIComponent(product.id)}`}>{productLabel(product, lang)}</Link>
                  </p>
                  <p className="cart-item__meta">
                    {searchFormatBdt(sale)} · {searchFormatBdt(lineTotal)}
                  </p>
                </div>
                <div className="cart-item__actions">
                  <label>
                    <span>{lang === "bn" ? "পরিমাণ" : "Qty"}</span>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => setCartQty(item.id, e.target.value)}
                    />
                  </label>
                  <button type="button" className="header__btn remove-btn" onClick={() => removeFromCart(item.id)}>
                    {lang === "bn" ? "সরান" : "Remove"}
                  </button>
                </div>
              </div>
            ))}
            <div className="cart-total">
              <span>{lang === "bn" ? "মোট" : "Total"}</span>
              <span>{searchFormatBdt(total)}</span>
            </div>
            {checkoutEnabled ? (
              <p style={{ marginTop: "1rem" }}>
                <button type="button" className="btn btn--primary">
                  {checkoutLabel}
                </button>
              </p>
            ) : null}
          </>
        )}
      </div>
      <p style={{ marginTop: "1.25rem" }}>
        <Link className="btn btn--ghost" to={continuePath}>
          {continueLabel}
        </Link>
      </p>
    </div>
  );
}
