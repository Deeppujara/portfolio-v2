// Simple GA wrapper. Assumes the GA script tag is present in <head>.
export function initAnalytics(measurementId) {
  if (!measurementId) return;

  // Bootstrap the dataLayer/gtag shim immediately
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // Mark session start + configure
  window.gtag('js', new Date());
  window.gtag('config', measurementId);
}
