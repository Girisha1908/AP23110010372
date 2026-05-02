// NotificationCard — matches screenshot design exactly
import { Card, CardContent, Typography, Box } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import { useReadState } from "../state/ReadStateContext.jsx";
import { Log } from "../api/logger.js";

export default function NotificationCard({ notification }) {
  const { markAsRead, isRead } = useReadState();
  const read = isRead(notification.ID);

  const handleClick = async () => {
    if (!read) {
      await markAsRead(notification.ID);
      await Log(
        "frontend", "info", "component",
        `notification card clicked — marked id="${notification.ID}" type="${notification.Type}" as read`
      );
    }
  };

  return (
    <Card
      id={`notification-card-${notification.ID}`}
      onClick={handleClick}
      sx={{
        mb: 1.5,
        cursor: "pointer",
        borderRadius: "8px",
        border: "1px solid #1976d2",
        background: "#fff",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        },
      }}
    >
      <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

          {/* LEFT — Big Blue Briefcase Icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <WorkIcon sx={{ fontSize: 50, color: "#1976d2" }} />
          </Box>

          {/* RIGHT — Content */}
          <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0.5 }}>
            {/* Type badge pill */}
            <Box>
              <Box
                component="span"
                sx={{
                  bgcolor: "#1976d2",
                  color: "#fff",
                  px: 1.5,
                  py: 0.25,
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  fontWeight: 400,
                  display: "inline-block"
                }}
              >
                {notification.Type}
              </Box>
            </Box>

            {/* Message */}
            <Typography
              variant="body1"
              sx={{
                fontWeight: 400,
                color: "#000",
                fontSize: "1.1rem",
                lineHeight: 1.3,
              }}
            >
              {notification.Message}
            </Typography>

            {/* Bottom Row: Timestamp and ID */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.5 }}>
              <Typography variant="body2" sx={{ color: "#333", fontSize: "0.9rem" }}>
                {notification.Timestamp}
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", fontSize: "0.9rem" }}>
                ID: {notification.ID.substring(0, 8)}...
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
