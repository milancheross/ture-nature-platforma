import test from 'node:test';
import assert from 'node:assert/strict';
import { readPublicCatalog, databaseFailure } from '../lib/catalog-read';

test('public catalog preserves successful real data and legitimately empty results', async () => {
  const data = [{ slug: 'real-tour' }];
  assert.deepEqual(await readPublicCatalog(async () => data, []), { data, unavailable: false });
  assert.deepEqual(await readPublicCatalog(async () => [], []), { data: [], unavailable: false });
});
test('unreachable or unmigrated databases do not crash the whole public page or show demo offers', async () => {
  for (const code of ['P2021', 'P2022', 'P1001', 'ECONNREFUSED', '42P01']) {
    const result = await readPublicCatalog(async () => { throw Object.assign(new Error('database failed'), { code }); }, []);
    assert.deepEqual(result, { data: [], unavailable: true });
  }
});
test('catalog programming errors and unexpected Prisma failures are never swallowed', async () => {
  const error = new TypeError('bad mapping');
  await assert.rejects(readPublicCatalog(async () => { throw error; }, []), value => value === error);
  assert.equal(databaseFailure({ code: 'P2002' }), null);
  assert.equal(databaseFailure({ cause: { code: 'ETIMEDOUT' } }), 'ETIMEDOUT');
});
