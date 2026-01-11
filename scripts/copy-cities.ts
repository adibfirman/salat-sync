import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SOURCE = 'data/cities.json';
const DEST = 'public/data/cities.json';

// Ensure destination directory exists
mkdirSync(dirname(DEST), { recursive: true });

// Copy the file
copyFileSync(SOURCE, DEST);

console.log(`✓ Copied ${SOURCE} to ${DEST}`);
