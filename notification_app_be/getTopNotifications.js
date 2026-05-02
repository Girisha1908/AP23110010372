// stage1/getTopNotifications.js
// Fetches campus notifications from the API, computes priority, and returns top N.

import { Log } from "../logging_middleware/index.js";
import { TOKEN } from "../auth/token.js";

const NOTIFICATIONS_ENDPOINT =
    "http://20.207.122.201/evaluation-service/notifications";

// Priority weights by notification type
const TYPE_WEIGHTS = {
    Placement: 3,
    Result: 2,
    Event: 1,
};

/**
 * Fetches notifications from the remote API.
 * @returns {Array} Raw notification objects, or empty array on failure.
 */
async function fetchNotifications() {
    await Log(
        "backend",
        "info",
        "api",
        "initiating GET request to fetch campus notifications from evaluation service"
    );

    let response;
    try {
        response = await fetch(NOTIFICATIONS_ENDPOINT, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
            },
        });
    } catch (err) {
        await Log(
            "backend",
            "error",
            "api",
            `failed to fetch notifications: network error — ${err.message}`
        );
        return [];
    }

    if (!response.ok) {
        await Log(
            "backend",
            "error",
            "api",
            `notifications API returned non-OK status: ${response.status} ${response.statusText}`
        );
        return [];
    }

    await Log(
        "backend",
        "info",
        "api",
        `notifications API responded with status ${response.status} — parsing JSON body`
    );

    let data;
    try {
        data = await response.json();
    } catch (err) {
        await Log(
            "backend",
            "error",
            "api",
            `failed to parse notifications response as JSON: ${err.message}`
        );
        return [];
    }

    const notifications = data.notifications || [];

    await Log(
        "backend",
        "info",
        "api",
        `successfully fetched ${notifications.length} notifications from the API`
    );

    return notifications;
}

/**
 * Assigns a numeric weight based on notification type.
 * @param {string} type - "Placement" | "Result" | "Event"
 * @returns {number} Weight value (3, 2, or 1). Defaults to 0 for unknown types.
 */
function getTypeWeight(type) {
    return TYPE_WEIGHTS[type] || 0;
}

/**
 * Sorts notifications by priority:
 *   1. Type weight descending (Placement > Result > Event)
 *   2. Timestamp descending (newer first) as tiebreaker
 *
 * @param {Array} notifications - Array of notification objects.
 * @returns {Array} Sorted notifications (new array, original untouched).
 */
function sortByPriority(notifications) {
    return [...notifications].sort((a, b) => {
        const weightDiff = getTypeWeight(b.Type) - getTypeWeight(a.Type);
        if (weightDiff !== 0) return weightDiff;

        // Tiebreaker: newer timestamp first
        return new Date(b.Timestamp) - new Date(a.Timestamp);
    });
}

/**
 * Fetches campus notifications, computes priority, and returns the top N.
 *
 * Priority rules:
 *   - Placement (weight 3) > Result (weight 2) > Event (weight 1)
 *   - Within same type, newer timestamps rank higher
 *   - Always fetches fresh data (no caching)
 *
 * @param {number} N - Number of top-priority notifications to return.
 * @returns {Promise<Array>} Top N notifications sorted by priority.
 */
async function getTopNotifications(N) {
    await Log(
        "backend",
        "info",
        "utils",
        `getTopNotifications called with N=${N} — starting fresh fetch`
    );

    // Step 1: Fetch fresh data from API
    const notifications = await fetchNotifications();

    if (notifications.length === 0) {
        await Log(
            "backend",
            "warn",
            "utils",
            "no notifications available after fetch — returning empty result"
        );
        return [];
    }

    // Step 2: Compute priority via sorting
    await Log(
        "backend",
        "debug",
        "utils",
        `computing priority for ${notifications.length} notifications using type weights (Placement=3, Result=2, Event=1) and timestamp recency`
    );

    const sorted = sortByPriority(notifications);

    await Log(
        "backend",
        "debug",
        "utils",
        `sorting complete — highest priority: type="${sorted[0].Type}", id="${sorted[0].ID}"`
    );

    // Step 3: Slice top N
    const topN = sorted.slice(0, N);

    await Log(
        "backend",
        "info",
        "utils",
        `sliced top ${topN.length} notifications from ${sorted.length} total (requested N=${N})`
    );

    // Step 4: Log final output summary
    const typeCounts = topN.reduce((acc, n) => {
        acc[n.Type] = (acc[n.Type] || 0) + 1;
        return acc;
    }, {});

    await Log(
        "backend",
        "info",
        "utils",
        `returning ${topN.length} notifications — breakdown: ${JSON.stringify(typeCounts)}`
    );

    return topN;
}

// ─── Example execution ────────────────────────────────────────────────────────
async function main() {
    await Log(
        "backend",
        "info",
        "middleware",
        "stage1 example execution: calling getTopNotifications(10)"
    );

    const top = await getTopNotifications(10);

    // Output results to stdout (not console.log)
    process.stdout.write("\n=== TOP 10 NOTIFICATIONS BY PRIORITY ===\n\n");

    top.forEach((n, i) => {
        process.stdout.write(
            `${i + 1}. [${n.Type}] (weight=${getTypeWeight(n.Type)}) ID=${n.ID}\n` +
            `   Message: ${n.Message}\n` +
            `   Timestamp: ${n.Timestamp}\n\n`
        );
    });

    process.stdout.write(`Total returned: ${top.length}\n`);
}

main();

export { getTopNotifications };
