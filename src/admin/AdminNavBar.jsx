import React, { useState, useEffect } from "react";
import {
  Link,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import {
  AdminPanelSettings,
  Menu as MenuIcon,
  Favorite,
  LocalHospital,
  Bloodtype,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../contextapi/AuthContext";

import ViewAllHospitals from "./ViewAllHospitals";
import AdminDashboard from "./AdminDashboard";
import ViewAllBloodbanks from "./ViewAllBloodbanks";
import Feedback from "./CreateFeedback";
import FeedbackAnalysis from "./FeedbackAnalysis";

const navLinks = [
  { path: "/admin/dashboard", label: "DASHBOARD" },
  { path: "/admin/bloodbanks", label: "BLOOD BANKS" },
  { path: "/admin/hospitals", label: "HOSPITALS" },
  { path: "/admin/feedback", label: "FEEDBACK" },
  { path: "/admin/feedbackanalysis", label: "ANALYSIS" },
];

const FloatingBubbles = ({ count = 18 }) => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 22 + 12,
      duration: Math.random() * 14 + 10,
      iconType: Math.floor(Math.random() * 3),
      color: ["#e57373", "#64b5f6", "#81c784"][Math.floor(Math.random() * 3)],
    }));
    setBubbles(newBubbles);
  }, [count]);

  const getIcon = (type) => {
    if (type === 0) return <Favorite fontSize="inherit" />;
    if (type === 1) return <LocalHospital fontSize="inherit" />;
    return <Bloodtype fontSize="inherit" />;
  };

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          animate={{
            y: [-20, -120, -20],
            x: [-12, 12, -12],
            rotate: [0, 180, 360],
            opacity: [0.55, 0.2, 0.55],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            fontSize: `${bubble.size}px`,
            color: bubble.color,
          }}
        >
          {getIcon(bubble.iconType)}
        </motion.div>
      ))}
    </Box>
  );
};

export default function AdminNavBar() {
  const { clearAllAuth } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");

  const handleLogout = () => {
    clearAllAuth();
    sessionStorage.clear();
    setDrawerOpen(false);
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        background: "linear-gradient(135deg, #e74c3c 0%, #3498db 100%)",
        overflow: "hidden",
      }}
    >
      <FloatingBubbles count={22} />

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #e74c3c 0%, #3498db 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
          backdropFilter: "blur(8px)",
          zIndex: 10,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: { xs: 1.5, sm: 2, md: 4 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              sx={{
                bgcolor: "#fff",
                color: "#e74c3c",
                mr: 1.2,
                "&:hover": {
                  bgcolor: "#fff",
                },
              }}
            >
              <AdminPanelSettings />
            </IconButton>

            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                letterSpacing: 0.5,
              }}
            >
              Admin Panel
            </Typography>
          </Box>

          {isMobile ? (
            <>
              <IconButton
                sx={{ color: "#fff" }}
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>

              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                  sx: {
                    width: 240,
                    background: "rgba(255,255,255,0.96)",
                  },
                }}
              >
                <List sx={{ pt: 2 }}>
                  {navLinks.map((nav) => (
                    <ListItem key={nav.label} disablePadding>
                      <ListItemButton
                        component={Link}
                        to={nav.path}
                        onClick={() => setDrawerOpen(false)}
                      >
                        <ListItemText primary={nav.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}

                  <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                      <ListItemText
                        primary="LOGOUT"
                        primaryTypographyProps={{
                          fontWeight: "bold",
                          color: "#e74c3c",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 1.3, alignItems: "center" }}>
              {navLinks.map((nav) => (
                <motion.div
                  key={nav.label}
                  whileHover={{ y: -2, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 220, damping: 14 }}
                >
                  <Button
                    component={Link}
                    to={nav.path}
                    sx={{
                      color: "#fff",
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.28)",
                      backdropFilter: "blur(6px)",
                      fontWeight: "bold",
                      borderRadius: "10px",
                      px: 2,
                      py: 0.9,
                      whiteSpace: "nowrap",
                      "&:hover": {
                        background: "#fff",
                        color: "#e74c3c",
                      },
                    }}
                  >
                    {nav.label}
                  </Button>
                </motion.div>
              ))}

              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  onClick={handleLogout}
                  sx={{
                    background: "#fff",
                    color: "#e74c3c",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    px: 2.2,
                    py: 0.9,
                    "&:hover": {
                      background: "#fdecea",
                      color: "#c0392b",
                    },
                  }}
                >
                  LOGOUT
                </Button>
              </motion.div>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container
        sx={{
          mt: 4,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Routes>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/bloodbanks" element={<ViewAllBloodbanks />} />
          <Route path="/admin/hospitals" element={<ViewAllHospitals />} />
          <Route path="/admin/feedback" element={<Feedback />} />
          <Route path="/admin/feedbackanalysis" element={<FeedbackAnalysis />} />
        </Routes>
      </Container>
    </Box>
  );
}