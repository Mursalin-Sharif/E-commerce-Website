import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import LandingPage from "./pages/LandingPage";
import ProductPage from "./pages/ProductPage";
import ReviewPage from "./pages/ReviewPage";
import CartPage from "./pages/CartPage";
import StaticPage from "./pages/StaticPage";
import AdminPage from "./pages/AdminPage";
import SellerPage from "./pages/SellerPage";
import ContactPage from "./pages/ContactPage";
import CatalogPage from "./pages/CatalogPage";
import CatalogLinksPage from "./pages/CatalogLinksPage";

export default function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/seller" element={<SellerPage />} />
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="search" element={<SearchPage mode="search" />} />
              <Route path="catalog" element={<CatalogPage />} />
              <Route path="catalog-links" element={<CatalogLinksPage />} />
              <Route path="bike-stickers" element={<SearchPage mode="bike-stickers" />} />
              <Route path="bike-sticker-paper-full-body-black" element={<SearchPage mode="bike-sticker-paper-black" />} />
              <Route path="shoes-for-men" element={<SearchPage mode="shoes-for-men" />} />
              <Route path="shoes-for-men-high-quality" element={<SearchPage mode="shoes-for-men-high-quality" />} />
              <Route path="shoes-for-girls" element={<SearchPage mode="shoes-for-girls" />} />
              <Route path="shoes-for-girls-sneakers" element={<SearchPage mode="shoes-for-girls-sneakers" />} />
              <Route path="shoes-for-girls-sneakers-black" element={<SearchPage mode="shoes-for-girls-sneakers-black" />} />
              <Route path="shoes-for-girls-sneakers-black-and-white" element={<SearchPage mode="shoes-for-girls-sneakers-black-and-white" />} />
              <Route path="landing" element={<LandingPage />} />
              <Route path="headphone" element={<SearchPage mode="headphone" />} />
              <Route path="tshirt" element={<SearchPage mode="tshirt" />} />
              <Route path="watch" element={<SearchPage mode="watch" />} />
              <Route path="smartwatch" element={<SearchPage mode="smartwatch" />} />
              <Route path="bra" element={<SearchPage mode="bra" />} />
              <Route path="brazil-jersey" element={<SearchPage mode="brazil-jersey" />} />
              <Route path="argentina-jersey" element={<SearchPage mode="argentina-jersey" />} />
              <Route path="portugal-jersey" element={<SearchPage mode="portugal-jersey" />} />
              <Route path="spin-jersey" element={<SearchPage mode="spin-jersey" />} />
              <Route path="product/:id" element={<ProductPage />} />
              <Route path="review" element={<ReviewPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="services" element={<StaticPage title="Services">Services page.</StaticPage>} />
              <Route path="privacy" element={<StaticPage title="Privacy Policy">Privacy policy.</StaticPage>} />
              <Route path="help" element={<StaticPage title="Help">Help center.</StaticPage>} />
              <Route path="cart" element={<CartPage />} />
              <Route path="login" element={<StaticPage title="Login">Login page.</StaticPage>} />
              <Route path="signup" element={<StaticPage title="Sign Up">Sign up page.</StaticPage>} />
              <Route path="category" element={<SearchPage mode="home" />} />
            </Route>
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </StoreProvider>
  );
}