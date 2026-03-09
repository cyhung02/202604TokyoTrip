// Generate PWA icons from SVG
import { createCanvas } from 'canvas';
import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function drawIcon(ctx, size) {
  const scale = size / 512;
  
  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  bgGrad.addColorStop(0, '#1a365d');
  bgGrad.addColorStop(1, '#2c5282');
  
  // Rounded rectangle background
  const radius = 96 * scale;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fillStyle = bgGrad;
  ctx.fill();
  
  // Mt. Fuji
  const fujiGrad = ctx.createLinearGradient(0, 400 * scale, 0, 180 * scale);
  fujiGrad.addColorStop(0, '#4a5568');
  fujiGrad.addColorStop(0.7, '#718096');
  fujiGrad.addColorStop(0.85, '#e2e8f0');
  fujiGrad.addColorStop(1, '#ffffff');
  
  ctx.beginPath();
  ctx.moveTo(64 * scale, 400 * scale);
  ctx.lineTo(256 * scale, 180 * scale);
  ctx.lineTo(448 * scale, 400 * scale);
  ctx.closePath();
  ctx.fillStyle = fujiGrad;
  ctx.fill();
  
  // Snow cap
  ctx.beginPath();
  ctx.moveTo(180 * scale, 260 * scale);
  ctx.lineTo(256 * scale, 180 * scale);
  ctx.lineTo(332 * scale, 260 * scale);
  ctx.quadraticCurveTo(256 * scale, 240 * scale, 180 * scale, 260 * scale);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  
  // Cherry blossom gradient
  const sakuraGrad = ctx.createLinearGradient(0, 0, size, size);
  sakuraGrad.addColorStop(0, '#fdd5d5');
  sakuraGrad.addColorStop(1, '#f8b4b4');
  
  // Large cherry blossom
  drawFlower(ctx, 380 * scale, 120 * scale, 18 * scale, 28 * scale, sakuraGrad, '#d69e2e', 12 * scale);
  
  // Small cherry blossom
  drawFlower(ctx, 120 * scale, 160 * scale, 10 * scale, 16 * scale, sakuraGrad, '#ecc94b', 7 * scale);
  
  // Falling petals
  ctx.globalAlpha = 0.7;
  drawPetal(ctx, 90 * scale, 280 * scale, 8 * scale, 12 * scale, 30, '#f8b4b4');
  ctx.globalAlpha = 0.6;
  drawPetal(ctx, 420 * scale, 220 * scale, 6 * scale, 10 * scale, -20, '#fdd5d5');
  ctx.globalAlpha = 0.5;
  drawPetal(ctx, 350 * scale, 320 * scale, 7 * scale, 11 * scale, 45, '#f8b4b4');
  ctx.globalAlpha = 1;
}

function drawFlower(ctx, cx, cy, rx, ry, petalColor, centerColor, centerRadius) {
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((i * 72 * Math.PI) / 180);
    ctx.beginPath();
    ctx.ellipse(0, -ry * 1.25, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = petalColor;
    ctx.fill();
    ctx.restore();
  }
  
  // Center
  ctx.beginPath();
  ctx.arc(cx, cy, centerRadius, 0, Math.PI * 2);
  ctx.fillStyle = centerColor;
  ctx.fill();
}

function drawPetal(ctx, cx, cy, rx, ry, angle, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

// Generate icons
const sizes = [192, 512];

for (const size of sizes) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  drawIcon(ctx, size);
  
  const buffer = canvas.toBuffer('image/png');
  const outputPath = join(__dirname, 'icons', `icon-${size}.png`);
  writeFileSync(outputPath, buffer);
  console.log(`Generated: ${outputPath}`);
}

console.log('Icon generation complete!');
