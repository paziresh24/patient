export const openGoogleMap = ({ lat, lon }: { lat: number; lon: number }) => window.open(`https://nshn.ir/?lat=${lat}&lng=${lon}`);
