// Gets a short-lived Google access token from the Firebase CLI login on this machine
// (`firebase login`), using the CLI's own OAuth client, so no credentials live in this repo.
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

export async function getAccessToken() {
  if (process.env.GOOGLE_OAUTH_ACCESS_TOKEN) return process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
  const store = JSON.parse(readFileSync(join(homedir(), '.config', 'configstore', 'firebase-tools.json'), 'utf8'));
  const refresh = store.tokens?.refresh_token;
  if (!refresh) throw new Error('Not logged in: run `firebase login` first.');
  const globalRoot = execSync('npm root -g').toString().trim();
  const api = createRequire(join(globalRoot, 'firebase-tools', 'package.json'))('./lib/api.js');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh, client_id: api.clientId(), client_secret: api.clientSecret() }),
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}
