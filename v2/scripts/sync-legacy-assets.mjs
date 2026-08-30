import { cp, copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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

console.log('Synced existing Hotel 3 Paardekens assets into the v2 build.');
