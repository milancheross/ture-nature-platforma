import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { MAX_IMAGE_SIZE, prepareImage } from "../lib/media";

test("images are resized and encoded as WebP without enlargement", async () => {
  const image = await sharp({ create: { width: 2400, height: 1200, channels: 3, background: "green" } }).png().toBuffer();
  const result = await prepareImage(image, "image/png");
  assert.equal(result.info.width, 2000);
  assert.equal(result.info.height, 1000);
  assert.equal(result.info.format, "webp");
  const tiny = await sharp({ create: { width: 20, height: 10, channels: 3, background: "green" } }).png().toBuffer();
  assert.equal((await prepareImage(tiny, "image/png")).info.width, 20);
});
test("rejects forged MIME types, corrupt files and oversized inputs", async () => {
  const png = await sharp({ create: { width: 10, height: 10, channels: 3, background: "green" } }).png().toBuffer();
  await assert.rejects(prepareImage(png, "image/jpeg"));
  await assert.rejects(prepareImage(Buffer.from("not an image"), "image/png"));
  await assert.rejects(prepareImage(Buffer.from("<svg/>"), "image/svg+xml"));
  await assert.rejects(prepareImage(new Uint8Array(MAX_IMAGE_SIZE + 1), "image/png"));
});
