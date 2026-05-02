// NotificationList — renders a vertical list of NotificationCard components
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import NotificationCard from "./NotificationCard.jsx";

export default function NotificationList({ notifications, loading, error }) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} sx={{ color: "#4361ee" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 1, borderRadius: "10px" }}>
        {error}
      </Alert>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography variant="body2" sx={{ color: "#999" }}>
          No notifications found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {notifications.map((n) => (
        <NotificationCard key={n.ID} notification={n} />
      ))}
    </Box>
  );
}
