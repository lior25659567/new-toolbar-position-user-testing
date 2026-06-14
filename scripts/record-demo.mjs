// Record a self-driving demo to MP4.
//
// Loads the running dev app headlessly, deep-links into a demo via
// `?view=demo&demo=<id>`, plays it to completion, and converts the captured
// video to an H.264 .mp4 (falls back to leaving the .webm if ffmpeg is absent).
//
// Prereqs (one time):
//   npm run dev            # in another terminal — serves http://localhost:3000
//   npx playwright install chromium
//   (ffmpeg on PATH for mp4 conversion — e.g. `brew install ffmpeg`)
//
// Usage:
//   node scripts/record-demo.mjs <demo-id> [--out file.mp4] [--speed 1] [--max 180]
//   node scripts/record-demo.mjs                      # defaults to info-dentures
//   npm run record:demo -- info-dentures --speed 2
//
// Demo ids: patient-report | info-fixed-restorative | info-dentures |
//           scan-view | report-flow | report-annotation

import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync, renameSync, rmSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── args ──
const argv = process.argv.slice(2);
const positional = argv.filter((a) => !a.startsWith('--'));
const flag = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : def;
};

const DEMO = positional[0] || 'info-dentures';
const SPEED = Number(flag('speed', '1'));         // 0.5 | 1 | 1.5 | 2
const MAX_SECONDS = Number(flag('max', '180'));   // hard cap on recording length
const BASE_URL = process.env.BASE_URL || flag('url', 'http://localhost:3000');
const WIDTH = Number(flag('width', '1440'));
const HEIGHT = Number(flag('height', '900'));

const OUT_DIR = join(ROOT, 'recordings');
const OUT_MP4 = resolve(flag('out', join(OUT_DIR, `${DEMO}.mp4`)));
const TMP_DIR = join(OUT_DIR, '.tmp');

mkdirSync(OUT_DIR, { recursive: true });
rmSync(TMP_DIR, { recursive: true, force: true });
mkdirSync(TMP_DIR, { recursive: true });

const log = (...a) => console.log('[record-demo]', ...a);

async function main() {
  log(`demo=${DEMO} speed=${SPEED}x url=${BASE_URL} size=${WIDTH}x${HEIGHT}`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 2,
    recordVideo: { dir: TMP_DIR, size: { width: WIDTH, height: HEIGHT } },
  });
  const page = await context.newPage();

  const url = `${BASE_URL}/?view=demo&demo=${encodeURIComponent(DEMO)}`;
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 15000 });
  } catch {
    await browser.close();
    throw new Error(
      `Could not reach ${url}. Is the dev server running? Start it with \`npm run dev\` (port 3000).`,
    );
  }

  // Give the demo a beat to mount its transport bar.
  await page.waitForTimeout(800);

  // Optional playback speed — click the matching pill if present.
  if (SPEED !== 1) {
    const pill = page.getByRole('button', { name: `${SPEED}× speed` });
    if (await pill.count()) { await pill.first().click(); log(`set speed ${SPEED}×`); }
  }

  // The patient-report demo waits for Play; the rest auto-run on mount.
  const play = page.getByRole('button', { name: 'Play' });
  if (await play.count()) { await play.first().click(); log('clicked Play'); }

  // ── Wait for completion ──
  // Auto-running demos park on "Flow complete…" or flip the status to "Done";
  // the step-engine demo finishes when the progress count reads N/N.
  log('recording — waiting for the demo to finish…');
  const deadline = Date.now() + MAX_SECONDS * 1000;
  let finished = false;
  while (Date.now() < deadline) {
    const done = await page.evaluate(() => {
      const txt = (document.body.innerText || '');
      if (/Flow complete/i.test(txt)) return true;
      // status pill reads exactly "Done"
      const spans = Array.from(document.querySelectorAll('span'));
      if (spans.some((s) => (s.textContent || '').trim() === 'Done')) return true;
      // step engine "N/N"
      const m = txt.match(/\b(\d+)\/(\d+)\b/);
      if (m && m[2] !== '0' && m[1] === m[2]) return true;
      return false;
    });
    if (done) { finished = true; break; }
    await page.waitForTimeout(500);
  }
  log(finished ? 'demo finished' : `hit ${MAX_SECONDS}s cap — stopping`);

  // Let the final frame linger.
  await page.waitForTimeout(1500);

  const video = page.video();
  await context.close(); // finalizes the .webm
  await browser.close();

  const webmPath = video ? await video.path() : findWebm(TMP_DIR);
  if (!webmPath || !existsSync(webmPath)) throw new Error('No video file was produced.');

  if (hasFfmpeg()) {
    log('converting to mp4 (H.264)…');
    const r = spawnSync(
      'ffmpeg',
      ['-y', '-i', webmPath, '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
       '-crf', '18', '-preset', 'veryfast', '-movflags', '+faststart', OUT_MP4],
      { stdio: 'inherit' },
    );
    if (r.status === 0) {
      rmSync(TMP_DIR, { recursive: true, force: true });
      log(`done → ${OUT_MP4}`);
      return;
    }
    log('ffmpeg failed — keeping the .webm instead.');
  } else {
    log('ffmpeg not found on PATH — keeping the .webm (install ffmpeg for mp4).');
  }

  const webmOut = OUT_MP4.replace(/\.mp4$/, '.webm');
  renameSync(webmPath, webmOut);
  rmSync(TMP_DIR, { recursive: true, force: true });
  log(`done → ${webmOut}`);
}

function hasFfmpeg() {
  return spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status === 0;
}
function findWebm(dir) {
  const f = readdirSync(dir).find((n) => n.endsWith('.webm'));
  return f ? join(dir, f) : null;
}

main().catch((err) => { console.error('[record-demo]', err.message || err); process.exit(1); });
