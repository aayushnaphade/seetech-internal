#!/usr/bin/env node
/**
 * Generates a version info file with git commit count, short hash, and timestamp.
 * Falls back gracefully if git is unavailable (e.g., in some CI export contexts).
 */
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

function safe(cmd) {
  try { return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return undefined; }
}

const commitCount = safe('git rev-list --count HEAD') || '0';
const shortHash = safe('git rev-parse --short HEAD') || 'nogit';
const branch = safe('git rev-parse --abbrev-ref HEAD') || 'unknown';
const iso = new Date().toISOString();

// Semantic-ish version: keep package.json base + .commitCount
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('../package.json');
const baseVersion = pkg.version || '0.0.0';
const versionString = `${baseVersion}+${commitCount}`; // build metadata style
const major = parseInt(baseVersion.split('.')[0] || '0', 10) || 0;
const isMajor = major > 0; // show badge once you cross 1.0.0

const banner = `// AUTO-GENERATED FILE. DO NOT EDIT.
// Generated at ${iso}
// Branch: ${branch}
// Commit: ${shortHash}
`;

const contents = `${banner}export const buildInfo = {
  baseVersion: '${baseVersion}',
  commitCount: ${Number(commitCount)},
  shortHash: '${shortHash}',
  branch: '${branch}',
  isoTimestamp: '${iso}',
  versionString: '${versionString}',
  major: ${major},
  isMajor: ${isMajor}
};
export default buildInfo;\n`;

const outDir = resolve(process.cwd(), 'src');
mkdirSync(outDir, { recursive: true });
const outFile = resolve(outDir, 'build-info.ts');
writeFileSync(outFile, contents);
console.log(`[version] Wrote ${outFile} -> ${versionString}`);
