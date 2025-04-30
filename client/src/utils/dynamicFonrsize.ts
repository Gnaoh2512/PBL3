export function dynamicFontSize() {
  const updateFontSize = () => {
    const baseMobileWidth = 375;
    const baseDesktopHeight = 981;

    const isMobile = window.innerWidth < window.innerHeight;
    const multiplier = isMobile ? window.innerWidth / baseMobileWidth : window.innerHeight / baseDesktopHeight;

    const newFontSize = isMobile ? 9 * multiplier : 16 * multiplier;
    document.documentElement.style.fontSize = `${newFontSize}px`;
  };

  updateFontSize();

  window.addEventListener("resize", updateFontSize);

  return () => window.removeEventListener("resize", updateFontSize);
}
