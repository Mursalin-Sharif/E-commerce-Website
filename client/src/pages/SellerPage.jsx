import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import SellerCenterHeader from "../components/seller/SellerCenterHeader";

export default function SellerPage() {
  const { settings, lang, setLang, loading } = useStore();
  const seller = settings.seller || {};
  const [country, setCountry] = useState(seller.defaultCountry || "bd");

  if (loading) {
    return <div className="daraz-theme seller-theme" style={{ padding: "3rem", textAlign: "center" }}>Loading…</div>;
  }

  const heroTitle = lang === "bn" ? seller.heroTitleBn || seller.heroTitle : seller.heroTitle || "Start Selling on Daraz";
  const heroSubtitle =
    lang === "bn" ? seller.heroSubtitleBn || seller.heroSubtitle : seller.heroSubtitle || "Reach millions of customers across Bangladesh.";
  const ctaText = lang === "bn" ? seller.ctaTextBn || seller.ctaText : seller.ctaText || "Register Now";
  const ctaHref = seller.ctaHref || "#seller-register";
  const features = (lang === "bn" ? seller.featuresBn : seller.features) || seller.features || [
    "Zero listing fee to get started",
    "Nationwide delivery support",
    "Seller dashboard & analytics",
    "Secure payments & easy payouts",
  ];
  const steps = (lang === "bn" ? seller.stepsBn : seller.steps) || seller.steps || [
    "Create your seller account",
    "Add products with photos & prices",
    "Start receiving orders",
  ];

  return (
    <div className="daraz-theme seller-theme">
      <div className="page-header">
        <SellerCenterHeader
          seller={seller}
          lang={lang}
          setLang={setLang}
          country={country}
          setCountry={setCountry}
        />
      </div>
      <main className="seller-page">
        <section className="seller-hero">
          <div className="seller-hero__inner">
            <div className="seller-hero__copy">
              <h1>{heroTitle}</h1>
              <p>{heroSubtitle}</p>
              <a className="seller-hero__cta" href={ctaHref}>
                {ctaText}
              </a>
              <p className="seller-hero__back">
                <Link to="/">← Back to store</Link>
              </p>
            </div>
            {seller.heroImageUrl ? (
              <div className="seller-hero__visual">
                <img src={seller.heroImageUrl} alt="" />
              </div>
            ) : null}
          </div>
        </section>

        <section className="seller-section">
          <div className="seller-section__inner">
            <h2>{lang === "bn" ? seller.featuresTitleBn || "কেন Daraz-এ বিক্রি করবেন" : seller.featuresTitle || "Why sell on Daraz"}</h2>
            <ul className="seller-features">
              {features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="seller-section seller-section--muted" id="seller-register">
          <div className="seller-section__inner">
            <h2>{lang === "bn" ? seller.stepsTitleBn || "কীভাবে শুরু করবেন" : seller.stepsTitle || "How to get started"}</h2>
            <ol className="seller-steps">
              {steps.map((step, i) => (
                <li key={step}>
                  <span className="seller-steps__num">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <form className="seller-form" onSubmit={(e) => e.preventDefault()}>
              <h3>{lang === "bn" ? seller.formTitleBn || "সেলার রেজিস্ট্রেশন" : seller.formTitle || "Seller registration"}</h3>
              <label>
                {lang === "bn" ? "দোকানের নাম" : "Shop name"}
                <input type="text" placeholder={lang === "bn" ? "আপনার দোকান" : "Your shop name"} />
              </label>
              <label>
                {lang === "bn" ? "মোবাইল নম্বর" : "Mobile number"}
                <input type="tel" placeholder="01XXXXXXXXX" />
              </label>
              <label>
                Email
                <input type="email" placeholder="seller@example.com" />
              </label>
              <button type="submit" className="seller-form__submit">
                {ctaText}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
