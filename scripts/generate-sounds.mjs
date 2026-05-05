// Generate tiny CC0 click + pop WAV files procedurally so we don't need to
// download external assets. Each clip is < 6KB and free of any third-party rights.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "..", "public", "sounds");
fs.mkdirSync(outDir, { recursive: true });

const SAMPLE_RATE = 22050;

function writeWav(samples, file) {
  const numSamples = samples.length;
  const dataLen = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataLen);
  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataLen, 4);
  buffer.write("WAVE", 8);
  // fmt subchunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // PCM chunk size
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  // data subchunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataLen, 40);
  for (let i = 0; i < numSamples; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  fs.writeFileSync(file, buffer);
}

// Click: short noise burst with quick decay (~50ms)
function makeClick() {
  const durationMs = 55;
  const total = Math.round((SAMPLE_RATE * durationMs) / 1000);
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const t = i / total;
    const env = Math.exp(-t * 18);
    const osc =
      0.4 * Math.sin(2 * Math.PI * 1800 * (i / SAMPLE_RATE)) +
      0.3 * Math.sin(2 * Math.PI * 2600 * (i / SAMPLE_RATE)) +
      0.3 * (Math.random() * 2 - 1);
    samples[i] = osc * env * 0.6;
  }
  return samples;
}

// Pop: chirp from 600 -> 1200 Hz with body, slightly longer (~120ms)
function makePop() {
  const durationMs = 130;
  const total = Math.round((SAMPLE_RATE * durationMs) / 1000);
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const t = i / total;
    const env = Math.pow(1 - t, 2.2);
    const freq = 600 + 700 * (1 - Math.exp(-t * 4));
    const osc =
      0.6 * Math.sin(2 * Math.PI * freq * (i / SAMPLE_RATE)) +
      0.2 * Math.sin(2 * Math.PI * (freq * 2) * (i / SAMPLE_RATE));
    samples[i] = osc * env * 0.55;
  }
  return samples;
}

writeWav(makeClick(), path.join(outDir, "click.wav"));
writeWav(makePop(), path.join(outDir, "pop.wav"));
console.log("Wrote click.wav and pop.wav to", outDir);
