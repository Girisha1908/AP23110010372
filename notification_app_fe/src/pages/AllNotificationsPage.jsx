// AllNotificationsPage — displays all notifications with pagination and filtering
import { useState, useEffect } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationList from "../components/NotificationList.jsx";
import FilterBar from "../components/FilterBar.jsx";
import PaginationControls from "../components/PaginationControls.jsx";
import { useNotifications } from "../hooks/useNotifications.js";
import { Log } from "../api/logger.js";

export default function AllNotificationsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
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
    setPage(1); // Reset to first page when filter changes
  };

  // Determine if there might be more results
  const hasMore = notifications.length === limit;

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
          gap: 1.5,
          px: { xs: 2, sm: 3 },
          py: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <NotificationsActiveIcon sx={{ color: "#fff", fontSize: 24 }} />
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}>
          All Notifications
        </Typography>
      </Box>

      {/* Filter Bar */}
      <FilterBar currentFilter={filter} onFilterChange={handleFilterChange} />

      <Divider />

      {/* Notification List */}
      <NotificationList
        notifications={notifications}
        loading={loading}
        error={error}
      />

      <Divider />

      {/* Pagination */}
      <PaginationControls
        page={page}
        onPageChange={setPage}
        limit={limit}
        onLimitChange={setLimit}
        hasMore={hasMore}
      />
    </Paper>
  );
}
