/**
 * Photo pipeline — turns originals in client/photos-src/ into production images.
 *
 *   1. Put a licensed original in client/photos-src/, named after its slot,
 *      e.g. photos-src/home-why.jpg (slot ids are listed in src/content/photos.js).
 *   2. npm run photos
 *   3. In src/content/photos.js set placeholder: false and fill alt + license details.
 *
 * Output per photo: AVIF + WebP at up to four widths in public/images/photos/, with
 * EXIF orientation applied and ALL metadata (GPS, camera, names) stripped.
 * Dimensions are written to src/content/photos.manifest.json so every <img>
 * has explicit width/height (no layout shift).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(root, 'photos-src');
const OUT = path.join(root, 'public', 'images', 'photos');
const MANIFEST = path.join(root, 'src', 'content', 'photos.manifest.json');
const WIDTHS = [480, 800, 1200, 1600];
const MAX_SOURCE_BYTES = 40 * 1024 * 1024;

await fs.mkdir(OUT, { recursive: true });
const files = (await fs.readdir(SRC)).filter((f) => /\.(jpe?g|png|webp|avif|tiff?)$/i.test(f));
const manifest = {};

for (const file of files) {
  const slot = path.parse(file).name.toLowerCase();
  if (!/^[a-z0-9-]+$/.test(slot)) {
    console.warn(`skip ${file}: name must be a slot id (letters, numbers, dashes)`);
    continue;
  }
  const input = path.join(SRC, file);
  if ((await fs.stat(input)).size > MAX_SOURCE_BYTES) {
    console.warn(`skip ${file}: larger than 40 MB`);
    continue;
  }
  const base = sharp(input).rotate(); // apply EXIF orientation; metadata is not copied to outputs
  const meta = await base.metadata();
  const oriented = (meta.orientation || 1) >= 5 ? { width: meta.height, height: meta.width } : meta;
  const widths = WIDTHS.filter((w) => w <= oriented.width);
  if (!widths.length) widths.push(oriented.width);

  for (const w of widths) {
    const resized = base.clone().resize({ width: w, withoutEnlargement: true });
    await resized.clone().avif({ quality: 50, effort: 3 }).toFile(path.join(OUT, `${slot}-${w}.avif`));
    await resized.clone().webp({ quality: 72, effort: 4 }).toFile(path.join(OUT, `${slot}-${w}.webp`));
  }
  manifest[slot] = { width: oriented.width, height: oriented.height, widths };
  console.log(`✓ ${slot}: ${oriented.width}×${oriented.height} → ${widths.join(', ')} (avif + webp)`);
}

// Remove generated files for slots whose source was deleted.
for (const f of await fs.readdir(OUT)) {
  const slot = f.replace(/-\d+\.(avif|webp)$/, '');
  if (!manifest[slot] && /\.(avif|webp)$/.test(f)) await fs.unlink(path.join(OUT, f));
}

await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`manifest: ${Object.keys(manifest).length} photo(s) → src/content/photos.manifest.json`);
