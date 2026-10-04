import fs from 'node:fs/promises';
import path from 'node:path';
import { findRoute, renderHeadTags, NOT_FOUND } from '../../../shared/seo.js';
import { env } from '../config/env.js';

let cachedTemplate = null;

async function loadTemplate() {
  if (cachedTemplate && env.isProd) return cachedTemplate;
  cachedTemplate = await fs.readFile(path.join(env.clientDist, 'index.html'), 'utf8');
  return cachedTemplate;
}

/**
 * Inject route-specific <head> tags into the built index.html so crawlers and
 * link-preview bots see correct titles, descriptions, canonical URLs, Open Graph
 * and JSON-LD without running JavaScript.
 */
export async function renderPage(pathname) {
  const template = await loadTemplate();
  const route = findRoute(pathname);
  const head = renderHeadTags(route || NOT_FOUND, env.siteUrl);
  const html = template.replace(/<!--seo-head-->[\s\S]*?<!--\/seo-head-->/, head);
  return { html, status: route ? 200 : 404 };
}
