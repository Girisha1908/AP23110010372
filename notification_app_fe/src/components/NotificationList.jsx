// NotificationList — renders a list of NotificationCard components
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import NotificationCard from "./NotificationCard.jsx";

export default function NotificationList({
  notifications,
  loading,
  error,
  showWeight = false,
  weights = {},
}) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress sx={{ color: "#6C63FF" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography variant="body1" sx={{ color: "#999" }}>
          No notifications found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, py: 1 }}>
      {notifications.map((n) => (
        <NotificationCard
          key={n.ID}
          notification={n}
          showWeight={showWeight}
          weight={weights[n.Type] || 0}
        />
      ))}
    </Box>
  );
}
