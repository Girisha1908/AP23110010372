// Custom hook for fetching and managing notifications
import { useState, useEffect, useCallback } from "react";
import { fetchNotifications } from "../api/notifications.js";
import { Log } from "../api/logger.js";

/**
 * Hook to fetch notifications with pagination and filtering support.
 * @param {Object} options
 * @param {number} options.page - Current page
 * @param {number} options.limit - Items per page
 * @param {string} options.notificationType - Filter type
 * @returns {{ notifications, loading, error, refetch }}
 */
export function useNotifications({ page = 1, limit = 10, notificationType = "" } = {}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    await Log(
      "frontend", "debug", "hook",
      `useNotifications triggered — page=${page}, limit=${limit}, type=${notificationType || "All"}`
    );

    try {
      const result = await fetchNotifications({ page, limit, notificationType });
      setNotifications(result.notifications);

      await Log(
        "frontend", "info", "hook",
        `useNotifications received ${result.notifications.length} notifications`
      );
    } catch (err) {
      setError(err.message);

      await Log(
        "frontend", "error", "hook",
        `useNotifications fetch failed: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, notificationType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { notifications, loading, error, refetch: fetchData };
}
