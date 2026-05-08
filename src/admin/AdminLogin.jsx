import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../contextapi/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Favorite, LocalHospital, Bloodtype } from "@mui/icons-material";

// ✅ Same animation variants from HospitalLogin
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const shakeX = {
  hidden: { x: 0 },
  visible: {
    x: [0, -8, 8, -6, 6, -4, 4, 0],
    transition: { duration: 0.6 },
  },
};

// ✅ Same floating bubbles animation
const FloatingBubbles = ({ count = 18 }) => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 15 + 10,
      icon: [
        <Favorite key="fav" />,
        <LocalHospital key="hos" />,
        <Bloodtype key="blood" />,
      ][Math.floor(Math.random() * 3)],
      color: ["#e74c3c", "#3498db", "#27ae60"][
        Math.floor(Math.random() * 3)
      ],
    }));
    setBubbles(newBubbles);
  }, [count]);

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          animate={{
            y: [-20, -100, -20],
            x: [-10, 10, -10],
            rotate: [0, 360, 0],
            opacity: [0.6, 0.2, 0.6],
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
            fontSize: bubble.size,
            color: bubble.color,
          }}
        >
          {bubble.icon}
        </motion.div>
      ))}
    </Box>
  );
};

export default function AdminLogin() {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [errorAnim, setErrorAnim] = useState(false);
  const [focusField, setFocusField] = useState("");
  const [loading, setLoading] = useState(false);

  const { setIsAdminLoggedIn, setIsHospitalLoggedIn, setIsBloodBankLoggedIn, setIsOrganBankLoggedIn } = useAuth();
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleFocus = (field) => setFocusField(field);
  const handleBlur = () => setFocusField("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/admin/login`, {
        username: loginData.username,
        password: loginData.password,
      });

      if (response.status === 200) {
        const adminData = response.data;

        toast.success("Admin login successful!");

        sessionStorage.setItem("Admin_user", JSON.stringify(adminData));
        sessionStorage.setItem("isAdminLoggedIn", "true");
        sessionStorage.setItem("isHospitalLoggedIn", "false");
        sessionStorage.setItem("isBloodBankLoggedIn", "false");
        sessionStorage.setItem("isOrganBankLoggedIn", "false");

        setIsAdminLoggedIn(true);
        setIsHospitalLoggedIn(false);
        setIsBloodBankLoggedIn(false);
        setIsOrganBankLoggedIn(false);

        navigate("/admin/dashboard");
      }
    } catch (error) {
      setErrorAnim(true);
      setTimeout(() => setErrorAnim(false), 600);
      toast.error("Invalid username or password!");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: "linear-gradient(135deg, #e74c3c 0%, #3498db 100%)",
        overflow: "hidden",
      }}
    >
      {/* ✅ Floating animation */}
      <FloatingBubbles count={20} />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        style={{
          zIndex: 1,
          width: "100%",
          maxWidth: 400,
          padding: "0 1rem",
        }}
      >
        <Card
          sx={{
            width: "100%",
            borderRadius: 3,
            boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
            backgroundColor: "rgba(255,255,255,0.97)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                textAlign: "center",
                fontWeight: "bold",
                letterSpacing: 1,
              }}
            >
              Admin Login
            </Typography>

            <form onSubmit={handleLogin}>
              <Box display="flex" flexDirection="column" gap={3}>
                
                {/* Username */}
                <motion.div animate={errorAnim ? "visible" : "hidden"} variants={shakeX}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={loginData.username}
                    onChange={handleChange}
                    required
                    onFocus={() => handleFocus("username")}
                    onBlur={handleBlur}
                    sx={{
                      "& .MuiInputBase-root": { height: "3.2rem" },
                      boxShadow:
                        focusField === "username"
                          ? "0 0 8px 2px #3498db57"
                          : "",
                      transition: "box-shadow 0.3s ease",
                    }}
                  />
                </motion.div>

                {/* Password */}
                <motion.div animate={errorAnim ? "visible" : "hidden"} variants={shakeX}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                    onFocus={() => handleFocus("password")}
                    onBlur={handleBlur}
                    sx={{
                      "& .MuiInputBase-root": { height: "3.2rem" },
                      boxShadow:
                        focusField === "password"
                          ? "0 0 8px 2px #e74c3c67"
                          : "",
                      transition: "box-shadow 0.3s ease",
                    }}
                  />
                </motion.div>

                {/* Button */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  component={motion.button}
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 32px #3498db38" }}
                  whileTap={{ scale: 0.98 }}
                  sx={{ py: 1.5, fontWeight: "bold", fontSize: "1rem", mt: 1 }}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Box>
            </form>

          </CardContent>
        </Card>
      </motion.div>

      <ToastContainer position="top-center" autoClose={2500} />
    </Box>
  );
}
