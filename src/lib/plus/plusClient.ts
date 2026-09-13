import getConfig from "next/config";

type PlusSdk = {
  init: (config: {
    baseUrl: string;
    getUserId: () => string | Promise<string | null>;
    getUserName?: () => string | undefined;
    mode?: string;
    paymentReturnUrl?: string;
  }) => void;
  resumeIfNeeded: () => Promise<unknown>;
};

declare global {
  interface Window {
    plus?: PlusSdk;
  }
}

const { publicRuntimeConfig } = getConfig();

const PLUS_BASE_URL =
  process.env.NEXT_PUBLIC_PLUS_API_BASE?.trim() || "https://plus.paziresh24.com";

const PLUS_SDK_URL =
  process.env.NEXT_PUBLIC_PLUS_SDK_URL?.trim() ||
  `${PLUS_BASE_URL.replace(/\/$/, "")}/sdk/plus.js?v=sheet-54-iframe-host`;

const AUTH_ME_URL = `${publicRuntimeConfig.API_GATEWAY_BASE_URL}/v1/auth/me`;

let sdkLoadPromise: Promise<PlusSdk> | null = null;
let initPromise: Promise<PlusSdk> | null = null;

async function loadPlusSdk(): Promise<PlusSdk> {
  if (typeof window === "undefined") {
    throw new Error("Plus SDK is browser-only");
  }
  if (window.plus) return window.plus;
  if (sdkLoadPromise) return sdkLoadPromise;

  sdkLoadPromise = new Promise<PlusSdk>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-plus-sdk="true"]'
    );
    if (existing) {
      existing.addEventListener("load", () => {
        if (window.plus) resolve(window.plus);
        else reject(new Error("Plus SDK loaded without window.plus"));
      });
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Plus SDK"))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = PLUS_SDK_URL;
    script.async = true;
    script.dataset.plusSdk = "true";
    script.onload = () => {
      if (window.plus) resolve(window.plus);
      else reject(new Error("Plus SDK loaded without window.plus"));
    };
    script.onerror = () => reject(new Error("Failed to load Plus SDK"));
    document.head.appendChild(script);
  }).catch(error => {
    sdkLoadPromise = null;
    throw error;
  });

  return sdkLoadPromise;
}

async function resolveUserId(): Promise<string | null> {
  try {
    const response = await fetch(AUTH_ME_URL, {
      credentials: "include",
      headers: { Accept: "application/json" }
    });
    if (!response.ok) return null;
    const payload = await response.json();
    const id = payload?.id ?? payload?.user_id ?? payload?.user?.id ?? null;
    return id == null ? null : String(id);
  } catch {
    return null;
  }
}

/** Always load the script so iframe children can detect a Plus-capable parent. */
export async function ensurePlusSdkLoaded(): Promise<PlusSdk> {
  return loadPlusSdk();
}

/**
 * Init as early as possible (not only after zustand isLogin).
 * Host-query must succeed before Nelson's first upgrade click.
 */
export async function ensurePlusHostReady(): Promise<PlusSdk> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const sdk = await loadPlusSdk();
    const base = PLUS_BASE_URL.replace(/\/$/, "");
    sdk.init({
      baseUrl: base,
      mode: "live",
      paymentReturnUrl: `${base}/payment/return`,
      getUserId: resolveUserId
    });
    try {
      await sdk.resumeIfNeeded();
    } catch {
      /* ignore resume errors on boot */
    }
    return sdk;
  })().catch(error => {
    initPromise = null;
    throw error;
  });

  return initPromise;
}
