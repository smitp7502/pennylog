# Privacy policy: where each claim comes from

[`src/pages/privacy.astro`](../src/pages/privacy.astro) describes what the **real app** does. This file maps each
claim to the code in the Flutter app (`../../Flutter/app`) that it was checked against on 2026-10-09. When the app
changes in any of these places, re-check the claim and update both the page and this table.

| Policy section | Claim | Checked against (Flutter app) |
| --- | --- | --- |
| What the app stores | Records, accounts, categories, budgets, templates, recurring schedules, tags, split groups (with names and UPI IDs) and preferences are kept in a database on the phone | Drift DB `lib/src/core/data/local/app_db/app_db.dart` (schema v12) |
| Google Drive backup | Off until the user turns it on; manual or scheduled | `lib/src/core/services/automatic_backup_service.dart` (WorkManager schedule), backup screen |
| | Access is limited to files the app creates; no name, email or profile is requested | `lib/src/core/services/google_drive_service.dart`: `_scopes` holds only `drive.file` (openid/profile/email are commented out) |
| | The sign-in token is kept in secure storage | `flutter_secure_storage` in `google_drive_service.dart` |
| Analytics | Firebase Analytics events carry the record type, category, account type and an amount **range** (small/medium/large), plus things like member count, currency, theme and export format. Never exact amounts, notes, account names or people's names | `lib/src/core/services/analytics_service.dart`; CLAUDE.md rule "never log raw amounts" |
| Crash reports | Firebase Crashlytics | `firebase_crashlytics` in `pubspec.yaml` |
| Notifications | Firebase Cloud Messaging delivery token | `lib/src/core/services/firebase_notification_service.dart` |
| Permissions | Notifications, exact alarms, run at startup, vibration, internet, storage on Android 12 and older only | `android/app/src/main/AndroidManifest.xml`: `POST_NOTIFICATIONS`, `USE_EXACT_ALARM`/`SCHEDULE_EXACT_ALARM`, `RECEIVE_BOOT_COMPLETED`, `VIBRATE`, `INTERNET`, `READ_EXTERNAL_STORAGE` (maxSdk 32), `WRITE_EXTERNAL_STORAGE` (maxSdk 29) |
| | What notifications are for: daily reminder, budget alerts, backup and export progress | `lib/src/core/services/notification_service.dart` (`zonedSchedule` reminder, `showBudgetExceeded`, `showBackup*`, `showExportComplete`) |
| | No SMS, contacts, location, microphone or camera | `READ_SMS`, `RECEIVE_SMS` and `RECORD_AUDIO` are **commented out** in the manifest |
| No ads | No ad SDK | `pubspec.yaml` dependencies |
| This website | No cookies or analytics; fonts self-hosted; the split tool runs in the browser; only `/whats-new` contacts Google (Firestore) to load release notes | This repo (Fontsource packages, no tracking scripts, `src/scripts/releases.ts`) |

## Watch list

If any of these change, the policy is wrong until updated:

- **Ships in the app but isn't used yet:** `google_generative_ai` and `firebase_remote_config` are in `pubspec.yaml`
  but not imported under `lib/`. Using Gemini would send user content to Google, so it needs a new policy section.
- **SMS import and voice entry** (`features/fetch_from_sms`, `speech_to_text`) are disabled. Turning either on adds
  a permission and a data flow.
- **Backup encryption:** the backup is AES-encrypted with a key hard-coded in `automatic_backup_service.dart`, so the
  policy deliberately makes **no** encryption claim. Revisit if a per-user key is introduced.
- **Website analytics or hosting:** adding analytics or cookies here changes the "This website" section.
- **The app still links to the old policy:** the app's privacy link (`_privacyPolicyUrl` in
  `features/drawer/custom_drawer.dart`) points at `smit-010.github.io/Pennylog-privacy-policy/`. Point it, and the
  Play Console privacy URL, at this site's `/privacy` once it is live.

## Still to fill

Support email (timsved57@gmail.com), developer (Smit Prajapati) and location (Gujarat, India) are set in `src/config.ts`; `[EFFECTIVE DATE]` there is still a placeholder. The
"not directed at children under 13" line is a policy decision; confirm it.
