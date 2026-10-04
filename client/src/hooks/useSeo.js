import { useEffect } from 'react';
import { routeByKey, renderHeadTags, NOT_FOUND } from '@shared/seo.js';

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.doveautism.com').replace(/\/+$/, '');

/**
 * Keeps <head> in sync on client-side navigation. The server already injects
 * the same tags into the initial HTML, so crawlers never depend on this hook.
 */
export function useSeo(key) {
  useEffect(() => {
    const route = key === 'notFound' ? NOT_FOUND : routeByKey(key);
    const fragment = document.createRange().createContextualFragment(renderHeadTags(route, SITE_URL));
    const head = document.head;

    // Remove tags we manage, then append the fresh set.
    head
      .querySelectorAll(
        'title, meta[name="description"], meta[name="robots"], link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"], script#ld-json'
      )
      .forEach((el) => el.remove());
    head.append(fragment);
  }, [key]);
}
