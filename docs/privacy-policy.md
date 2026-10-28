# Privacy policy: where each claim comes from

[`src/pages/privacy.astro`](../src/pages/privacy.astro) describes what the **real app** does. This file maps each
claim to the code in the Flutter app (`../../Flutter/app`) that it was checked against on 2026-10-09; the People,
UPI and pay page rows were checked on 2026-10-28 against the app's `upi-pay-fix` branch (schema v14). When the app
changes in any of these places, re-check the claim and update both the page and this table.

| Policy section | Claim | Checked against (Flutter app) |
| --- | --- | --- |
| What the app stores | Records, accounts, categories, budgets, templates, recurring schedules, people, split groups and preferences are kept in a database on the phone | Drift DB `lib/src/core/data/local/app_db/app_db.dart` (schema v14) |
| People and UPI IDs | One People list (`Tags` table): name, relation, colour, optional `upiId`; "Me" also holds `realName` (v14). Split members link to these rows | `Tags` in `app_db.dart`; `SplitContactsRepository`; app CLAUDE.md "v13 — one People list" |
| | Entries are typed in by the user; no contacts permission | No `READ_CONTACTS` in `AndroidManifest.xml` |
| | Real name is asked when "Me" is first put in a split group and used only in split groups and what is shared from them | `askMyNameIfNeeded`, `SplitContactModel.nameInGroups` |
| | People and UPI IDs appear in backups (local file and Drive) and the Excel export's person column | `BackupDataService` exports `tags`; `excel_export_service.dart` writes `record.tag?.name` |
| | Removing a person untags records and leaves their name in split groups; Delete & reset keeps people in a split group | App CLAUDE.md "v13 — one People list" |
| | No names, UPI IDs or real name in analytics; split events carry only a member-count bucket (`1-2` / `3-5` / `6+`) | `analytics_service.dart` (`memberCountBucket`, `logSplitGroupCreated`); no tag or UPI events |
| | Logs stay on the phone | `errorLog` in `lib/src/common/utils/app_logger.dart` is `dart:developer` only; Crashlytics gets crash errors, not these logs |
| Split sharing | Messages carry the group name, who pays whom, amounts, the payee's UPI ID on its own line and a pay link with `pa`/`pn`/`am` in the query string | `UpiPaymentLink.debtShareText` / `groupShareText` / `webLink` |
| | QR codes are `upi://pay` with UPI ID, name and (for one payment) amount | `UpiPaymentLink.upiUri`, `upi_qr_sheet.dart`, `exportable_split_summary.dart` |
| | UPI rules: no P2P payment from a link; ₹2,000 cap on a QR read from a photo | NPCI OC-76A / OC-76C; app CLAUDE.md "UPI payments"; [pay-page.md](pay-page.md) |
| | The app never asks for a UPI PIN, bank details or card numbers | No payment SDK in `pubspec.yaml`; payments happen in the payer's UPI app |
| Google Drive backup | Off until the user turns it on; manual or scheduled | `lib/src/core/services/automatic_backup_service.dart` (WorkManager schedule), backup screen |
| | Access is limited to files the app creates; no name, email or profile is requested | `lib/src/core/services/google_drive_service.dart`: `_scopes` holds only `drive.file` (openid/profile/email are commented out) |
| | The sign-in token is kept in secure storage | `flutter_secure_storage` in `google_drive_service.dart` |
| Analytics | Firebase Analytics events carry the record type, category, account type and an amount **range** (small/medium/large), plus things like member count, currency, theme and export format. Never exact amounts, notes, account names or people's names | `lib/src/core/services/analytics_service.dart`; CLAUDE.md rule "never log raw amounts" |
| Crash reports | Firebase Crashlytics | `firebase_crashlytics` in `pubspec.yaml` |
| Update check | At launch the app reads the public `app_config/android` document from Cloud Firestore (no sign-in, nothing about the user is sent) and asks Google Play whether the update is available | `lib/src/features/app_update/application/app_update_service.dart` (`cloud_firestore`, `in_app_update`); rules in this repo's `firestore.rules` |
| Notifications | Firebase Cloud Messaging delivery token | `lib/src/core/services/firebase_notification_service.dart` |
| Permissions | Notifications, exact alarms, run at startup, vibration, internet, storage on Android 12 and older only | `android/app/src/main/AndroidManifest.xml`: `POST_NOTIFICATIONS`, `USE_EXACT_ALARM`/`SCHEDULE_EXACT_ALARM`, `RECEIVE_BOOT_COMPLETED`, `VIBRATE`, `INTERNET`, `READ_EXTERNAL_STORAGE` (maxSdk 32), `WRITE_EXTERNAL_STORAGE` (maxSdk 29) |
| | What notifications are for: daily reminder, budget alerts, backup and export progress | `lib/src/core/services/notification_service.dart` (`zonedSchedule` reminder, `showBudgetExceeded`, `showBackup*`, `showExportComplete`) |
| | No SMS, contacts, location, microphone or camera | `READ_SMS`, `RECEIVE_SMS` and `RECORD_AUDIO` are **commented out** in the manifest |
| No ads | No ad SDK | `pubspec.yaml` dependencies |
| This website | No cookies or analytics; fonts self-hosted; the split tool runs in the browser; only `/whats-new` contacts Google (Firestore) to load release notes | This repo (Fontsource packages, no tracking scripts, `src/scripts/releases.ts`) |
| | `/pay` reads the details from its own URL, sends nothing, stores nothing, doesn't open a UPI app, is `noindex` and `no-referrer`; old links use the same page on Firebase Hosting | `src/scripts/pay.ts`, `vercel.json`; app `hosting/public/pay.html`; [pay-page.md](pay-page.md) |
| | Hosting logs may include the page address, which for a pay link holds the UPI ID, name and amount | Vercel and Firebase Hosting request logs |

## Watch list

If any of these change, the policy is wrong until updated:

- **Ships in the app but isn't used yet:** `google_generative_ai` and `firebase_remote_config` are in `pubspec.yaml`
  but not imported under `lib/`. Using Gemini would send user content to Google, so it needs a new policy section.
- **SMS import and voice entry** (`features/fetch_from_sms`, `speech_to_text`) are disabled. Turning either on adds
  a permission and a data flow.
- **Backup encryption:** the backup is AES-encrypted with a key hard-coded in `automatic_backup_service.dart`, so the
  policy deliberately makes **no** encryption claim. Revisit if a per-user key is introduced.
- **Website analytics or hosting:** adding analytics or cookies here changes the "This website" section.
- **Pay page or share text:** if a shared message, QR or pay link starts carrying more than the group name, names,
  amounts and UPI IDs, or `/pay` starts sending its details anywhere, update "Split expenses and sharing" and "This
  website".
- **People:** reading phone contacts, syncing people, or adding names or UPI IDs to analytics would contradict the
  "People and UPI IDs" section.
- **Web dashboard:** the `web-dashboard` branches (app and site) send data from the phone to a browser. They are not
  on `master` and the policy doesn't cover them yet; add a section before they ship.
- **The app still links to the old policy:** the app's privacy link (`_privacyPolicyUrl` in
  `features/drawer/custom_drawer.dart`) points at `smit-010.github.io/Pennylog-privacy-policy/`. Point it, and the
  Play Console privacy URL, at this site's `/privacy` once it is live.

## Still to fill

Support email (timsved57@gmail.com), developer (Smit Prajapati) and location (Gujarat, India) are set in `src/config.ts`; `[EFFECTIVE DATE]` there is still a placeholder. The
"not directed at children under 13" line is a policy decision; confirm it.
