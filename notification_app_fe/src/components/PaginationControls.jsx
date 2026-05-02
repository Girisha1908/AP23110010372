// PaginationControls — clean minimal page navigation
import { Box, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Log } from "../api/logger.js";

export default function PaginationControls({ page, onPageChange, hasMore }) {
  const handlePrev = async () => {
    if (page > 1) {
      onPageChange(page - 1);
      await Log(
        "frontend", "debug", "component",
        `pagination: navigated to previous page ${page - 1}`
      );
    }
  };

  const handleNext = async () => {
    if (hasMore) {
      onPageChange(page + 1);
      await Log(
        "frontend", "debug", "component",
        `pagination: navigated to next page ${page + 1}`
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        py: 2,
      }}
    >
      <IconButton
        id="pagination-prev"
        onClick={handlePrev}
        disabled={page <= 1}
        size="small"
        sx={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          width: 32,
          height: 32,
          color: page > 1 ? "#4361ee" : "#ccc",
        }}
      >
        <ChevronLeftIcon fontSize="small" />
      </IconButton>

      <Typography
        variant="body2"
        sx={{ fontWeight: 600, color: "#444", minWidth: 60, textAlign: "center" }}
      >
        Page {page}
      </Typography>

      <IconButton
        id="pagination-next"
        onClick={handleNext}
        disabled={!hasMore}
        size="small"
        sx={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          width: 32,
          height: 32,
          color: hasMore ? "#4361ee" : "#ccc",
        }}
      >
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
