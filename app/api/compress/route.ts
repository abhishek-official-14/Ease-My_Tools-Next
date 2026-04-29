import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

async function compressStrict(
  buffer: Buffer,
  targetKB: number,
  format: string,
  mode: string,
  keepMetadata: boolean
) {
  let width: number | null = null;
  let best: Buffer | null = null;

  // 🎯 Mode Config
  let minQ = 1;
  let maxQ = 100;

  if (mode === "high") {
    minQ = 40;
    maxQ = 100;
  } else if (mode === "small") {
    minQ = 1;
    maxQ = 70;
  }

  for (let r = 0; r < 6; r++) {
    let low = minQ;
    let high = maxQ;

    while (low <= high) {
      const q = Math.floor((low + high) / 2);

      let pipeline = sharp(buffer).rotate();

      if (width) pipeline = pipeline.resize({ width });

      if (keepMetadata) {
        pipeline = pipeline.withMetadata();
      }

      let output;
      switch (format) {
        case "webp":
          output = await pipeline.webp({ quality: q }).toBuffer();
          break;
        case "avif":
          output = await pipeline.avif({ quality: q }).toBuffer();
          break;
        case "png":
          output = await pipeline.png({ quality: q }).toBuffer();
          break;
        default:
          output = await pipeline.jpeg({ quality: q }).toBuffer();
      }

      const sizeKB = output.length / 1024;

      if (sizeKB <= targetKB) {
        best = output;
        low = q + 1;
      } else {
        high = q - 1;
      }
    }

    if (best) return best;

    // Resize fallback (mode-based)
    width = width
      ? width - (mode === "small" ? 300 : 200)
      : 1200;
  }

  return best || buffer;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get("file") as File;
  const targetKB = Number(formData.get("targetKB"));
  const format = String(formData.get("format") || "jpeg");
  const mode = String(formData.get("mode") || "balanced");
  const keepMetadata = formData.get("keepMetadata") === "true";

  const originalBuffer = Buffer.from(await file.arrayBuffer());

  const compressed:any = await compressStrict(
    originalBuffer,
    targetKB,
    format,
    mode,
    keepMetadata
  );

  return new NextResponse(compressed, {
    headers: {
      "Content-Type": `image/${format}`,
      "X-Original-Size": String(originalBuffer.length),
      "X-Compressed-Size": String(compressed.length),
    },
  });
}