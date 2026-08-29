function initBannerSlider(root) {
  const slider = typeof root === "string" ? document.querySelector(root) : root;
  if (!slider) return;

  if (slider._bannerCleanup) {
    slider._bannerCleanup();
    slider._bannerCleanup = null;
  }

  const track = slider.querySelector(".banner-slider__track");
  const slides = Array.from(slider.querySelectorAll(".banner-slide"));
  const dotsWrap = slider.querySelector(".banner-slider__dots");
  const prevBtn = slider.querySelector(".banner-slider__prev");
  const nextBtn = slider.querySelector(".banner-slider__next");
  if (!track || !slides.length || !dotsWrap) return;

  let index = 0;
  let timer = null;
  const delay = 4000;
  let startX = 0;
  let deltaX = 0;
  let dragging = false;

  if (slides.length < 2) {
    dotsWrap.innerHTML = `<button type="button" class="banner-slider__dot is-active" aria-label="Slide 1" data-index="0"></button>`;
    if (prevBtn) prevBtn.hidden = true;
    if (nextBtn) nextBtn.hidden = true;
    return;
  }
  dotsWrap.innerHTML = slides
    .map(
      (_, i) =>
        `<button type="button" class="banner-slider__dot${i === 0 ? " is-active" : ""}" aria-label="Slide ${i + 1}" data-index="${i}"></button>`
    )
    .join("");

  const dots = Array.from(dotsWrap.querySelectorAll(".banner-slider__dot"));

  function goTo(i, animate = true) {
    index = ((i % slides.length) + slides.length) % slides.length;
    track.style.transition = animate ? "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)" : "none";
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle("is-active", di === index));
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function stopAuto() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function schedule() {
    stopAuto();
    timer = setTimeout(() => {
      if (!dragging && !document.hidden) next();
      schedule();
    }, delay);
  }

  function startAuto() {
    schedule();
  }

  function onDotClick(e) {
    const btn = e.target.closest("[data-index]");
    if (!btn) return;
    goTo(Number(btn.dataset.index));
    startAuto();
  }

  function onPrev() {
    prev();
    startAuto();
  }

  function onNext() {
    next();
    startAuto();
  }

  function onVisibility() {
    if (document.hidden) stopAuto();
    else startAuto();
  }

  function onTouchStart(e) {
    dragging = true;
    startX = e.touches[0].clientX;
    deltaX = 0;
    stopAuto();
  }

  function onTouchMove(e) {
    if (!dragging) return;
    deltaX = e.touches[0].clientX - startX;
  }

  function onTouchEnd() {
    if (!dragging) return;
    dragging = false;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) next();
      else prev();
    }
    startAuto();
  }

  dotsWrap.addEventListener("click", onDotClick);
  if (prevBtn) prevBtn.addEventListener("click", onPrev);
  if (nextBtn) nextBtn.addEventListener("click", onNext);
  document.addEventListener("visibilitychange", onVisibility);
  track.addEventListener("touchstart", onTouchStart, { passive: true });
  track.addEventListener("touchmove", onTouchMove, { passive: true });
  track.addEventListener("touchend", onTouchEnd);

  slider._bannerCleanup = () => {
    stopAuto();
    dotsWrap.removeEventListener("click", onDotClick);
    if (prevBtn) prevBtn.removeEventListener("click", onPrev);
    if (nextBtn) nextBtn.removeEventListener("click", onNext);
    document.removeEventListener("visibilitychange", onVisibility);
    track.removeEventListener("touchstart", onTouchStart);
    track.removeEventListener("touchmove", onTouchMove);
    track.removeEventListener("touchend", onTouchEnd);
  };

  goTo(0, false);
  startAuto();
}
