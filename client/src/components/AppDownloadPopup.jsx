import { useEffect, useRef, useState } from "react";
import { useStore } from "../context/StoreContext";

function qrImageUrl(appDownload) {
  if (appDownload.qrCodeUrl) return appDownload.qrCodeUrl;
  const data = appDownload.downloadUrl || appDownload.playStoreHref || "https://www.daraz.com.bd";
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
}

export default function AppDownloadPopup({ link, lang }) {
  const { settings } = useStore();
  const appDownload = { ...(settings.topBar?.appDownload || {}), ...(settings.appDownload || {}) };
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (appDownload.enabled === false) {
    return (
      <span className="top-links__item top-action-download__trigger">
        {lang === "bn" ? link.labelBn || link.label : link.label}
      </span>
    );
  }

  const title = lang === "bn" ? appDownload.titleBn || "অ্যাপ ডাউনলোড করুন" : appDownload.title || "Download the App";
  const appStoreHref = appDownload.appStoreHref || "#";
  const playStoreHref = appDownload.playStoreHref || appDownload.downloadUrl || "#";
  const appStoreImg = appDownload.appStoreImage || "/assets/payments/appstore.svg";
  const playStoreImg = appDownload.playStoreImage || "/assets/payments/playstore.svg";

  return (
    <div
      ref={rootRef}
      className="top-action-download"
      id="topActionDownload"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`top-links__item top-action-download__trigger${open ? " is-open" : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {lang === "bn" ? link.labelBn || link.label : link.label}
      </button>
      {open ? (
        <div className="lzd-download-popup" id="lzdDownloadPopup" role="dialog" aria-label={title}>
          <div className="top-popup-content lzd-download-content">
            <div className="get-the-app-scope">
              <div className="get-the-app">
                <h3 className="get-the-app__title">{title}</h3>
                <div className="get-the-app__body">
                  <div className="get-the-app__qr">
                    <img src={qrImageUrl(appDownload)} alt="App download QR code" width="200" height="200" />
                  </div>
                  <div className="get-the-app__stores">
                    <a className="get-the-app__store" href={appStoreHref} target="_blank" rel="noreferrer">
                      <img src={appStoreImg} alt="Download on the App Store" />
                    </a>
                    <a className="get-the-app__store" href={playStoreHref} target="_blank" rel="noreferrer">
                      <img src={playStoreImg} alt="Get it on Google Play" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
