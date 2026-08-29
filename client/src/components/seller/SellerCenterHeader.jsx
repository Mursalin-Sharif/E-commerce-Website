import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

function flagUrl(code) {
  if (!code) return "";
  return `https://flagcdn.com/w20/${String(code).toLowerCase()}.png`;
}

export default function SellerCenterHeader({ seller, lang, setLang, country, setCountry }) {
  const countries = seller.countries?.length
    ? seller.countries
    : [{ id: "bd", name: "Bangladesh", nameBn: "বাংলাদেশ", flagCode: "bd" }];
  const languages = seller.languages?.length
    ? seller.languages
    : [
        { id: "en", label: "English" },
        { id: "bn", label: "Bangla", labelBn: "বাংলা" },
      ];

  const activeCountry = countries.find((c) => c.id === country) || countries[0];
  const brand =
    lang === "bn" ? seller.brandNameBn || seller.brandName || "Daraz Seller Center" : seller.brandName || "Daraz Seller Center";

  return (
    <div className="header-center-daraz header-center">
      <Link className="seller-center__brand" to="/seller">
        {seller.logoUrl ? (
          <img src={seller.logoUrl} alt={brand} className="seller-center__logo" />
        ) : (
          <span className="seller-center__mark" aria-hidden="true">
            <span />
            <span />
          </span>
        )}
        <span className="seller-center__brand-text">{brand}</span>
      </Link>
      <div className="seller-center__selectors">
        <label className="seller-center__select-wrap">
          <span className="sr-only">Country</span>
          {activeCountry?.flagCode ? (
            <img src={flagUrl(activeCountry.flagCode)} alt="" className="seller-center__flag" width="20" height="15" />
          ) : null}
          <select
            className="seller-center__select"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {lang === "bn" ? c.nameBn || c.name : c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="seller-center__select-wrap">
          <span className="sr-only">Language</span>
          <select
            className="seller-center__select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            {languages.map((l) => (
              <option key={l.id} value={l.id}>
                {lang === "bn" ? l.labelBn || l.label : l.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
