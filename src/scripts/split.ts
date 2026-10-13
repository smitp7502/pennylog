// In-browser split calculator. Nothing is stored or sent anywhere.
// Every expense is shared equally by everyone in the group.

type Person = { id: number; name: string };
type Expense = { id: number; title: string; paise: number; paidBy: number };
type Pay = { from: number; to: number; paise: number };

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.timsved.pennylog';

const HUES = [
  'bg-cat-pink/16 text-cat-pink',
  'bg-cat-sky/16 text-cat-sky',
  'bg-cat-lime/16 text-cat-lime',
  'bg-cat-orange/16 text-cat-orange',
  'bg-cat-violet/16 text-cat-violet',
  'bg-cat-yellow/16 text-cat-yellow',
  'bg-cat-slate/16 text-cat-slate',
];

// The calculator starts empty: no group name, people or expenses.
const s = {
  group: '',
  nextId: 1,
  paidBy: 0,
  people: [] as Person[],
  expenses: [] as Expense[],
};

// ---------- helpers ----------
const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const fmt = (p: number) =>
  '₹' + (p / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const hue = (id: number) => HUES[(id - 1) % HUES.length];
const initial = (n: string) => esc(n.charAt(0).toUpperCase());
const parse = (v: string) => {
  const n = parseFloat(v.replace(/[,₹\s]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : 0;
};
const icon = (paths: string, size = 18, cls = '') =>
  `<svg class="ic ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
const ICON_X = '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>';
const ICON_TRASH =
  '<path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"/><path d="M9 7V4h6v3"/>';
const ICON_ARROW = '<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>';

/** Balances in paise (positive = gets back) and the fewest greedy payments that settle them. */
function compute() {
  const net: Record<number, number> = {};
  const paid: Record<number, number> = {};
  let total = 0;
  s.people.forEach((p) => {
    net[p.id] = 0;
    paid[p.id] = 0;
  });
  const n = s.people.length;
  s.expenses.forEach((e) => {
    total += e.paise;
    paid[e.paidBy] += e.paise;
    net[e.paidBy] += e.paise;
    // Equal shares; the leftover paise go one each to the first people so the total always matches.
    const base = Math.floor(e.paise / n);
    let rem = e.paise - base * n;
    s.people.forEach((p) => {
      net[p.id] -= base + (rem-- > 0 ? 1 : 0);
    });
  });

  const left = { ...net };
  const pays: Pay[] = [];
  for (let guard = 0; guard < 500; guard++) {
    let d: number | null = null;
    let c: number | null = null;
    for (const p of s.people) {
      if (left[p.id] < 0 && (d === null || left[p.id] < left[d])) d = p.id;
      if (left[p.id] > 0 && (c === null || left[p.id] > left[c])) c = p.id;
    }
    if (d === null || c === null) break;
    const m = Math.min(-left[d], left[c]);
    pays.push({ from: d, to: c, paise: m });
    left[d] += m;
    left[c] -= m;
  }
  return { net, paid, total, pays };
}

const headlineFor = (hasExpenses: boolean, pays: number) =>
  !hasExpenses
    ? 'Add an expense to start'
    : !pays
      ? 'Everyone is even'
      : pays === 1
        ? '1 payment settles everyone'
        : `${pays} payments settle everyone`;

// ---------- mobile result bar ----------
// Shown on phones when there is a result, the result panel is off screen and no field is being typed in.
const barState = { has: false, away: false, typing: false, inTool: true };
function syncBar() {
  const show = barState.has && barState.away && !barState.typing && barState.inTool;
  document.querySelector('[data-result-bar]')?.toggleAttribute('data-show', show);
}

// ---------- rendering ----------
let lastPaysKey = '';
const seen = new Set<number>();
let note = '';
let showText = false;
let personNote = '';

function render() {
  const r = compute();
  const byId = new Map(s.people.map((p) => [p.id, p]));
  const payerIds = new Set(s.expenses.map((e) => e.paidBy));
  const groupName = s.group.trim() || 'Untitled group';
  const hasExpenses = s.expenses.length > 0;
  const hasPays = r.pays.length > 0;
  const headline = headlineFor(hasExpenses, r.pays.length);

  // Keep keyboard focus on the same control across re-renders.
  const focused = document.activeElement as HTMLElement | null;
  const focusKey = focused?.dataset.action
    ? `[data-action="${focused.dataset.action}"][data-id="${focused.dataset.id}"]`
    : null;

  // 1 · people
  $('#people-count').textContent = `${s.people.length} ${s.people.length === 1 ? 'person' : 'people'}`;
  $('#people').innerHTML = s.people
    .map((p) => {
      const locked = payerIds.has(p.id);
      const fresh = !seen.has(p.id);
      seen.add(p.id);
      return `<li class="flex h-11 list-none items-center gap-2 rounded-full bg-raised py-0 pr-0.5 pl-1.5 text-sm font-semibold ${fresh ? 'animate-row-in' : ''}">
        <span class="av ${hue(p.id)}" aria-hidden="true">${initial(p.name)}</span><span class="max-w-[9rem] truncate">${esc(p.name)}</span>
        <button type="button" data-action="remove-person" data-id="${p.id}" ${locked ? 'disabled title="Delete their expenses first"' : ''}
          aria-label="Remove ${esc(p.name)}" class="flex size-10 items-center justify-center rounded-full text-subtle transition-colors hover:bg-expense-soft hover:text-expense disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-subtle">${icon(ICON_X, 16)}</button>
      </li>`;
    })
    .join('');
  $('#person-note').textContent = personNote;

  // 2 · expense form
  if (!byId.has(s.paidBy)) s.paidBy = s.people[0]?.id ?? 0;
  const payer = $<HTMLSelectElement>('#payer');
  payer.innerHTML = s.people.length
    ? s.people.map((p) => `<option value="${p.id}"${p.id === s.paidBy ? ' selected' : ''}>${esc(p.name)}</option>`).join('')
    : '<option value="">Add people</option>';
  payer.disabled = !s.people.length;

  const paise = parse($<HTMLInputElement>('#eamt').value);
  let hint = '';
  if (s.people.length < 2) hint = 'Add at least two people first.';
  else if (!paise) hint = 'Enter an amount.';
  $('#form-hint').textContent = hint;
  $<HTMLButtonElement>('#add-expense').disabled = hint !== '';
  $('#each').textContent = hint
    ? ''
    : paise && s.people.length > 1
      ? `${fmt(Math.floor(paise / s.people.length))} each for ${s.people.length} people`
      : `Split equally among everyone${s.people.length > 1 ? ` (${s.people.length})` : ''}`;

  const list = $('#expense-list');
  list.hidden = !hasExpenses;
  $('#expense-total').textContent = hasExpenses
    ? `${s.expenses.length} ${s.expenses.length === 1 ? 'expense' : 'expenses'} · ${fmt(r.total)}`
    : '';
  $('#expense-rows').innerHTML = s.expenses
    .slice()
    .reverse()
    .map((e) => {
      const p = byId.get(e.paidBy)!;
      const fresh = !seen.has(-e.id);
      seen.add(-e.id);
      return `<div class="flex items-center gap-3 border-t border-line py-2.5 first:border-t-0 ${fresh ? 'animate-row-in' : ''}">
        <span class="av size-9 ${hue(p.id)}" aria-hidden="true">${initial(p.name)}</span>
        <span class="flex min-w-0 flex-1 flex-col"><span class="truncate text-[15px] leading-[22px] font-semibold">${esc(e.title)}</span>
        <span class="truncate text-[13px] font-medium text-muted">Paid by ${esc(p.name)}</span></span>
        <span class="num text-base font-semibold whitespace-nowrap">${fmt(e.paise)}</span>
        <button type="button" data-action="remove-expense" data-id="${e.id}" aria-label="Delete ${esc(e.title)}"
          class="-mr-2 flex size-10 shrink-0 items-center justify-center rounded-full text-subtle transition-colors hover:bg-expense-soft hover:text-expense">${icon(ICON_TRASH, 17)}</button>
      </div>`;
    })
    .join('');

  // Result panel
  const paysKey = JSON.stringify(r.pays);
  const animate = paysKey !== lastPaysKey;
  lastPaysKey = paysKey;

  $('#group-upper').textContent = groupName.toUpperCase();
  $('#headline').textContent = headline;
  $('#subline').textContent = hasExpenses
    ? `${fmt(r.total)} total · ${fmt(Math.round(r.total / Math.max(1, s.people.length)))} each`
    : 'Who pays whom appears here.';

  const paysBox = $('#pays');
  paysBox.hidden = !hasPays;
  paysBox.innerHTML = r.pays
    .map((t, i) => {
      const a = byId.get(t.from)!;
      const b = byId.get(t.to)!;
      return `<div class="flex items-center gap-2.5 border-t border-line py-3 first:border-t-0 ${animate ? 'animate-row-in' : ''}" style="animation-delay:${i * 80}ms">
        <span class="av ${hue(a.id)}" aria-hidden="true">${initial(a.name)}</span>${icon(ICON_ARROW, 14, 'text-subtle')}
        <span class="av ${hue(b.id)}" aria-hidden="true">${initial(b.name)}</span>
        <span class="min-w-0 flex-1 text-[15px] leading-[21px] font-semibold [overflow-wrap:anywhere]">${esc(a.name)} pays ${esc(b.name)}</span>
        <span class="num text-base font-semibold whitespace-nowrap">${fmt(t.paise)}</span>
      </div>`;
    })
    .join('');

  $('#balances').hidden = !hasExpenses;
  $('#balance-rows').innerHTML = s.people
    .map((p) => {
      const n = r.net[p.id];
      const [text, cls] =
        n > 0 ? [`gets back ${fmt(n)}`, 'text-brand'] : n < 0 ? [`owes ${fmt(-n)}`, 'text-expense'] : ['settled', 'text-muted'];
      return `<div class="flex items-baseline justify-between gap-3 text-sm"><span class="min-w-0 truncate font-semibold">${esc(p.name)}</span><span class="num font-semibold whitespace-nowrap ${cls}">${text}</span></div>`;
    })
    .join('');

  // Mobile result bar
  $('#bar-headline').textContent = headline;
  $('#bar-sub').textContent = hasExpenses ? `${fmt(r.total)} total` : 'Add people and expenses';
  barState.has = hasExpenses;
  syncBar();

  // 3 · summary card (always light, like the image the app shares)
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  $('#sum-meta').textContent = `${groupName} · ${today}`;
  $('#sum-today').textContent = today;
  $('#sum-total').textContent = fmt(r.total);
  $('#sum-count').textContent = String(s.expenses.length);
  $('#sum-people').textContent = String(s.people.length);
  $('#sum-paid').innerHTML = s.people
    .map(
      (p) =>
        `<span class="inline-flex items-center gap-1.5 rounded-full bg-[#EEF1F0] px-2.5 py-1.5 text-xs"><b>${esc(p.name)}</b><span class="num font-semibold text-[#56615C]">${fmt(r.paid[p.id])}</span></span>`,
    )
    .join('');
  $('#sum-pays').innerHTML = hasPays
    ? r.pays
        .map((t) => {
          const a = byId.get(t.from)!;
          const b = byId.get(t.to)!;
          return `<div class="flex items-center gap-2 border-t border-[#E2E6E4] py-2.5 text-sm font-bold first:border-t-0">
            <span class="min-w-0 flex-1 [overflow-wrap:anywhere]">${esc(a.name)}</span>
            <span class="num inline-flex items-center gap-1 rounded-full bg-[#DCF4EC] px-2 py-1.5 text-[13px] whitespace-nowrap text-[#087A62]">${icon(ICON_ARROW, 13)}<span>${fmt(t.paise)}</span></span>
            <span class="min-w-0 flex-1 text-right [overflow-wrap:anywhere]">${esc(b.name)}</span>
          </div>`;
        })
        .join('')
    : `<span class="pt-2.5 text-[13px] text-[#56615C]">${hasExpenses ? 'Everyone is even. Nothing to pay.' : 'No expenses yet.'}</span>`;

  $<HTMLButtonElement>('#share').disabled = !hasExpenses;
  $<HTMLButtonElement>('#copy').disabled = !hasExpenses;
  $('#note').textContent = note;
  $('#text-wrap').hidden = !showText;
  $<HTMLTextAreaElement>('#sum-text').value = summaryText(r, groupName);

  if (focusKey) document.querySelector<HTMLElement>(focusKey)?.focus();
}

function summaryText(r: ReturnType<typeof compute>, group: string) {
  const byId = new Map(s.people.map((p) => [p.id, p]));
  const lines = [`Split summary · ${group}`, `Total ${fmt(r.total)} · ${s.people.length} people`, '', 'Who paid'];
  s.people.forEach((p) => lines.push(`${p.name} ${fmt(r.paid[p.id])}`));
  lines.push('', 'Who pays whom');
  if (r.pays.length) r.pays.forEach((t) => lines.push(`${byId.get(t.from)!.name} → ${byId.get(t.to)!.name} ${fmt(t.paise)}`));
  else lines.push('Everyone is even.');
  lines.push('', 'Made with PennyLog', PLAY_URL);
  return lines.join('\n');
}

/** Applies a state change; clears any share/copy message since the summary changed. */
function set(patch: Partial<typeof s>) {
  Object.assign(s, patch);
  note = '';
  showText = false;
  render();
}

function copyText(done: string) {
  const text = $<HTMLTextAreaElement>('#sum-text').value;
  const fail = () => {
    note = 'Copying is blocked here. Select the text below and copy it.';
    showText = true;
    render();
  };
  try {
    if (!navigator.clipboard?.writeText) return fail();
    navigator.clipboard.writeText(text).then(() => {
      note = done;
      showText = false;
      render();
    }, fail);
  } catch {
    fail();
  }
}

// ---------- wiring ----------
export function initSplit() {
  const groupInput = $<HTMLInputElement>('#grp');
  const nameInput = $<HTMLInputElement>('#pname');
  const titleInput = $<HTMLInputElement>('#etitle');
  const amountInput = $<HTMLInputElement>('#eamt');
  const payer = $<HTMLSelectElement>('#payer');
  const resetForm = () => {
    groupInput.value = s.group;
    nameInput.value = '';
    titleInput.value = '';
    amountInput.value = '';
  };

  groupInput.addEventListener('input', () => set({ group: groupInput.value }));
  amountInput.addEventListener('input', render);
  payer.addEventListener('change', () => {
    s.paidBy = Number(payer.value);
  });

  // Names can be typed one at a time or several at once: "Het, Smit, Manan".
  $<HTMLFormElement>('#person-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const taken = new Set(s.people.map((p) => p.name.toLowerCase()));
    const added: Person[] = [];
    const dupes: string[] = [];
    let id = s.nextId;
    for (const raw of nameInput.value.split(',')) {
      const name = raw.trim().slice(0, 20);
      if (!name) continue;
      if (taken.has(name.toLowerCase())) {
        dupes.push(name);
        continue;
      }
      taken.add(name.toLowerCase());
      added.push({ id: id++, name });
    }
    personNote = dupes.length ? `${dupes.join(', ')} ${dupes.length === 1 ? 'is' : 'are'} already in the group.` : '';
    nameInput.value = '';
    nameInput.focus();
    set({ people: [...s.people, ...added], nextId: id });
  });

  $<HTMLFormElement>('#expense-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const paise = parse(amountInput.value);
    const paidBy = Number(payer.value);
    if (s.people.length < 2 || !paise || !s.people.some((p) => p.id === paidBy)) return;
    set({
      expenses: [...s.expenses, { id: s.nextId, title: titleInput.value.trim() || 'Expense', paise, paidBy }],
      nextId: s.nextId + 1,
      paidBy,
    });
    titleInput.value = '';
    amountInput.value = '';
    render();
    amountInput.focus();
  });

  document.querySelector('[data-split]')!.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!btn || (btn as HTMLButtonElement).disabled) return;
    const id = Number(btn.dataset.id);
    switch (btn.dataset.action) {
      case 'remove-person':
        personNote = '';
        set({ people: s.people.filter((p) => p.id !== id) });
        break;
      case 'remove-expense':
        set({ expenses: s.expenses.filter((x) => x.id !== id) });
        break;
      case 'to-result':
        document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'share': {
        const group = s.group.trim() || 'Untitled group';
        const text = $<HTMLTextAreaElement>('#sum-text').value;
        if (navigator.share) {
          navigator.share({ title: `Split summary · ${group}`, text }).then(
            () => {
              note = 'Shared.';
              render();
            },
            () => {},
          );
        } else copyText('Sharing is not available in this browser, so the summary was copied instead.');
        break;
      }
      case 'copy':
        copyText('Summary copied. Paste it in the group chat.');
        break;
    }
  });

  new IntersectionObserver(([entry]) => {
    barState.away = !entry.isIntersecting;
    syncBar();
  }).observe($('#result-zone'));
  // Only while the reader is still in the tool, not further down the page.
  new IntersectionObserver(([entry]) => {
    barState.inTool = entry.isIntersecting;
    syncBar();
  }, { rootMargin: '0px 0px -40% 0px' }).observe($('[data-split]'));
  const split = $('[data-split]');
  split.addEventListener('focusin', (e) => {
    barState.typing = (e.target as HTMLElement).matches('input, select, textarea');
    syncBar();
  });
  split.addEventListener('focusout', () => {
    barState.typing = false;
    syncBar();
  });

  resetForm();
  render();
}
