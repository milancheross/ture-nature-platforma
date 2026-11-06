import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { listingImage } from "../lib/utils";
import { CATEGORY_IMAGE } from "../lib/catalog";

test("all category images and the new hero resolve to decodable WebP assets", async () => {
  for (const key of [...Object.values(CATEGORY_IMAGE), "staza-trail-hero"]) {
    const path = listingImage(key);
    assert.equal(path, `/images/${key}.webp`);
    const bytes = await readFile(new URL(`../public${path}`, import.meta.url));
    const image = await sharp(bytes).metadata();
    assert.equal(image.format, "webp");
    assert.ok(image.width && image.height);
  }
});
test("unknown and traversal keys use a real fallback while uploaded HTTPS images remain intact", () => {
  assert.equal(listingImage("../private"), "/images/tara-hike.webp");
  assert.equal(listingImage("nonexistent"), "/images/tara-hike.webp");
  assert.equal(listingImage("tara-hike", "https://example.com/photo.webp"), "https://example.com/photo.webp");
  assert.equal(listingImage("tara-hike", "javascript:alert(1)"), "/images/tara-hike.webp");
});
