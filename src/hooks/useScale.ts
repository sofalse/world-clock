'use client';
import { useEffect } from 'react';

export function useScale(rootId: string) {
  useEffect(() => {
    function rescale() {
      const root = document.getElementById(rootId);
      if (!root) return;
      root.style.transform = 'none';
      const W = root.offsetWidth;
      const H = root.offsetHeight;
      const scaleX = window.innerWidth / W;
      const scaleY = window.innerHeight / H;
      const scale = Math.min(scaleX, scaleY) * 0.95;
      root.style.transform = `scale(${scale})`;
    }
    const t = setTimeout(rescale, 100);
    window.addEventListener('resize', rescale);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', rescale);
    };
  }, [rootId]);
}
