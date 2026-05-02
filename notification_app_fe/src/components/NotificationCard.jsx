// NotificationCard — displays a single notification with read/unread visual state
import { Card, CardContent, Typography, Chip, Box, IconButton } from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import WorkIcon from "@mui/icons-material/Work";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useReadState } from "../state/ReadStateContext.jsx";
import { Log } from "../api/logger.js";

// Map notification type to color and icon
const TYPE_CONFIG = {
  Placement: { color: "#6C63FF", bg: "rgba(108, 99, 255, 0.08)", icon: WorkIcon, label: "Placement" },
  Result:    { color: "#00BFA6", bg: "rgba(0, 191, 166, 0.08)", icon: AssessmentIcon, label: "Result" },
  Event:     { color: "#FF6D00", bg: "rgba(255, 109, 0, 0.08)", icon: EmojiEventsIcon, label: "Event" },
};

export default function NotificationCard({ notification, showWeight = false, weight = 0 }) {
  const { markAsRead, isRead } = useReadState();
  const read = isRead(notification.ID);
  const config = TYPE_CONFIG[notification.Type] || TYPE_CONFIG.Event;
  const TypeIcon = config.icon;

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
        opacity: read ? 0.6 : 1,
        borderLeft: `4px solid ${config.color}`,
        background: read ? "#f5f5f5" : "#fff",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      }}
      elevation={read ? 0 : 1}
    >
      <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          {/* Read/Unread indicator */}
          <Box sx={{ pt: 0.3 }}>
            {read ? (
              <CheckCircleOutlinedIcon sx={{ color: "#bdbdbd", fontSize: 20 }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ color: config.color, fontSize: 20 }} />
            )}
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
              <Chip
                icon={<TypeIcon sx={{ fontSize: 14 }} />}
                label={config.label}
                size="small"
                sx={{
                  bgcolor: config.bg,
                  color: config.color,
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  height: 24,
                  "& .MuiChip-icon": { color: config.color },
                }}
              />
              {showWeight && (
                <Chip
                  label={`Priority ${weight}`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(0,0,0,0.04)",
                    fontWeight: 500,
                    fontSize: "0.65rem",
                    height: 22,
                  }}
                />
              )}
              <Typography
                variant="caption"
                sx={{ color: "#999", ml: "auto", whiteSpace: "nowrap" }}
              >
                {notification.Timestamp}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                fontWeight: read ? 400 : 600,
                color: read ? "#888" : "#222",
                lineHeight: 1.4,
              }}
            >
              {notification.Message}
            </Typography>

            <Typography variant="caption" sx={{ color: "#bbb", fontSize: "0.65rem" }}>
              ID: {notification.ID.substring(0, 8)}...
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
