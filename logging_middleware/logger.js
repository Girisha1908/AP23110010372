// Logging Middleware — Core implementation
// Sends structured log entries to the remote evaluation service.

const LOG_ENDPOINT = "http://20.207.122.201/evaluation-service/logs";

// Allowed values for validation
const ALLOWED_STACKS = ["frontend", "backend"];
const ALLOWED_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const ALLOWED_PACKAGES = [
  "api",
  "component",
  "hook",
  "page",
  "state",
  "style",
  "auth",
  "config",
  "middleware",
  "utils",
];

/**
 * Validates that a value belongs to an allowed set.
 * @param {string} value - The value to validate.
 * @param {string[]} allowed - Array of permitted values.
 * @param {string} label - Human-readable label for error context.
 * @returns {boolean} True if valid.
 */
function isValid(value, allowed, label) {
  if (typeof value !== "string" || !allowed.includes(value.toLowerCase())) {
    return false;
  }
  return true;
}

/**
 * Sends a structured log entry to the remote logging service.
 *
 * @param {string} stack    - "frontend" | "backend"
 * @param {string} level    - "debug" | "info" | "warn" | "error" | "fatal"
 * @param {string} pkg      - One of the allowed package names (e.g. "api", "component")
 * @param {string} message  - Descriptive, contextual log message
 */
async function Log(stack, level, pkg, message) {
  // Validate inputs before sending
  if (!isValid(stack, ALLOWED_STACKS, "stack")) return;
  if (!isValid(level, ALLOWED_LEVELS, "level")) return;
  if (!isValid(pkg, ALLOWED_PACKAGES, "package")) return;
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (_) {
    // Fail-safe: logging must never crash the application
  }
}

export { Log };
