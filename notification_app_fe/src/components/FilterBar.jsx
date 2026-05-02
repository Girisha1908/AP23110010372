// FilterBar — pill-style filter buttons
import { Box, Button } from "@mui/material";
import { Log } from "../api/logger.js";

const FILTER_OPTIONS = ["Placement", "Result", "Event", "All"];

export default function FilterBar({ currentFilter, onFilterChange }) {
  const handleClick = async (opt) => {
    if (opt !== currentFilter) {
      onFilterChange(opt);
      await Log(
        "frontend", "info", "component",
        `filter changed to ${opt}`
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        py: 1,
        mb: 1,
        flexWrap: "wrap",
        justifyContent: "flex-start",
      }}
    >
      {FILTER_OPTIONS.map((opt) => {
        const isActive = currentFilter === opt;
        return (
          <Button
            key={opt}
            id={`filter-btn-${opt.toLowerCase()}`}
            onClick={() => handleClick(opt)}
            variant={isActive ? "contained" : "outlined"}
            size="small"
            disableElevation
            sx={{
              textTransform: "none",
              fontWeight: 400,
              fontSize: "1rem",
              borderRadius: "20px",
              px: 2,
              py: 0.25,
              minWidth: 0,
              bgcolor: isActive ? "#1976d2" : "#fff",
              color: isActive ? "#fff" : "#333",
              borderColor: isActive ? "#1976d2" : "#ccc",
              "&:hover": {
                bgcolor: isActive ? "#1565c0" : "#f5f5f5",
                borderColor: isActive ? "#1565c0" : "#999",
              },
            }}
          >
            {opt}
          </Button>
        );
      })}
    </Box>
  );
}
