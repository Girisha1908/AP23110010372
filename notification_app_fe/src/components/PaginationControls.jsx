// PaginationControls — page navigation for notification lists
import { Box, IconButton, Typography, Select, MenuItem, FormControl } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Log } from "../api/logger.js";

export default function PaginationControls({
  page,
  onPageChange,
  limit,
  onLimitChange,
  hasMore,
}) {
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

  const handleLimitChange = async (e) => {
    const newLimit = e.target.value;
    onLimitChange(newLimit);
    onPageChange(1); // Reset to first page on limit change
    await Log(
      "frontend", "debug", "component",
      `pagination: items per page changed to ${newLimit}, reset to page 1`
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        py: 2,
        px: 2,
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Typography variant="caption" sx={{ color: "#888", mr: 0.5 }}>
          Per page:
        </Typography>
        <FormControl size="small">
          <Select
            id="pagination-limit-select"
            value={limit}
            onChange={handleLimitChange}
            sx={{ fontSize: "0.8rem", height: 32 }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          id="pagination-prev"
          onClick={handlePrev}
          disabled={page <= 1}
          size="small"
          sx={{
            bgcolor: page > 1 ? "#6C63FF" : "#eee",
            color: page > 1 ? "#fff" : "#bbb",
            "&:hover": { bgcolor: page > 1 ? "#5a52e0" : "#eee" },
            width: 32,
            height: 32,
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
            bgcolor: hasMore ? "#6C63FF" : "#eee",
            color: hasMore ? "#fff" : "#bbb",
            "&:hover": { bgcolor: hasMore ? "#5a52e0" : "#eee" },
            width: 32,
            height: 32,
          }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
