// Upload data/releases.json to Firestore (collection `releases`), replacing each document by its id.
// Uses the Firebase CLI login on this machine (`firebase login`); see docs/releases.md.
//
//   node scripts/seed-releases.mjs            write every release
//   node scripts/seed-releases.mjs --dry-run  show what would be written
import { readFileSync } from 'node:fs';
import { getAccessToken } from './firebase-token.mjs';

const PROJECT = 'penny-log-ae1c4';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/releases`;
const TIMESTAMP_FIELDS = new Set(['releasedAt']);
const dryRun = process.argv.includes('--dry-run');

// Plain JSON -> Firestore REST "Value"
function toValue(value, key) {
  if (TIMESTAMP_FIELDS.has(key)) {
    if (Number.isNaN(Date.parse(value))) throw new Error(`${key} is not a valid date: ${value}`);
    return { timestampValue: new Date(value).toISOString() };
  }
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map((v) => toValue(v)) } };
  if (value && typeof value === 'object') return { mapValue: { fields: toFields(value) } };
  throw new Error(`Unsupported value for ${key}: ${JSON.stringify(value)}`);
}
const toFields = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, toValue(v, k)]));

const releases = JSON.parse(readFileSync(new URL('../data/releases.json', import.meta.url), 'utf8'));
const ids = new Set();
for (const r of releases) {
  if (!r.id || ids.has(r.id)) throw new Error(`Missing or duplicate id: ${r.id}`);
  ids.add(r.id);
  for (const f of ['version', 'title', 'summary', 'releasedAt', 'published', 'sections']) {
    if (!(f in r)) throw new Error(`${r.id}: missing ${f}`);
  }
}

const token = dryRun ? null : await getAccessToken();
for (const { id, ...data } of releases) {
  const body = { fields: toFields(data) };
  if (dryRun) {
    console.log(`would write releases/${id}: ${data.version} — ${data.title} (${data.sections.length} sections, published: ${data.published})`);
    continue;
  }
  // PATCH without an update mask replaces the whole document, creating it if needed.
  const res = await fetch(`${BASE}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`releases/${id}: ${res.status} ${await res.text()}`);
  console.log(`wrote releases/${id}: ${data.version} — ${data.title}`);
}
