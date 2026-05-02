// AllNotificationsPage — clean layout: filter pills + notification cards + pagination
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import NotificationList from "../components/NotificationList.jsx";
import FilterBar from "../components/FilterBar.jsx";
import PaginationControls from "../components/PaginationControls.jsx";
import { useNotifications } from "../hooks/useNotifications.js";
import { Log } from "../api/logger.js";

export default function AllNotificationsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filter, setFilter] = useState("All");

  const { notifications, loading, error } = useNotifications({
    page,
    limit,
    notificationType: filter === "All" ? "" : filter,
  });

  useEffect(() => {
    Log(
      "frontend", "info", "page",
      "AllNotificationsPage mounted — initial render"
    );
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const hasMore = notifications.length === limit;

  return (
    <Box>
      {/* Filter pills */}
      <FilterBar currentFilter={filter} onFilterChange={handleFilterChange} />

      {/* Notification cards */}
      <NotificationList
        notifications={notifications}
        loading={loading}
        error={error}
      />

      {/* Pagination */}
      <PaginationControls
        page={page}
        onPageChange={setPage}
        hasMore={hasMore}
      />
    </Box>
  );
}
