import { IncomingHttpHeaders } from 'http';

export type HeaderBag = Headers | IncomingHttpHeaders;

const readHeader = (headers: HeaderBag, key: string): string => {
  if (typeof (headers as Headers).get === 'function') {
    return (headers as Headers).get(key) ?? '';
  }

  const value = (headers as IncomingHttpHeaders)[key];
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
};

export function getHost(headers: HeaderBag) {
  const forwardedHost = readHeader(headers, 'x-forwarded-host');
  const host =
    forwardedHost && forwardedHost.trim() !== ''
      ? forwardedHost.split(',')[0].trim()
      : readHeader(headers, 'host');

  return host;
}