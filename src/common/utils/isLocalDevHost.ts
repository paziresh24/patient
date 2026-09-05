const LOCAL_DEV_HOSTS = new Set(['localhost', '127.0.0.1', 'local.paziresh24.com']);

export const isLocalDevHost = (hostname?: string) => {
  if (typeof window === 'undefined') {
    return LOCAL_DEV_HOSTS.has(hostname ?? '');
  }

  return LOCAL_DEV_HOSTS.has(window.location.hostname);
};
