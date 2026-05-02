// Browser-compatible logging middleware
// Sends structured log entries to the remote evaluation service via POST

const LOG_ENDPOINT = "/evaluation-service/logs";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJnaXJpc2hhX2FuYW1hbGFAc3JtYXAuZWR1LmluIiwiZXhwIjoxNzc3NzA1NTM5LCJpYXQiOjE3Nzc3MDQ2MzksImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJkOGNhYmNhYS0zY2IzLTQwOWQtYWYyMC01NjAyZjczYzI3ZDMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJnaXJpc2hhIGFuYW1hbGEiLCJzdWIiOiJlZGViM2RmMC05ZjhiLTRhYTEtOGQyYi1lN2IyODZiM2Q0OGQifSwiZW1haWwiOiJnaXJpc2hhX2FuYW1hbGFAc3JtYXAuZWR1LmluIiwibmFtZSI6ImdpcmlzaGEgYW5hbWFsYSIsInJvbGxObyI6ImFwMjMxMTAwMTAzNzIiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJlZGViM2RmMC05ZjhiLTRhYTEtOGQyYi1lN2IyODZiM2Q0OGQiLCJjbGllbnRTZWNyZXQiOiJIVEpKUk5Idm5qQ2NtWE1FIn0.MpjiRBUrPHDcbmYoEBFsjaDGEo6aGOPbbzyL74cp6w8";

const ALLOWED_STACKS = ["frontend", "backend"];
const ALLOWED_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const ALLOWED_PACKAGES = [
  "api", "component", "hook", "page", "state", "style",
  "auth", "config", "middleware", "utils",
];

function isValid(value, allowed) {
  return typeof value === "string" && allowed.includes(value.toLowerCase());
}

/**
 * Sends a structured log entry to the remote logging service.
 * Fail-safe — never throws or crashes the application.
 */
export async function Log(stack, level, pkg, message) {
  if (!isValid(stack, ALLOWED_STACKS)) return;
  if (!isValid(level, ALLOWED_LEVELS)) return;
  if (!isValid(pkg, ALLOWED_PACKAGES)) return;
  if (typeof message !== "string" || message.trim() === "") return;

  const body = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: pkg.toLowerCase(),
    message: message,
  };

  try {
    await fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(body),
    });
  } catch (_) {
    // Fail-safe: logging must never crash the application
  }
}
