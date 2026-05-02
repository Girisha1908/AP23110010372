// API layer — all notification API calls go through here.
import { Log } from "./logger.js";

const API_BASE = "/evaluation-service";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJnaXJpc2hhX2FuYW1hbGFAc3JtYXAuZWR1LmluIiwiZXhwIjoxNzc3NzA3MDQzLCJpYXQiOjE3Nzc3MDYxNDMsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIzYmM3ZjBiYy04NmU2LTQ5MDUtOTUwNS03OTE1NTEwMGNkOGEiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJnaXJpc2hhIGFuYW1hbGEiLCJzdWIiOiJlZGViM2RmMC05ZjhiLTRhYTEtOGQyYi1lN2IyODZiM2Q0OGQifSwiZW1haWwiOiJnaXJpc2hhX2FuYW1hbGFAc3JtYXAuZWR1LmluIiwibmFtZSI6ImdpcmlzaGEgYW5hbWFsYSIsInJvbGxObyI6ImFwMjMxMTAwMTAzNzIiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJlZGViM2RmMC05ZjhiLTRhYTEtOGQyYi1lN2IyODZiM2Q0OGQiLCJjbGllbnRTZWNyZXQiOiJIVEpKUk5Idm5qQ2NtWE1FIn0.cRBfI3nX5kUap_x9Xz9yh__kJsOBG969DVHt855OD-g";

/**
 * Fetches notifications from the evaluation service.
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (1-indexed)
 * @param {number} params.limit - Results per page
 * @param {string} [params.notificationType] - Optional type filter
 * @returns {Promise<{notifications: Array, total: number}>}
 */
export async function fetchNotifications({ page = 1, limit = 10, notificationType = "" } = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));

  if (notificationType && notificationType !== "All") {
    params.set("notification_type", notificationType);
  }

  const url = `${API_BASE}/notifications?${params.toString()}`;

  await Log(
    "frontend", "info", "api",
    `fetching notifications — page=${page}, limit=${limit}, type=${notificationType || "All"}`
  );

  let response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
      },
    });
  } catch (err) {
    await Log(
      "frontend", "error", "api",
      `failed to fetch notifications: network error — ${err.message}`
    );
    throw new Error("Network error while fetching notifications");
  }

  if (!response.ok) {
    await Log(
      "frontend", "error", "api",
      `notifications API returned non-OK status: ${response.status} ${response.statusText}`
    );
    throw new Error(`API error: ${response.status}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    await Log(
      "frontend", "error", "api",
      `failed to parse notifications response as JSON: ${err.message}`
    );
    throw new Error("Failed to parse response");
  }

  const notifications = data.notifications || [];

  await Log(
    "frontend", "info", "api",
    `successfully fetched ${notifications.length} notifications for page ${page}`
  );

  return { notifications, total: notifications.length };
}
