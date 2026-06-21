import { useState, useEffect } from 'react';

export interface WasteTip {
  title: string;
  link: string;
}

/** Simple static waste‑management tips. In a real app this could be fetched from an API. */
export const useWasteTips = () => {
  const [tips, setTips] = useState<WasteTip[]>([]);

  useEffect(() => {
    // Static list – could be replaced with remote fetch later.
    const staticTips: WasteTip[] = [
      { title: 'Compost food scraps to reduce landfill waste', link: 'https://www.epa.gov/recycle/composting-home' },
      { title: 'Recycle plastics #1 and #2 for a greener planet', link: 'https://www.nationalgeographic.com/environment/article/recycling-plastic' },
      { title: 'Use reusable bags instead of single‑use plastics', link: 'https://www.unenvironment.org/bring-your-own-bag' },
      { title: 'Donate or repurpose old electronics', link: 'https://www.call2recycle.org/' },
      { title: 'Reduce paper use by going digital', link: 'https://www.worldwildlife.org/places/paper' },
    ];
    setTips(staticTips);
  }, []);

  return { tips };
};
