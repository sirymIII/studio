'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';

/**
 * A client component that safely applies a class to the body tag
 * only after the initial render to avoid hydration mismatches.
 */
export function BodyClassManager() {
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (isMobile) {
        document.body.classList.add('mobile_mode');
      } else {
        document.body.classList.remove('mobile_mode');
      }
    }
  }, [isMobile, isMounted]);

  // This component doesn't render anything itself.
  return null;
}
