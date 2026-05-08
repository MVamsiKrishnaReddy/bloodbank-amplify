import React, { useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery
} from '@mui/material';
import {
  Favorite,
  Menu as MenuIcon,
  Bloodtype,
  LocalHospital
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../contextapi/AuthContext';
import BloodRequest from './BloodRequest';
import BloodRequestStatus from './BloodRequestStatus';
import BloodAvailability from './BloodAvailability';
import HospitalLogin from './HospitalLogin';
import HospitalUpdateForm from './HospitalUpdateForm';
import HospitalFeedback from './HospitalFeedback';

// Added new Hospital Feedback entry to navLinks
const navLinks = [
  { path: '/blood-request', label: 'BLOOD REQUESTS' },
  { path: '/blood-availability', label: 'BLOOD AVAILABILITY' },
  { path: '/blood-request-status', label: 'REQUEST STATUS' },
  { path: '/update-profile', label: 'PROFILE' },
  { path: '/hospital-feedback', label: 'FEEDBACK' },      // New feedback link
];

const floatingSymbols = [
  { icon: <Favorite fontSize="medium" />, color: "#fff" },
  { icon: <LocalHospital fontSize="medium" />, color: "#fff" },
  { icon: <Bloodtype fontSize="medium" />, color: "#fff" },
];

export default function NavBar() {
  const { isHospitalLoggedIn, setIsHospitalLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 900px)');

  const handleLogout = () => {
    setIsHospitalLoggedIn(false);
    setDrawerOpen(false);
    sessionStorage.removeItem('Hospital_user');
    sessionStorage.setItem('isHospitalLoggedIn', 'false');
    navigate('/hospital-login', { replace: true });
  };

  const logoBoxStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    minWidth: 170
  };

  if (
    !isHospitalLoggedIn ||
    !sessionStorage.getItem("Hospital_user") ||
    sessionStorage.getItem("isHospitalLoggedIn") !== "true"
  ) {
    return (
      <Routes>
        <Route path="/*" element={<HospitalLogin />} />
      </Routes>
    );
  }

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(90deg, #e74c3c 0%, #d63a3a 100%)',
          boxShadow: '0 3px 18px -8px #e74c3c70',
          zIndex: 2000,
          overflow: 'hidden'
        }}
      >
        <Toolbar
          sx={{
            minHeight: 64,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            px: { xs: 1, sm: 2, md: 4 }
          }}
        >
          <Box sx={logoBoxStyle}>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
              style={{ marginRight: 10 }}
            >
              <IconButton sx={{ bgcolor: "#fff", color: "#e74c3c", mr: 1 }}>
                <Favorite fontSize="large" />
              </IconButton>
            </motion.div>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                letterSpacing: 1,
                fontSize: "1.3rem",
                whiteSpace: 'nowrap'
              }}
            >
              Hospital
            </Typography>
            <Box sx={{ ml: 1, display: "flex", alignItems: "center" }}>
              {floatingSymbols.map((sym, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0.3, y: -4, scale: 0.7 }}
                  animate={{
                    opacity: [0.7, 0.4, 1, 0.8, 0.7],
                    y: [0, 8, 0, -4, 0],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 3 + idx,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    marginLeft: 4,
                    color: sym.color,
                  }}
                >
                  {sym.icon}
                </motion.span>
              ))}
            </Box>
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
              >
                <List sx={{ width: 230, pt: 2 }}>
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
                    <ListItemButton
                      onClick={handleLogout}
                    >
                      <ListItemText
                        primary="LOGOUT"
                        sx={{ color: "#e74c3c", fontWeight: "bold" }}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Drawer>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                alignItems: "center",
                flexWrap: "nowrap"
              }}
            >
              {navLinks.map((nav) => (
                <motion.div
                  key={nav.label}
                  whileHover={{ y: -2, scale: 1.07 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                >
                  <Button
                    component={Link}
                    to={nav.path}
                    variant="contained"
                    sx={{
                      fontWeight: "bold",
                      background: "#fff",
                      color: "#e74c3c",
                      borderRadius: 2,
                      px: 2.5,
                      py: 0.8,
                      boxShadow: "0 2px 10px #eee7",
                      "&:hover": {
                        background: "#ffeaea",
                        color: "#c92424",
                      },
                      whiteSpace: "nowrap"
                    }}
                  >
                    {nav.label}
                  </Button>
                </motion.div>
              ))}
              <motion.div whileHover={{ scale: 1.07 }}>
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  sx={{
                    fontWeight: "bold",
                    borderRadius: 2,
                    px: 2.5,
                    py: 0.8,
                    background: "#fff",
                    color: "#e74c3c",
                    boxShadow: "0 2px 10px #e74c3c43",
                    "&:hover": {
                      background: "#ffeaea",
                      color: "#c92424",
                    },
                    whiteSpace: "nowrap"
                  }}
                >
                  LOGOUT
                </Button>
              </motion.div>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {/* Only available when logged in */}
      <Routes>
        <Route path="/blood-request" element={<BloodRequest />} />
        <Route path="/blood-availability" element={<BloodAvailability />} />
        <Route path="/blood-request-status" element={<BloodRequestStatus />} />
        <Route path="/update-profile" element={<HospitalUpdateForm />} />
        <Route path="/hospital-login" element={<HospitalLogin />} />
        <Route path='/hospital-feedback' element={<HospitalFeedback />} />
      </Routes>
    </>
  );
}
