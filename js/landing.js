function youtubeEmbedUrl(url, { autoplay = false, mute = false } = {}) {
  if (!url) return "";
  const raw = String(url).trim();
  let id = "";
  if (/youtube\.com\/embed\//i.test(raw)) {
    id = (raw.match(/embed\/([\w-]{6,})/) || [])[1] || "";
  } else {
    const watch = raw.match(/[?&]v=([\w-]{6,})/);
    if (watch) id = watch[1];
    const short = raw.match(/youtu\.be\/([\w-]{6,})/);
    if (short) id = short[1];
    const shorts = raw.match(/youtube\.com\/shorts\/([\w-]{6,})/);
    if (shorts) id = shorts[1];
  }
  if (!id) return "";
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: mute ? "1" : "0",
    playsinline: "1",
    rel: "0",
    controls: "1",
    modestbranding: "1",
    enablejsapi: "1",
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

function defaultLandingDemos() {
  return [
    {
      id: "demo-clinic",
      imageUrl:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
      title: "ক্লিনিক ও হেলথকেয়ার ডেমো",
      titleEn: "Clinic & Healthcare Demo",
      videoUrl: "https://www.youtube.com/watch?v=F5_Iw-Adysg",
      adminUser: "clinic-admin",
      adminPass: "secure-demo",
      liveDemoUrl: "home.html",
      liveDemoText: "লাইভ ডেমো দেখুন",
      liveDemoTextEn: "View live demo",
      waText: "৫ মিনিট ফ্রি WhatsApp কল — এখনই কথা বলুন",
      waTextEn: "5-min free WhatsApp call — talk now",
      waMessage: "Hi, I want a free 5-minute call about the Clinic & Healthcare demo.",
      active: true,
    },
    {
      id: "demo-store",
      imageUrl:
        "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=900&q=80",
      title: "ই-কমার্স স্টোর ডেমো",
      titleEn: "E-commerce Store Demo",
      videoUrl: "https://www.youtube.com/watch?v=1--qqQrimMA",
      adminUser: "store-admin",
      adminPass: "store-pass",
      liveDemoUrl: "home.html",
      liveDemoText: "লাইভ ডেমো দেখুন",
      liveDemoTextEn: "View live demo",
      waText: "৫ মিনিট ফ্রি WhatsApp কল — এখনই কথা বলুন",
      waTextEn: "5-min free WhatsApp call — talk now",
      waMessage: "Hi, I want a free 5-minute call about the E-commerce Store demo.",
      active: true,
    },
  ];
}

function landingSettings() {
  const defaults = {
    enabled: true,
    brand: "IOTPROGRAMMERS",
    brandBn: "IOTPROGRAMMERS",
    headline: "বাংলাদেশি ব্যবসার জন্য প্রফেশনাল MERN পোর্টফোলিও ও ডেমো ওয়েবসাইট",
    headlineEn: "Professional MERN portfolio & demo websites for Bangladeshi businesses",
    body: "ল্যান্ডিং পেজ, লাইভ ডেমো কার্ড, ক্লায়েন্ট রিভিউ, ইমেজ-ভিডিও গ্যালারি ও WhatsApp লিড বাটন—সবকিছু অ্যাডমিন ড্যাশবোর্ড থেকে কন্ট্রোল করুন।",
    bodyEn: "Landing page, live demo cards, client reviews, image-video gallery and WhatsApp lead button—control everything from the admin dashboard.",
    videoUrl: "https://www.youtube.com/watch?v=IltsOcCj1Ak",
    videoFileUrl: "",
    posterImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
    ctaText: "Shop the store",
    ctaTextBn: "স্টোরে যান",
    ctaHref: "home.html",
    gallery: [],
    demos: defaultLandingDemos(),
  };
  const saved = SITE_SETTINGS.landing || {};
  const demos = Array.isArray(saved.demos) && saved.demos.length ? saved.demos : defaults.demos;
  return {
    ...defaults,
    ...saved,
    gallery: Array.isArray(saved.gallery) ? saved.gallery : [],
    demos,
  };
}

function landingDemoItems(L) {
  return (Array.isArray(L.demos) ? L.demos : []).filter((d) => d && d.active !== false && d.imageUrl);
}

function landingWaLink(message) {
  const num = typeof WHATSAPP_NUMBER !== "undefined" ? WHATSAPP_NUMBER : "8801700000000";
  const text = encodeURIComponent(message || "Hello");
  return `https://wa.me/${num}?text=${text}`;
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderLandingDemos(L, bn) {
  const demos = landingDemoItems(L);
  if (!demos.length) return "";
  return `
    <section class="landing-demos-section section-blend" aria-label="${bn ? "ডেমো শোকেস" : "Demo showcase"}">
      <div class="landing-demo-stack">
        ${demos
          .map((d, i) => {
            const title = bn ? d.title || d.titleEn : d.titleEn || d.title;
            const liveText = bn ? d.liveDemoText || d.liveDemoTextEn : d.liveDemoTextEn || d.liveDemoText;
            const waText = bn ? d.waText || d.waTextEn : d.waTextEn || d.waText;
            const liveHref = d.liveDemoUrl || "home.html";
            const videoHref = d.videoUrl || L.videoUrl || "";
            const isYt = /youtube|youtu\.be/i.test(videoHref);
            const cred =
              d.adminUser || d.adminPass
                ? `Admin: ${escapeHtml(d.adminUser || "—")} · Password: ${escapeHtml(d.adminPass || "—")}`
                : "";
            return `
          <article class="landing-demo-card" data-demo-index="${i}">
            <div class="landing-demo-card__media">
              <button type="button" class="landing-demo-card__thumb" data-demo-play="${i}" aria-label="${escapeHtml(title || "Play demo")}">
                <img src="${escapeHtml(d.imageUrl)}" alt="${escapeHtml(title || "")}" width="640" height="360" loading="lazy" decoding="async" />
                <span class="landing-demo-card__play" aria-hidden="true"></span>
              </button>
              ${isYt ? `<template data-demo-embed>${youtubeEmbedUrl(videoHref, { autoplay: true })}</template>` : ""}
            </div>
            <div class="landing-demo-card__body">
              <p class="landing-demo-card__caption">${escapeHtml(title || "")}</p>
              ${cred ? `<p class="landing-demo-card__creds">${cred}</p>` : ""}
              <div class="landing-demo-card__actions">
                <a class="landing-demo-card__btn landing-demo-card__btn--demo" href="${escapeHtml(liveHref)}">${escapeHtml(liveText || "Live demo")}</a>
                <a class="landing-demo-card__btn landing-demo-card__btn--wa" href="${landingWaLink(d.waMessage || title)}" target="_blank" rel="noopener noreferrer">${escapeHtml(waText || "WhatsApp")}</a>
              </div>
            </div>
          </article>`;
          })
          .join("")}
      </div>
    </section>
  `;
}

function bindLandingDemoPlays(root) {
  root.querySelectorAll("[data-demo-play]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".landing-demo-card");
      const tpl = card && card.querySelector("[data-demo-embed]");
      const media = card && card.querySelector(".landing-demo-card__media");
      if (!tpl || !media) return;
      const src = tpl.textContent.trim();
      if (!src) return;
      media.innerHTML = `<div class="landing-demo-card__player"><iframe src="${src}" title="Demo video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
    });
  });
}

function renderLandingIntro() {
  const root = document.getElementById("landing-intro");
  if (!root) return;

  const L = landingSettings();
  if (L.enabled === false || L.showHero === false) {
    root.innerHTML = "";
    root.hidden = true;
    return;
  }
  root.hidden = false;

  const bn = getLang() === "bn";
  const brand = bn ? L.brandBn || L.brand : L.brand;
  const headline = bn ? L.headline || L.headlineEn : L.headlineEn || L.headline;
  const body = bn ? L.body || L.bodyEn : L.bodyEn || L.body;
  const cta = bn ? L.ctaTextBn || L.ctaText : L.ctaText || L.ctaTextBn;
  const gallery = Array.isArray(L.gallery) ? L.gallery.filter((g) => g && g.imageUrl) : [];
  const embed = youtubeEmbedUrl(L.videoUrl || "https://www.youtube.com/watch?v=IltsOcCj1Ak", {
    autoplay: true,
    mute: false,
  });

  let videoHtml = "";
  if (L.videoFileUrl) {
    videoHtml = `<video class="landing-video-frame landing-video-frame--file" autoplay loop playsinline controls poster="${L.posterImage || ""}" src="${L.videoFileUrl}"></video>`;
  } else if (embed) {
    videoHtml = `<iframe class="landing-video-frame" src="${embed}" title="Landing intro video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowfullscreen loading="eager" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  } else if (L.posterImage) {
    videoHtml = `<img class="landing-video-frame landing-video-frame--img" src="${L.posterImage}" alt="" />`;
  } else {
    videoHtml = `<div class="landing-video-empty">${bn ? "অ্যাডমিন → Landing থেকে YouTube URL দিন" : "Add a YouTube URL in Admin → Landing"}</div>`;
  }

  root.innerHTML = `
    <section class="landing-intro-hero section-blend" aria-label="Landing intro">
      <div class="landing-video-wrap">
        ${videoHtml}
      </div>
      <div class="landing-intro__copy">
        <p class="landing-intro__brand">${brand || ""}</p>
        <h1 class="landing-intro__headline">${headline || ""}</h1>
        <p class="landing-intro__body">${body || ""}</p>
        <div class="landing-intro__actions">
          <a class="landing-intro__cta" href="${L.ctaHref || "home.html"}">${cta || "Shop"}</a>
          <a class="landing-intro__cta landing-intro__cta--ghost" href="review.html">${bn ? "রিভিউ দেখুন" : "See reviews"}</a>
        </div>
      </div>
      ${renderLandingDemos(L, bn)}
      ${
        gallery.length
          ? `<div class="landing-intro__gallery" aria-label="Gallery">
              ${gallery
                .map(
                  (g) => `<figure class="landing-intro__shot">
                    <img src="${g.imageUrl}" alt="${g.caption || ""}" loading="lazy" />
                    ${g.caption ? `<figcaption>${g.caption}</figcaption>` : ""}
                  </figure>`
                )
                .join("")}
            </div>`
          : ""
      }
    </section>
  `;

  bindLandingDemoPlays(root);
}

document.addEventListener("langchange", () => {
  if (document.getElementById("landing-intro")) renderLandingIntro();
});
