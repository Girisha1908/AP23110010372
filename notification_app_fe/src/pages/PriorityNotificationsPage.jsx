import { useState, useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import NotificationList from "../components/NotificationList.jsx";
import FilterBar from "../components/FilterBar.jsx";
import { fetchNotifications } from "../api/notifications.js";
import { Log } from "../api/logger.js";

const TYPE_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function sortByPriority(notifications) {
  return [...notifications].sort((a, b) => {
    const weightDiff = (TYPE_WEIGHTS[b.Type] || 0) - (TYPE_WEIGHTS[a.Type] || 0);
    if (weightDiff !== 0) return weightDiff;
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });
}

export default function PriorityNotificationsPage() {
  const [topN] = useState(10);
  const [filter, setFilter] = useState("Placement"); // Default active as in screenshot
  const [allSorted, setAllSorted] = useState([]);
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
      const all = [];
      const pagesToFetch = 5;

      for (let p = 1; p <= pagesToFetch; p++) {
        const result = await fetchNotifications({ page: p, limit: 10 });
        all.push(...result.notifications);
        if (result.notifications.length < 10) break;
      }

      const sorted = sortByPriority(all);
      const sliced = sorted.slice(0, topN);
      setAllSorted(sliced);
      
      // Default to placement filter if set
      setNotifications(sliced.filter((n) => n.Type === "Placement"));

      await Log(
        "frontend", "info", "component",
        `priority notifications rendered`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [topN]);

  useEffect(() => {
    fetchAndSort();
  }, [fetchAndSort]);

  const handleFilterChange = async (newFilter) => {
    setFilter(newFilter);
    if (newFilter === "All") {
      setNotifications(allSorted);
    } else {
      setNotifications(allSorted.filter((n) => n.Type === newFilter));
    }
    await Log(
      "frontend", "info", "component",
      `filter changed to ${newFilter}`
    );
  };

  return (
    <Box>
      <Typography
        variant="body1"
        sx={{
          color: "#333",
          mb: 1.5,
          textAlign: "center"
        }}
      >
        Sorted by Priority (Placement &gt; Result &gt; Event, then recency)
      </Typography>

      <FilterBar currentFilter={filter} onFilterChange={handleFilterChange} />

      <Box sx={{ mt: 1 }}>
        <NotificationList
          notifications={notifications}
          loading={loading}
          error={error}
        />
      </Box>
    </Box>
  );
}
