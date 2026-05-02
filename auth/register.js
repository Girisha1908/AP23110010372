
const REGISTER_ENDPOINT = "http://20.207.122.201/evaluation-service/register";

// ─── details ───────────────────────────────────────────────
const payload = {
  email: "girisha_anamala@srmap.edu.in",
  name: "Girisha Anamala",
  mobileNo: "9653126962",
  githubUsername: "Girisha1908",
  rollNo: "AP23110010372",
  accessCode: "QkbpxH",
};
// ──────────────────────────────────────────────────────────────────────────────

async function register() {
  const response = await fetch(REGISTER_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    process.stdout.write(`Registration failed [${response.status}]: ${JSON.stringify(data)}\n`);
    process.exit(1);
  }

  // ⚠️  IMPORTANT: Copy these values immediately — they cannot be retrieved again.
  process.stdout.write("=== REGISTRATION SUCCESSFUL ===\n");
  process.stdout.write(`clientID     : ${data.clientID}\n`);
  process.stdout.write(`clientSecret : ${data.clientSecret}\n`);
  process.stdout.write("================================\n");
  process.stdout.write("Save these values now — paste them into auth/getToken.js and auth/token.js.\n");
}

register();
