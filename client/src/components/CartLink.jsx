import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";

export default function CartLink() {
  const { settings, lang } = useStore();
  const { count } = useCart();
  const cart = settings.cart || {};

  if (cart.enabled === false) return null;

  const aria =
    lang === "bn" ? cart.ariaLabelBn || cart.ariaLabel || "কার্ট" : cart.ariaLabel || "Cart";
  const showBadge = cart.showBadge !== false;

  return (
    <Link className="cart-link" to={cart.linkPath || "/cart"} aria-label={aria}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="20" r="1.2" fill="currentColor" />
        <circle cx="18" cy="20" r="1.2" fill="currentColor" />
      </svg>
      {showBadge ? (
        <span className="cart-badge" hidden={count === 0}>
          {count}
        </span>
      ) : null}
    </Link>
  );
}
