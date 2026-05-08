import { Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
} from '@mui/material';
import { 
  ArrowDropDown,
  Menu as MenuIcon,
  Favorite,
  LocalHospital,
  Bloodtype,
  AdminPanelSettings,
  ContactMail,
  Home,
  Close,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PulseButton, BloodParticles } from './AnimationComponents';

import About from './About';
import Contact from './ContactUs';
import BloodLogin from './../blood/BloodLogin';
import HospitalLogin from './../Hospital/HospitalLogin';
import HospitalRegistrationForm from './../Hospital/HospitalRegistrationForm';
import BloodBankRegistration from './../blood/BloodBankregistration';
import AdminLogin from './../admin/AdminLogin';
import HomePage from './HomePage';


export default function MainNavBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleMobileToggle = () => setMobileOpen(!mobileOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const loginOptions = [
    { label: 'Hospital', path: '/hospital-login', icon: <LocalHospital />, color: '#3498db' },
    { label: 'Blood Bank', path: '/bloodbank-login', icon: <Bloodtype />, color: '#e74c3c' },
    { label: 'Admin', path: '/admin-login', icon: <AdminPanelSettings />, color: '#2c3e50' },
  ];

  return (
    <Box>
      {/* Glassmorphic Navigation Bar */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <AppBar 
          position="fixed" 
          sx={{
            backgroundColor: scrolled 
              ? 'rgba(255, 255, 255, 0.85)' 
              : 'rgba(231, 76, 60, 0.9)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
            boxShadow: scrolled 
              ? '0 8px 40px rgba(0,0,0,0.12), 0 2px 16px rgba(0,0,0,0.08)' 
              : '0 8px 32px rgba(231, 76, 60, 0.25), 0 4px 16px rgba(231, 76, 60, 0.15)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            borderBottom: scrolled 
              ? '1px solid rgba(231, 76, 60, 0.15)' 
              : '1px solid rgba(255, 255, 255, 0.1)',
            background: scrolled 
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.85) 100%)'
              : 'linear-gradient(135deg, rgba(231, 76, 60, 0.95) 0%, rgba(192, 57, 43, 0.9) 100%)',
          }}
        >
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              px: { xs: 2, md: 4 },
              py: 1,
            }}
          >
            {/* Logo Section */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box 
                component={Link} 
                to="/"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  textDecoration: 'none',
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: scrolled ? '#e74c3c' : '#fff',
                    width: 50,
                    height: 50,
                    boxShadow: '0 4px 20px rgba(231, 76, 60, 0.3)',
                  }}
                >
                  <Favorite 
                    sx={{ 
                      color: scrolled ? '#fff' : '#e74c3c',
                      fontSize: 28,
                    }} 
                  />
                </Avatar>
                <Typography
                  variant="h5"
                  sx={{
                    color: scrolled ? '#e74c3c' : '#fff',
                    fontWeight: 'bold',
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    background: scrolled 
                      ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
                      : 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Blood 4 Life
                </Typography>
              </Box>
            </motion.div>

            {/* Desktop Navigation */}
            {!isMobile ? (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {/* Home and About Links */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={Link}
                    to="/home-page"
                    startIcon={<Home />}
                    sx={{
                      color: scrolled ? '#e74c3c' : '#fff',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      px: 2,
                      py: 1,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: scrolled 
                          ? 'rgba(231, 76, 60, 0.1)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Home
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={Link}
                    to="/"
                    startIcon={<Home />}
                    sx={{
                      color: scrolled ? '#e74c3c' : '#fff',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      px: 2,
                      py: 1,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: scrolled 
                          ? 'rgba(231, 76, 60, 0.1)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    About
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleMenuClick}
                    endIcon={<ArrowDropDown />}
                    sx={{
                      color: scrolled ? '#e74c3c' : '#fff',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      px: 2,
                      py: 1,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: scrolled 
                          ? 'rgba(231, 76, 60, 0.1)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Login
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={Link}
                    to="/contact"
                    startIcon={<ContactMail />}
                    sx={{
                      color: scrolled ? '#e74c3c' : '#fff',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      px: 2,
                      py: 1,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: scrolled 
                          ? 'rgba(231, 76, 60, 0.1)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Contact
                  </Button>
                </motion.div>
              </Box>
            ) : (
              <IconButton
                onClick={handleMobileToggle}
                sx={{ 
                  color: scrolled ? '#e74c3c' : '#fff',
                  '&:hover': {
                    backgroundColor: scrolled 
                      ? 'rgba(231, 76, 60, 0.1)' 
                      : 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* Enhanced Login Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(231, 76, 60, 0.2)',
            mt: 1,
          }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {loginOptions.map((option, index) => (
          <motion.div
            key={option.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MenuItem 
              component={Link} 
              to={option.path} 
              onClick={handleClose}
              sx={{
                py: 2,
                px: 3,
                '&:hover': {
                  backgroundColor: `${option.color}10`,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    backgroundColor: option.color,
                    width: 32,
                    height: 32,
                  }}
                >
                  {option.icon}
                </Avatar>
                <Typography sx={{ fontWeight: 500 }}>
                  {option.label}
                </Typography>
              </Box>
            </MenuItem>
          </motion.div>
        ))}
      </Menu>

      {/* Enhanced Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleMobileToggle}
        PaperProps={{
          sx: {
            width: 320,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
            borderLeft: '1px solid rgba(231, 76, 60, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }
        }}
        SlideProps={{
          direction: 'left',
        }}
      >
        {/* Mobile Drawer Background */}
        <BloodParticles />
        
        <Box sx={{ p: 3, position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h6" sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
              Menu
            </Typography>
            <IconButton onClick={handleMobileToggle}>
              <Close />
            </IconButton>
          </Box>
          
          <List>
            {/* Home and About Links */}
            {[
              { label: 'Home', path: '/home-page', icon: <Home /> },
              { label: 'About', path: '/', icon: <AdminPanelSettings /> },
              { label: 'Contact', path: '/contact', icon: <ContactMail /> },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ListItem
                  component={Link}
                  to={item.path}
                  onClick={handleMobileToggle}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    },
                  }}
                >
                  <Box sx={{ mr: 2, color: '#e74c3c' }}>
                    {item.icon}
                  </Box>
                  <ListItemText 
                    primary={item.label}
                    sx={{ color: '#333' }}
                  />
                </ListItem>
              </motion.div>
            ))}
            
            <Typography variant="subtitle2" sx={{ color: '#666', mt: 3, mb: 1, px: 2 }}>
              Login Options
            </Typography>
            
            {loginOptions.map((option, index) => (
              <motion.div
                key={option.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index + 3) * 0.1 }}
              >
                <ListItem
                  component={Link}
                  to={option.path}
                  onClick={handleMobileToggle}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: `${option.color}10`,
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: option.color,
                      width: 32,
                      height: 32,
                      mr: 2,
                    }}
                  >
                    {option.icon}
                  </Avatar>
                  <ListItemText 
                    primary={option.label}
                    sx={{ color: '#333' }}
                  />
                </ListItem>
              </motion.div>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Spacer for fixed header */}
      <Toolbar />

      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/hospital-login" element={<HospitalLogin />} />
        <Route path="/bloodbank-login" element={<BloodLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} /> 
        <Route path="/hospital-registration" element={<HospitalRegistrationForm />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/bloodbankregister" element={<BloodBankRegistration />} />
        <Route path="/home-page" element={<HomePage />} />
      </Routes>
    </Box>
  );
}
