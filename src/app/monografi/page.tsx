'use client';

import React, { useEffect } from 'react';
import LandingPage from '@/app/page';

export default function MonografiPage() {
  useEffect(() => {
    // Automatically smooth-scroll to integrated monografi section on load
    const timer = setTimeout(() => {
      const el = document.getElementById('monografi-wilayah');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return <LandingPage />;
}
