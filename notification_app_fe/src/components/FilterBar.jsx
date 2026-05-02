// FilterBar — filter notifications by type
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Log } from "../api/logger.js";

const FILTER_OPTIONS = ["All", "Placement", "Result", "Event"];

const FILTER_COLORS = {
  All: "#555",
  Placement: "#6C63FF",
  Result: "#00BFA6",
  Event: "#FF6D00",
};

export default function FilterBar({ currentFilter, onFilterChange }) {
  const handleChange = async (_, newFilter) => {
    if (newFilter !== null) {
      onFilterChange(newFilter);
      await Log(
        "frontend", "debug", "state",
        `filter changed from "${currentFilter}" to "${newFilter}"`
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: { xs: 1, sm: 2 },
        py: 1.5,
        flexWrap: "wrap",
      }}
    >
      <FilterListIcon sx={{ color: "#888", fontSize: 20 }} />
      <Typography variant="body2" sx={{ color: "#888", fontWeight: 500, mr: 0.5 }}>
        Filter:
      </Typography>
      <ToggleButtonGroup
        value={currentFilter}
        exclusive
        onChange={handleChange}
        size="small"
        sx={{ flexWrap: "wrap" }}
      >
        {FILTER_OPTIONS.map((opt) => (
          <ToggleButton
            key={opt}
            value={opt}
            id={`filter-btn-${opt.toLowerCase()}`}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.75rem",
              px: 2,
              py: 0.5,
              borderRadius: "20px !important",
              border: "none !important",
              mx: 0.3,
              color: currentFilter === opt ? "#fff" : FILTER_COLORS[opt],
              bgcolor: currentFilter === opt ? FILTER_COLORS[opt] : "transparent",
              "&:hover": {
                bgcolor: currentFilter === opt
                  ? FILTER_COLORS[opt]
                  : `${FILTER_COLORS[opt]}15`,
              },
              "&.Mui-selected": {
                color: "#fff",
                bgcolor: FILTER_COLORS[opt],
                "&:hover": { bgcolor: FILTER_COLORS[opt] },
              },
            }}
          >
            {opt}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
