// PriorityNotificationsPage — shows top N notifications sorted by priority
// Reuses Stage 1 logic: weight (Placement=3, Result=2, Event=1) + timestamp DESC
import { useState, useEffect, useCallback } from "react";
import { Box, Typography, Paper, Divider, Select, MenuItem, FormControl } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import NotificationList from "../components/NotificationList.jsx";
import { fetchNotifications } from "../api/notifications.js";
import { Log } from "../api/logger.js";

// Priority weights — identical to Stage 1
const TYPE_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Sorts notifications by priority (same logic as Stage 1).
 * 1. Type weight descending
 * 2. Timestamp descending (tiebreaker)
 */
function sortByPriority(notifications) {
  return [...notifications].sort((a, b) => {
    const weightDiff = (TYPE_WEIGHTS[b.Type] || 0) - (TYPE_WEIGHTS[a.Type] || 0);
    if (weightDiff !== 0) return weightDiff;
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });
}

export default function PriorityNotificationsPage() {
  const [topN, setTopN] = useState(10);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAndSort = useCallback(async () => {
    setLoading(true);
    setError(null);

    await Log(
      "frontend", "info", "page",
      `PriorityNotificationsPage: fetching all notifications to compute top ${topN} by priority`
    );

    try {
      // Fetch multiple pages to gather enough data for priority sorting
      // API limit is capped at 10 per page, so fetch several pages
      const allNotifications = [];
      const pagesToFetch = 5; // 5 pages × 10 = 50 notifications max

      for (let p = 1; p <= pagesToFetch; p++) {
        const result = await fetchNotifications({ page: p, limit: 10 });
        allNotifications.push(...result.notifications);

        // Stop early if we got fewer than the limit (no more data)
        if (result.notifications.length < 10) break;
      }

      await Log(
        "frontend", "debug", "utils",
        `computing priority for ${allNotifications.length} notifications using weights: Placement=3, Result=2, Event=1`
      );

      const sorted = sortByPriority(allNotifications);

      await Log(
        "frontend", "debug", "utils",
        `priority sorting complete — slicing top ${topN} from ${sorted.length} total`
      );

      const sliced = sorted.slice(0, topN);
      setNotifications(sliced);

      // Build type breakdown for logging
      const typeCounts = sliced.reduce((acc, n) => {
        acc[n.Type] = (acc[n.Type] || 0) + 1;
        return acc;
      }, {});

      await Log(
        "frontend", "info", "page",
        `PriorityNotificationsPage: displaying ${sliced.length} priority notifications — breakdown: ${JSON.stringify(typeCounts)}`
      );
    } catch (err) {
      setError(err.message);
      await Log(
        "frontend", "error", "page",
        `PriorityNotificationsPage: failed to fetch/sort notifications — ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  }, [topN]);

  useEffect(() => {
    Log(
      "frontend", "info", "page",
      "PriorityNotificationsPage mounted — initial render"
    );
  }, []);

  useEffect(() => {
    fetchAndSort();
  }, [fetchAndSort]);

  const handleTopNChange = async (e) => {
    const newN = e.target.value;
    setTopN(newN);
    await Log(
      "frontend", "debug", "state",
      `priority page: top N changed to ${newN}`
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "#fff",
        border: "1px solid #f0f0f0",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          px: { xs: 2, sm: 3 },
          py: 2,
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <StarIcon sx={{ color: "#fff", fontSize: 24 }} />
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}>
            Priority Notifications
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
            Show top:
          </Typography>
          <FormControl size="small">
            <Select
              id="priority-top-n-select"
              value={topN}
              onChange={handleTopNChange}
              sx={{
                fontSize: "0.8rem",
                height: 30,
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.15)",
                "& .MuiSelect-icon": { color: "#fff" },
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Priority legend */}
      <Box sx={{ display: "flex", gap: 2, px: { xs: 2, sm: 3 }, py: 1.5, flexWrap: "wrap" }}>
        {Object.entries(TYPE_WEIGHTS).map(([type, weight]) => (
          <Typography key={type} variant="caption" sx={{ color: "#888" }}>
            <strong>{type}</strong> = weight {weight}
          </Typography>
        ))}
      </Box>

      <Divider />

      {/* Notification List */}
      <NotificationList
        notifications={notifications}
        loading={loading}
        error={error}
        showWeight={true}
        weights={TYPE_WEIGHTS}
      />
    </Paper>
  );
}
