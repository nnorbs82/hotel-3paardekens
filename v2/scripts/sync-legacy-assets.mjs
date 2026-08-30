import { cp, copyFile, mkdir, readdir, rename, rm } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(scriptDir, '..');
const repoRoot = resolve(projectDir, '..');
const generatedDir = join(projectDir, 'public', 'images', 'legacy');

async function copyDirectory(source, destination) {
  await cp(source, destination, { recursive: true, force: true });
}

async function copyAsset(source, destination) {
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
}

async function optimizeJpegs(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      await optimizeJpegs(fullPath);
      continue;
    }

    const extension = extname(entry.name).toLowerCase();
    if (extension !== '.jpg' && extension !== '.jpeg') continue;

    const temporaryPath = `${fullPath}.optimized.jpg`;
    await sharp(fullPath)
      .rotate()
      .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toFile(temporaryPath);
    await rename(temporaryPath, fullPath);
  }
}

await rm(generatedDir, { recursive: true, force: true });
await mkdir(generatedDir, { recursive: true });

await Promise.all([
  copyDirectory(join(repoRoot, 'Rooms'), join(generatedDir, 'rooms')),
  copyDirectory(join(repoRoot, 'aboutus'), join(generatedDir, 'about')),
  copyDirectory(join(repoRoot, 'elisabeth'), join(generatedDir, 'elisabeth')),
  copyAsset(join(repoRoot, 'assets', '3plogo.png'), join(generatedDir, 'brand', 'logo.png')),
  copyAsset(join(repoRoot, 'assets', 'background.jpg'), join(generatedDir, 'hotel', 'background.jpg')),
  copyAsset(join(repoRoot, 'favicon.ico'), join(projectDir, 'public', 'favicon.ico'))
]);

await optimizeJpegs(generatedDir);

console.log('Synced and optimized existing Hotel 3 Paardekens assets into the v2 build.');
