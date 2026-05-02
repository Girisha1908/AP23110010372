// auth/getToken.js
// Fetches a fresh Bearer access_token using clientID and clientSecret.
// Run this after register.js and paste the token into auth/token.js.

const AUTH_ENDPOINT = "http://20.207.122.201/evaluation-service/auth";

// ─── Paste clientID and clientSecret from register.js output ──────────────────
const payload = {
  email: "girisha_anamala@srmap.edu.in",
  name: "Girisha Anamala",
  rollNo: "AP23110010372",
  accessCode: "QkbpxH",
  clientID: "edeb3df0-9f8b-4aa1-8d2b-e7b286b3d48d",
  clientSecret: "HTJJRNHvnjCcmXME",
};
// ──────────────────────────────────────────────────────────────────────────────

async function getToken() {
  const response = await fetch(AUTH_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    process.stdout.write(`Token fetch failed [${response.status}]: ${JSON.stringify(data)}\n`);
    process.exit(1);
  }

  // Copy the access_token below and paste it into auth/token.js
  process.stdout.write("=== ACCESS TOKEN ===\n");
  process.stdout.write(`access_token : ${data.access_token}\n`);
  process.stdout.write(`token_type   : ${data.token_type}\n`);
  process.stdout.write("====================\n");
  process.stdout.write("Paste access_token into auth/token.js as the TOKEN export.\n");
}

getToken();
