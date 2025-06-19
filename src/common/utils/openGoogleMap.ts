export const openGoogleMap = ({ lat, lon }: { lat: number; lon: number }) =>
  window.open(`https://maps.google.com/maps?daddr=${lat},${lon}&amp;ll=&openInBrowser=1`);
