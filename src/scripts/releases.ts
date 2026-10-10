// What's new: loads published release notes from Cloud Firestore in the browser and renders a timeline.
// Data model and rules: docs/releases.md, firestore.rules.

const ENDPOINT =
  'https://firestore.googleapis.com/v1/projects/penny-log-ae1c4/databases/(default)/documents:runQuery';

// The rules only allow this exact shape of query: published == true, newest first.
const QUERY = {
  structuredQuery: {
    from: [{ collectionId: 'releases' }],
    where: { fieldFilter: { field: { fieldPath: 'published' }, op: 'EQUAL', value: { booleanValue: true } } },
    orderBy: [{ field: { fieldPath: 'releasedAt' }, direction: 'DESCENDING' }],
    limit: 50,
  },
};

type Section = { title: string; items: string[] };
export type Release = {
  version: string;
  title: string;
  summary: string;
  releasedAt: string;
  dateLabel?: string;
  sections: Section[];
};

type FsValue = {
  stringValue?: string;
  booleanValue?: boolean;
  integerValue?: string;
  doubleValue?: number;
  timestampValue?: string;
  arrayValue?: { values?: FsValue[] };
  mapValue?: { fields?: Record<string, FsValue> };
};

// Firestore REST "Value" -> plain JS
function fromValue(v: FsValue): unknown {
  if ('stringValue' in v) return v.stringValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('timestampValue' in v) return v.timestampValue;
  if ('arrayValue' in v) return (v.arrayValue?.values ?? []).map(fromValue);
  if ('mapValue' in v) return fromFields(v.mapValue?.fields ?? {});
  return null;
}
const fromFields = (fields: Record<string, FsValue>) =>
  Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, fromValue(v)]));

export async function fetchReleases(signal?: AbortSignal): Promise<Release[]> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(QUERY),
    signal,
  });
  if (!res.ok) throw new Error(`Firestore ${res.status}`);
  const rows: { document?: { fields: Record<string, FsValue> } }[] = await res.json();
  return rows
    .filter((r) => r.document)
    .map((r) => fromFields(r.document!.fields) as Release)
    .filter((r) => typeof r.version === 'string' && typeof r.title === 'string' && Array.isArray(r.sections));
}

// ---------- rendering ----------
const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const dateText = (r: Release) =>
  r.dateLabel ||
  new Date(r.releasedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });

function releaseHtml(r: Release, i: number) {
  const latest = i === 0;
  return `<li class="rise relative flex flex-col gap-5 md:pl-14" style="--i:${Math.min(i, 4)}">
    <span aria-hidden="true" class="absolute top-2 left-[13px] hidden size-4 rounded-full border-[3px] md:block ${
      latest ? 'border-brand bg-brand-soft shadow-[0_0_0_6px_var(--glow)]' : 'border-line-strong bg-bg'
    }"></span>
    <header class="flex flex-col gap-2">
      <div class="flex flex-wrap items-center gap-2">
        <span class="inline-flex h-7 items-center rounded-lg px-2.5 text-sm font-bold ${latest ? 'bg-brand text-on-brand' : 'bg-raised text-ink'}">${esc(r.version)}</span>
        ${latest ? '<span class="inline-flex h-7 items-center rounded-lg bg-brand-soft px-2.5 text-xs font-semibold text-brand">Latest</span>' : ''}
        <time class="text-sm font-medium text-subtle" datetime="${esc(r.releasedAt)}">${esc(dateText(r))}</time>
      </div>
      <h2 class="m-0 font-display text-[clamp(24px,3vw,34px)] leading-[1.15] font-bold tracking-[-0.02em] text-balance">${esc(r.title)}</h2>
      <p class="m-0 max-w-[720px] text-base leading-[26px] text-pretty text-muted">${esc(r.summary)}</p>
    </header>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-3">
      ${r.sections
        .map(
          (s) => `<section class="rounded-card border border-line bg-surface p-5">
            <h3 class="m-0 mb-3 text-base font-semibold">${esc(s.title)}</h3>
            <ul class="m-0 flex flex-col gap-2 p-0">${(s.items ?? [])
              .map((it) => `<li class="flex list-none gap-2.5 text-[15px] leading-[23px] text-muted"><span aria-hidden="true" class="mt-[9px] size-1.5 shrink-0 rounded-full bg-brand"></span><span>${esc(it)}</span></li>`)
              .join('')}</ul>
          </section>`,
        )
        .join('')}
    </div>
  </li>`;
}

export function initReleases() {
  const root = document.querySelector<HTMLElement>('[data-releases]');
  if (!root) return;
  const list = root.querySelector<HTMLElement>('[data-releases-list]')!;
  const status = root.querySelector<HTMLElement>('[data-releases-status]')!;
  const retry = root.querySelector<HTMLButtonElement>('[data-releases-retry]')!;

  const show = (state: 'loading' | 'ready' | 'empty' | 'error') => {
    root.dataset.state = state;
    retry.hidden = state !== 'error';
    status.textContent =
      state === 'loading' ? 'Loading release notes…'
      : state === 'empty' ? 'No release notes yet.'
      : state === 'error' ? 'Couldn’t load the release notes. Check your connection and try again.'
      : '';
  };

  const load = async () => {
    show('loading');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    try {
      const releases = await fetchReleases(ctrl.signal);
      list.innerHTML = releases.map(releaseHtml).join('');
      show(releases.length ? 'ready' : 'empty');
    } catch {
      show('error');
    } finally {
      clearTimeout(timer);
    }
  };

  retry.addEventListener('click', load);
  load();
}
