// Generates PWA icons as pure Node.js — no external dependencies.
// Produces a green rounded-square background with a white plate circle.
// Run with: node scripts/generate-icons.js

const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

// Brand colors
const GREEN = { r: 34, g: 197, b: 94 };
const GREEN_DARK = { r: 22, g: 163, b: 74 };
const WHITE = { r: 255, g: 255, b: 255 };
const OFF_WHITE = { r: 240, g: 253, b: 244 };

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function inCircle(x, y, cx, cy, r) {
  const dx = x - cx, dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}

function inRoundedRect(x, y, size, radius) {
  if (x < 0 || y < 0 || x >= size || y >= size) return false;
  const corners = [
    [radius, radius],
    [size - radius, radius],
    [size - radius, size - radius],
    [radius, size - radius],
  ];
  if (x >= radius && x < size - radius) return true;
  if (y >= radius && y < size - radius) return true;
  for (const [cx, cy] of corners) {
    if (inCircle(x, y, cx, cy, radius)) return true;
  }
  return false;
}

function renderIcon(size) {
  const cornerRadius = size * 0.22;
  const cx = size / 2, cy = size / 2;
  const plateR = size * 0.32;
  const rimR = size * 0.36;
  const domeR = size * 0.18;
  const domeCy = cy - size * 0.04;

  const rowSize = size * 3;
  const rawData = Buffer.alloc((rowSize + 1) * size, 0);

  for (let y = 0; y < size; y++) {
    rawData[y * (rowSize + 1)] = 0; // PNG filter byte
    for (let x = 0; x < size; x++) {
      const offset = y * (rowSize + 1) + 1 + x * 3;
      let r, g, b;

      if (!inRoundedRect(x, y, size, cornerRadius)) {
        // Transparent → write 0,0,0 but we'll use RGBA... actually use white bg for icons
        r = 255; g = 255; b = 255;
      } else {
        // Green background gradient (top-left lighter, bottom-right darker)
        const t = (x + y) / (size * 2);
        r = lerp(GREEN.r + 20, GREEN_DARK.r, t);
        g = lerp(GREEN.g + 20, GREEN_DARK.g, t);
        b = lerp(GREEN.b + 20, GREEN_DARK.b, t);

        // Plate rim (slightly off-white ring)
        if (inCircle(x, y, cx, cy, rimR) && !inCircle(x, y, cx, cy, plateR)) {
          const blend = 0.85;
          r = lerp(r, OFF_WHITE.r, blend);
          g = lerp(g, OFF_WHITE.g, blend);
          b = lerp(b, OFF_WHITE.b, blend);
        }

        // Plate surface (white circle)
        if (inCircle(x, y, cx, cy, plateR)) {
          r = WHITE.r; g = WHITE.g; b = WHITE.b;
        }

        // Dome / cloche on plate (green circle, centered slightly above)
        if (inCircle(x, y, cx, domeCy, domeR) && y < domeCy + domeR * 0.15) {
          const blend = 0.9;
          r = lerp(r, GREEN.r, blend);
          g = lerp(g, GREEN.g, blend);
          b = lerp(b, GREEN.b, blend);
        }

        // Small leaf accent top of dome
        const leafCy = domeCy - domeR * 0.6;
        if (inCircle(x, y, cx - size * 0.01, leafCy, size * 0.055)) {
          r = GREEN_DARK.r; g = GREEN_DARK.g; b = GREEN_DARK.b;
        }
      }

      rawData[offset] = r;
      rawData[offset + 1] = g;
      rawData[offset + 2] = b;
    }
  }
  return rawData;
}

// CRC32 table
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeB = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcInput = Buffer.concat([typeB, data]);
  const crcB = Buffer.alloc(4);
  crcB.writeUInt32BE(crc32(crcInput));
  return Buffer.concat([len, typeB, data, crcB]);
}

function buildPNG(size) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type: RGB
  // bytes 10-12 are 0 (compression, filter, interlace)

  const rawData = renderIcon(size);
  const compressed = zlib.deflateSync(rawData, { level: 9 });

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdrData),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const outDir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(outDir, { recursive: true });

for (const size of [192, 512]) {
  const png = buildPNG(size);
  const outPath = path.join(outDir, `icon-${size}x${size}.png`);
  fs.writeFileSync(outPath, png);
  console.log(`✓ ${outPath} (${(png.length / 1024).toFixed(1)} KB)`);
}

// Also write a 180x180 apple-touch-icon
const apple = buildPNG(180);
const applePath = path.join(__dirname, '..', 'public', 'apple-touch-icon.png');
fs.writeFileSync(applePath, apple);
console.log(`✓ ${applePath} (${(apple.length / 1024).toFixed(1)} KB)`);

console.log('\nAll icons generated.');
