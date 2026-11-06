import test from "node:test";
import assert from "node:assert/strict";
import type { PrismaClient } from "@prisma/client";
import { deleteManagedContent } from "../lib/admin-management";
import { editableList } from "../lib/content-form";

function database(role: string | null) {
  const tours = [{ slug: "same-slug", ownerId: "another-host" }, { slug: "keep-tour", ownerId: "host" }];
  const content = [{ slug: "same-slug", type: "BLOG" }, { slug: "keep-story", type: "EXPERIENCE" }];
  const calls: string[] = [];
  const tx = {
    user: { findUnique: async ({ where }: { where: { id: string } }) => { calls.push(`identity:${where.id}`); return role ? { role } : null; } },
    tour: { deleteMany: async ({ where }: { where: { slug: string } }) => { calls.push("tour"); const at = tours.findIndex(v => v.slug === where.slug); if (at < 0) return { count: 0 }; tours.splice(at, 1); return { count: 1 }; } },
    content: { deleteMany: async ({ where }: { where: { slug: string; type: string } }) => { calls.push("content"); const at = content.findIndex(v => v.slug === where.slug && v.type === where.type); if (at < 0) return { count: 0 }; content.splice(at, 1); return { count: 1 }; } },
  };
  const db = { $transaction: async (fn: (value: typeof tx) => unknown) => fn(tx) } as unknown as PrismaClient;
  return { db, tours, content, calls };
}

test("ordinary users, hosts and missing accounts cannot delete any publication", async () => {
  for (const role of ["USER", "HOST", null]) {
    const state = database(role);
    await assert.rejects(deleteManagedContent(state.db, "verified-session-user", { slug: "same-slug", contentType: "tour", role: "ADMIN" }), /ovlašćenja/);
    assert.equal(state.tours.length, 2);
    assert.equal(state.content.length, 2);
    assert.deepEqual(state.calls, ["identity:verified-session-user"]);
  }
});
test("an admin can delete another host's tour without deleting content with the same slug", async () => {
  const state = database("ADMIN");
  await deleteManagedContent(state.db, "admin-id", { slug: "same-slug", contentType: "tour" });
  assert.deepEqual(state.tours.map(v => v.slug), ["keep-tour"]);
  assert.equal(state.content.length, 2);
});
test("editorial deletion matches the content type and preserves the tour", async () => {
  const state = database("ADMIN");
  await assert.rejects(deleteManagedContent(state.db, "admin-id", { slug: "same-slug", contentType: "destination" }), /nije pronađena/);
  await deleteManagedContent(state.db, "admin-id", { slug: "same-slug", contentType: "blog" });
  assert.equal(state.tours.length, 2);
  assert.deepEqual(state.content.map(v => v.slug), ["keep-story"]);
});
test("invalid resource types and empty slugs cannot select a table", async () => {
  const state = database("ADMIN");
  for (const input of [{ slug: "same-slug", contentType: "user" }, { slug: "", contentType: "tour" }]) await assert.rejects(deleteManagedContent(state.db, "admin-id", input));
  assert.deepEqual(state.calls, []);
});
test("the list editor preserves items through load and save rather than displaying JSON punctuation", () => {
  assert.equal(editableList('["Vodič","Ručak"]'), "Vodič\nRučak");
  assert.equal(editableList("Vodič, voda"), "Vodič, voda");
  assert.equal(editableList(), "");
});
