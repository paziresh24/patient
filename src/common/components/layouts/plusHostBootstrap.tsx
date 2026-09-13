import { ensurePlusHostReady } from '../../../lib/plus/plusClient';
import { useEffect } from "react";

/**
 * Boots Plus on every Patient page as early as possible so Nelson iframes
 * get plus:host-ready before the first upgrade click (avoids child+parent double sheets).
 */
const PlusHostBootstrap = () => {
  useEffect(() => {
    void ensurePlusHostReady().catch(() => {
      /* non-fatal: iframe falls back to local sheet */
    });
  }, []);

  return null;
};

export default PlusHostBootstrap;
