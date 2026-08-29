export function bannerField(banner, field, lang) {
  if (lang === "bn") return banner?.[`${field}Bn`] || banner?.[field] || "";
  return banner?.[field] || "";
}

export function normalizeBannerHref(href) {
  if (!href) return "/";
  return href
    .replace(/^home\.html/i, "/")
    .replace(/^index\.html/i, "/")
    .replace(/^\/home\.html/i, "/");
}
