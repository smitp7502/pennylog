# Pay page (`/pay`)

The app's split settle-up shares one link per payment:

```
https://pennylog-app.vercel.app/pay?pa=<UPI ID>&pn=<payee name>&am=<amount>&cu=INR&tn=Split%20Expense
```

It is built by `UpiPaymentLink.webLink` in the app (`features/split_expense/services/upi_payment_link.dart`). The
page shows who to pay, the amount and the UPI ID, with **Copy UPI ID** and **Copy amount** buttons and three steps:
copy, open a UPI app and choose *Pay UPI ID*, paste and pay.

## Why it doesn't open the UPI app

Older app versions linked to a page that opened `upi://pay` straight away. NPCI circular **OC-76A** (12 March 2024,
in force 1 April 2024, restated in OC-76C) tells UPI apps to disallow **person-to-person intent payments**
(initiation modes 04/05, which is what opening `upi://pay` from a link is). Google Pay and Amazon Pay decline them
*after* the PIN with a vague "limit" error. Paying to a typed or pasted UPI ID is allowed with the normal limits,
so the page only shows and copies the details. **Don't add an "open UPI app" hand-off back.**

The same circular caps **QR share & pay** (a QR read from a photo or screenshot) at ₹2,000 for person-to-person
payments; the app's QR images say so. That limit doesn't affect this page.

## Behaviour

- `src/pages/pay.astro` is the markup; `src/scripts/pay.ts` fills it from the query string. Only `pa`, `pn` and
  `am` are read; `cu` and `tn` are ignored.
- `pa` must look like a UPI ID (`name@handle`) and `am`, if present, a positive amount with up to two decimals.
  Anything else shows "This payment link is incomplete". Values are written with `textContent`, never as HTML.
- With no `am` (the receiver QR pages in the app share none) the amount, its copy button and "enter the amount"
  step text adapt. The amount is shown as `₹2,500.00` (en-IN) and copied as `2500.00`.
- Copy uses the async clipboard API and falls back to a hidden textarea + `execCommand('copy')` for in-app
  browsers (WhatsApp, Instagram). If both fail, a note says to press and hold the UPI ID or type the amount.
- The intro screen is off (`Base` prop `intro={false}`): people open this page fresh from a chat every time.
- `noindex`, left out of `sitemap.xml`, and `vercel.json` sends `X-Robots-Tag: noindex`, `Referrer-Policy:
  no-referrer` (the URL holds a UPI ID and amount, so it must not leak to the Play Store link or anywhere else),
  `X-Frame-Options: DENY` and `nosniff`.
- No requests leave the browser; the details live only in the URL. Vercel's request logs see the URL like any
  other page view.

## Old links

Links shared before the app switched here point at `https://penny-log-ae1c4.web.app/pay` (Firebase Hosting). Its
source was removed from the app repo on 2026-10-28 and it is no longer deployed from there, so the live copy is
the older page that opens `upi://pay` (and fails for person-to-person payments, as above). It stays up until
Firebase Hosting is disabled for the `penny-log-ae1c4` project; then those old links stop working. If that happens,
update the "This website" section of `/privacy`.
