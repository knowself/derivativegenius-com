import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import { createSuppressionHash, type SuppressionScope } from '../src/lib/prospecting/suppression';

config({ path: '.env.local' });

async function main() {
  const secret = process.env.CENTURION_SUPPRESSION_SECRET;
  if (!secret) throw new Error('CENTURION_SUPPRESSION_SECRET is required.');

  const { db } = await import('../src/db');
  const { suppressions } = await import('../src/db/schema');
  const rows = await db.select({
    id: suppressions.id,
    scope: suppressions.scope,
    valueHash: suppressions.valueHash,
  }).from(suppressions);
  const legacyRows = rows.filter((row) => !/^[a-f0-9]{64}$/i.test(row.valueHash));

  for (const row of legacyRows) {
    const scope = row.scope as SuppressionScope;
    const valueHash = createSuppressionHash(row.valueHash, secret, scope);
    await db.update(suppressions).set({ valueHash }).where(eq(suppressions.id, row.id));
  }

  console.log(`Rehashed ${legacyRows.length} legacy suppression record(s).`);
}

void main();
