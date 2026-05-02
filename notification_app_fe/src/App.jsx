import { useState, useEffect } from "react";
import { Box, Container, Typography, Tab, Tabs, IconButton } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AllNotificationsPage from "./pages/AllNotificationsPage.jsx";
import PriorityNotificationsPage from "./pages/PriorityNotificationsPage.jsx";
import { ReadStateProvider } from "./state/ReadStateContext.jsx";
import { Log } from "./api/logger.js";

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  palette: {
    primary: { main: "#1976d2" },
    background: { default: "#f7f9fb" },
  },
});

export default function App() {
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    Log(
      "frontend", "info", "page",
      "App component mounted — campus notifications system initialized"
    );
  }, []);

  const handleTabChange = async (_, newValue) => {
    setCurrentTab(newValue);
    const tabName = newValue === 0 ? "All Notifications" : "Priority";
    await Log(
      "frontend", "info", "component",
      `navigation: switched to "${tabName}" tab`
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReadStateProvider>
        <Box sx={{ minHeight: "100vh", bgcolor: "#f7f9fb" }}>
          <Box
            sx={{
              bgcolor: "#fff",
              position: "sticky",
              top: 0,
              zIndex: 1000,
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 1.5,
                px: 2,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: 16,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "#1976d2"
                }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: "1.2rem", mr: 0.5 }} />
                <Typography sx={{ fontWeight: 400, fontSize: "1.1rem" }}>Back</Typography>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  color: "#000",
                }}
              >
                Campus Notifications
              </Typography>
            </Box>

            {/* Tabs */}
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="fullWidth"
              TabIndicatorProps={{
                sx: { bgcolor: "#1976d2", height: 2 },
              }}
              sx={{
                borderBottom: "1px solid #eee",
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 400,
                  fontSize: "1.1rem",
                  color: "#666",
                  py: 1.5,
                },
                "& .Mui-selected": {
                  color: "#1976d2 !important",
                },
              }}
            >
              <Tab id="tab-all-notifications" label="All Notifications" />
              <Tab id="tab-priority" label="Priority" />
            </Tabs>
          </Box>

          <Container maxWidth="sm" sx={{ mt: 2, pb: 4, px: 2 }}>
            {currentTab === 0 && <AllNotificationsPage />}
            {currentTab === 1 && <PriorityNotificationsPage />}
          </Container>
        </Box>
      </ReadStateProvider>
    </ThemeProvider>
  );
}
