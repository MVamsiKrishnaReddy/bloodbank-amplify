import React, { useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import BloodRegistration from './BloodRegistration'
import BloodAviability from './BloodAviability'
import BloodRequest from './BloodRequest'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material'
import 'bootstrap/dist/css/bootstrap.min.css'
import BloodLogin from './BloodLogin'
import { useAuth } from '../contextapi/AuthContext'

import BloodProfile from './BloodBankProfile'
import BloodBankDashboard from './BloodBankDashboard'
import FeedbackForm from './FeedbackForm'
import { motion } from 'framer-motion'
import {
  Favorite,
  Bloodtype,
  LocalHospital
} from '@mui/icons-material'

const RED_PRIMARY = "#b71c1c"
const RED_SECONDARY = "#e53935"
const RED_BG = "#ffebee"

const NAV_DARK_1 = "#3b0d0d"
const NAV_DARK_2 = "#5c1a1b"
const NAV_DARK_3 = "#7a2323"

const FloatingBubbles = ({ count = 18 }) => {
  const [bubbles, setBubbles] = useState([])

  useEffect(() => {
    const newBubbles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 22 + 10,
      duration: Math.random() * 15 + 10,
      icon: [
        <Favorite key="fav" />,
        <Bloodtype key="blood" />,
        <LocalHospital key="hospital" />
      ][Math.floor(Math.random() * 3)],
      color: [RED_PRIMARY, RED_SECONDARY, "#ef5350", "#ff6b6b"][
        Math.floor(Math.random() * 4)
      ]
    }))
    setBubbles(newBubbles)
  }, [count])

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0
      }}
    >
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          animate={{
            y: [-10, -120, -10],
            x: [-8, 8, -8],
            rotate: [0, 360, 0],
            opacity: [0.18, 0.35, 0.18]
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: "absolute",
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            fontSize: bubble.size,
            color: bubble.color
          }}
        >
          {bubble.icon}
        </motion.div>
      ))}
    </Box>
  )
}

export default function BloodNavBar() {
  const { setIsBloodBankLoggedIn } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setIsBloodBankLoggedIn(false)
    sessionStorage.removeItem('Blood_user')
    sessionStorage.setItem('isBloodBankLoggedIn', 'false')
    navigate('/')
  }

  const bloodUser = JSON.parse(sessionStorage.getItem('Blood_user'))
  const loggedInOrg = bloodUser?.name || 'Your Organization'

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        background: `linear-gradient(135deg, ${RED_PRIMARY} 0%, ${RED_BG} 100%)`,
        overflowX: "hidden"
      }}
    >
      <FloatingBubbles count={20} />

      <AppBar
        position="fixed"
        sx={{
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1300,
          background: `linear-gradient(90deg, ${NAV_DARK_1} 0%, ${NAV_DARK_2} 55%, ${NAV_DARK_3} 100%)`,
          boxShadow: "0 10px 28px rgba(0,0,0,0.28)",
          borderBottom: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
            py: 1.2
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: 800,
              letterSpacing: 0.5
            }}
          >
            Blood Donation System
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1.2,
              flexWrap: "wrap",
              alignItems: "center"
            }}
          >
            {[
              { path: "/bloodbankdashboard", label: "Home" },
              { path: "/bloodregistrartion", label: "Donor Register" },
              { path: "/organaviaviablity", label: "Donor Records" },
              { path: "/BloodRequest", label: "Blood Request" },
              { path: "/bloodbankprofile", label: "Profile" },
              { path: "/bloodbankfeedback", label: "Feedback" }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-decoration-none"
              >
                <Button
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    borderRadius: "10px",
                    px: 2,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      background: "rgba(255,255,255,0.18)",
                      transform: "translateY(-1px)"
                    }
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}

            <Button
              onClick={handleLogout}
              sx={{
                background: "#fff",
                color: RED_PRIMARY,
                fontWeight: 800,
                borderRadius: "10px",
                px: 2.2,
                boxShadow: "0 4px 14px rgba(255,255,255,0.12)",
                "&:hover": {
                  background: "#ffe5e5"
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ height: { xs: 120, sm: 100, md: 90 } }} />

      <Box
        sx={{
          textAlign: 'center',
          mt: 2,
          position: "relative",
          zIndex: 1
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#fff",
            fontWeight: 'bold',
            textShadow: "0 2px 10px rgba(0,0,0,0.2)"
          }}
        >
          {loggedInOrg}
        </Typography>
      </Box>

      <Box
        sx={{
          mt: 4,
          pb: 4,
          px: { xs: 2, sm: 3, md: 4 },
          position: "relative",
          zIndex: 1
        }}
      >
        <Routes>
          <Route
            path="/bloodregistrartion"
            element={<BloodRegistration baseUrl={import.meta.env.VITE_API_URL} />}
          />
          <Route
            path="/organaviaviablity"
            element={<BloodAviability baseUrl={import.meta.env.VITE_API_URL} />}
          />
          <Route
            path="/BloodRequest"
            element={<BloodRequest baseUrl={import.meta.env.VITE_API_URL} />}
          />
          <Route path="/bloodlogin" element={<BloodLogin />} />
          <Route
            path="/bloodbankprofile"
            element={<BloodProfile baseUrl={import.meta.env.VITE_API_URL} />}
          />
          <Route
            path="/bloodbankdashboard"
            element={<BloodBankDashboard baseUrl={import.meta.env.VITE_API_URL} />}
          />
          <Route
            path="/bloodbankfeedback"
            element={<FeedbackForm baseUrl={import.meta.env.VITE_API_URL} />}
          />
        </Routes>
      </Box>
    </Box>
  )
}