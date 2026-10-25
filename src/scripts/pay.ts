// /pay: shows a payment shared from the app (pa = UPI ID, pn = name, am = amount) with copy buttons.
// It never opens upi://pay: NPCI (OC-76A, April 2024) makes UPI apps decline person-to-person payments
// started from a link, after the PIN. Paying to a pasted UPI ID is allowed. See docs/pay-page.md.

const UPI_ID = /^[A-Za-z0-9._-]{2,256}@[A-Za-z0-9.-]{2,64}$/;
const AMOUNT = /^\d{1,7}(\.\d{1,2})?$/;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

// Older in-app browsers (and http) have no async clipboard; fall back to a hidden textarea.
function legacyCopy(text: string): boolean {
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  field.remove();
  return ok;
}

async function copy(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // blocked (e.g. no user activation in a webview): try the old way
    }
  }
  return legacyCopy(text);
}

function bindCopy(id: string, text: string, done: string, fail: string) {
  const btn = $<HTMLButtonElement>(id);
  const label = btn.querySelector('span')!;
  const idle = label.textContent;
  const note = $<HTMLParagraphElement>('pay-note');
  btn.addEventListener('click', async () => {
    const ok = await copy(text);
    note.textContent = ok ? '' : fail;
    if (!ok) return;
    label.textContent = done;
    setTimeout(() => (label.textContent = idle), 2000);
  });
}

export function initPay() {
  const q = new URLSearchParams(location.search);
  const pa = (q.get('pa') ?? '').trim();
  const pn = (q.get('pn') ?? '').trim();
  const am = (q.get('am') ?? '').trim();

  if (!UPI_ID.test(pa) || (am !== '' && !AMOUNT.test(am))) {
    $('pay-invalid').hidden = false;
    return;
  }

  $('pay-name').textContent = pn || pa;
  $('pay-upi').textContent = pa;
  bindCopy('copy-upi', pa, 'UPI ID copied', 'Copying is blocked here. Press and hold the UPI ID to copy it.');

  if (am !== '') {
    const amount = Number(am).toFixed(2);
    const shown = Number(am).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const amountEl = $('pay-amount');
    amountEl.textContent = `₹${shown}`;
    amountEl.hidden = false;
    $('pay-amount-step').textContent = `, enter ₹${shown}`;
    $('copy-amount').hidden = false;
    bindCopy('copy-amount', amount, 'Amount copied', `Copying is blocked here. Enter ₹${shown} in your UPI app.`);
  }

  $('pay-card').hidden = false;
}
