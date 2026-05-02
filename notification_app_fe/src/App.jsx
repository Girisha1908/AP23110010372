// Main application — routes between All Notifications and Priority Notifications
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  BottomNavigation,
  BottomNavigationAction,
  Typography,
  AppBar,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import AllNotificationsPage from "./pages/AllNotificationsPage.jsx";
import PriorityNotificationsPage from "./pages/PriorityNotificationsPage.jsx";
import { ReadStateProvider } from "./state/ReadStateContext.jsx";
import { Log } from "./api/logger.js";

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
  },
  palette: {
    background: {
      default: "#f7f8fc",
    },
  },
});

export default function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    Log(
      "frontend", "info", "page",
      "App component mounted — campus notifications system initialized"
    );
  }, []);

  const handleTabChange = async (_, newValue) => {
    setCurrentTab(newValue);
    const tabName = newValue === 0 ? "All Notifications" : "Priority Notifications";
    await Log(
      "frontend", "info", "component",
      `navigation: switched to "${tabName}" tab`
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReadStateProvider>
        <Box sx={{ minHeight: "100vh", bgcolor: "#f7f8fc", pb: 10 }}>
          {/* App Bar */}
          <AppBar
            position="sticky"
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
              <SchoolIcon sx={{ mr: 1.5, color: "#6C63FF" }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "0.95rem", sm: "1.15rem" },
                  background: "linear-gradient(90deg, #6C63FF, #f093fb)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Campus Notifications
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Desktop tab selector */}
          {!isMobile && (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 3, pb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  bgcolor: "#fff",
                  borderRadius: 3,
                  p: 0.5,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                {["All Notifications", "Priority"].map((label, idx) => (
                  <Box
                    key={label}
                    id={`tab-${label.toLowerCase().replace(/\s/g, "-")}`}
                    onClick={() => handleTabChange(null, idx)}
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 2.5,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      transition: "all 0.2s ease",
                      bgcolor: currentTab === idx ? "#6C63FF" : "transparent",
                      color: currentTab === idx ? "#fff" : "#888",
                      "&:hover": {
                        bgcolor: currentTab === idx ? "#5a52e0" : "#f5f5f5",
                      },
                    }}
                  >
                    {label}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Page content */}
          <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 3 } }}>
            {currentTab === 0 && <AllNotificationsPage />}
            {currentTab === 1 && <PriorityNotificationsPage />}
          </Container>

          {/* Mobile bottom navigation */}
          {isMobile && (
            <BottomNavigation
              value={currentTab}
              onChange={handleTabChange}
              showLabels
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: "#fff",
                borderTop: "1px solid #eee",
                boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
                zIndex: 1200,
              }}
            >
              <BottomNavigationAction
                id="nav-all-notifications"
                label="All"
                icon={<NotificationsIcon />}
                sx={{
                  "&.Mui-selected": { color: "#6C63FF" },
                }}
              />
              <BottomNavigationAction
                id="nav-priority"
                label="Priority"
                icon={<StarIcon />}
                sx={{
                  "&.Mui-selected": { color: "#f5576c" },
                }}
              />
            </BottomNavigation>
          )}
        </Box>
      </ReadStateProvider>
    </ThemeProvider>
  );
}
