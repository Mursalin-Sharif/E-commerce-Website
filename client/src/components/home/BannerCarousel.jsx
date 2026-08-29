import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { bannerField, normalizeBannerHref } from "../../utils/bannerUtils";

function ThemeArt({ theme }) {
  if (theme === "delivery") {
    return (
      <>
        <div className="art-road" />
        <div className="art-scooter" />
        <div className="art-box art-box--1" />
        <div className="art-box art-box--2" />
        <div className="art-box art-box--3" />
      </>
    );
  }
  if (theme === "sale") return <><div className="art-gadget" /><div className="art-badge">40%</div></>;
  if (theme === "fashion") return <div className="art-hanger" />;
  if (theme === "home") return <div className="art-house" />;
  return null;
}

function BannerSlide({ banner, lang }) {
  const href = normalizeBannerHref(banner.href);
  const title = bannerField(banner, "title", lang);
  const subtitle = bannerField(banner, "subtitle", lang);
  const cta = bannerField(banner, "cta", lang) || "Shop Now";
  const badge = bannerField(banner, "badge", lang) || (banner.stats && banner.stats[0]) || "";

  if (banner.imageUrl) {
    return (
      <Link className="banner-slide banner-slide--image" to={href}>
        <img className="banner-slide__img" src={banner.imageUrl} alt={title || "Promo"} loading="eager" />
        {title || subtitle || badge ? (
          <div className="banner-slide__overlay">
            {badge ? <span className="banner-slide__badge">{badge}</span> : null}
            {title ? <h2 className="banner-slide__title">{title}</h2> : null}
            {subtitle ? <p className="banner-slide__sub">{subtitle}</p> : null}
            {cta ? <span className="banner-slide__cta">{cta}</span> : null}
          </div>
        ) : null}
      </Link>
    );
  }

  const theme = banner.theme || "delivery";
  const stats = (banner.stats || []).map((s, i) =>
    i === 1 ? <em key={i}>{s}</em> : <span key={i}>{s}</span>
  );

  return (
    <Link className={`banner-slide banner-slide--${theme}`} to={href}>
      <div className="banner-slide__copy">
        <h2 className="banner-slide__title">{title}</h2>
        <div className="banner-slide__stats">{stats}</div>
        <p className="banner-slide__sub">{subtitle}</p>
        <span className="banner-slide__cta">{cta}</span>
      </div>
      <div className={`banner-slide__art banner-slide__art--${theme}`} aria-hidden="true">
        <ThemeArt theme={theme} />
      </div>
    </Link>
  );
}

export default function BannerCarousel({ banners, lang }) {
  const active = (banners || []).filter((b) => b.active !== false);
  const sliderRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (active.length < 2) return undefined;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % active.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [active.length]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const track = slider.querySelector(".banner-slider__track");
    if (track) track.style.transform = `translateX(-${index * 100}%)`;
    slider.querySelectorAll(".banner-slider__dot").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  }, [index]);

  if (!active.length) return null;

  function goTo(i) {
    setIndex(((i % active.length) + active.length) % active.length);
  }

  return (
    <section
      ref={sliderRef}
      className="banner-slider pc-banner-slider-container"
      data-banner-slider
      aria-roledescription="carousel"
      aria-label="Promotions"
    >
      <div className="banner-slider__viewport banner-container-inner">
        <div className="banner-slider__track swiper-wrapper">
          {active.map((banner) => (
            <BannerSlide key={banner.id} banner={banner} lang={lang} />
          ))}
        </div>
      </div>
      {active.length > 1 ? (
        <>
          <button type="button" className="banner-slider__prev" aria-label="Previous slide" onClick={() => goTo(index - 1)}>
            ‹
          </button>
          <button type="button" className="banner-slider__next" aria-label="Next slide" onClick={() => goTo(index + 1)}>
            ›
          </button>
          <div className="banner-slider__dots" role="tablist" aria-label="Slide indicators">
            {active.map((banner, i) => (
              <button
                key={banner.id}
                type="button"
                className={`banner-slider__dot${i === index ? " is-active" : ""}`}
                aria-label={`Slide ${i + 1}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
