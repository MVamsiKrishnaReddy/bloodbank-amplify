import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useAuth } from "../contextapi/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Favorite,
  Bloodtype,
  LocalHospital,
  Person,
  Lock,
} from "@mui/icons-material";

const RED_PRIMARY = "#b71c1c";
const RED_SECONDARY = "#e53935";
const RED_BG = "#ffebee";
const RED_ACCENT = "#c62828";

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

const FloatingBubbles = ({ count = 18 }) => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 23 + 10,
      duration: Math.random() * 15 + 10,
      icon: [
        <Favorite key="fav" />,
        <Bloodtype key="blood" />,
        <LocalHospital key="hos" />,
      ][Math.floor(Math.random() * 3)],
      color: [RED_PRIMARY, RED_SECONDARY, "#ef5350", "#ff6b6b"][
        Math.floor(Math.random() * 4)
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
            y: [-10, -110, -10],
            x: [-6, 5, -6],
            rotate: [0, 360, 0],
            opacity: [0.7, 0.2, 0.7],
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

export default function BloodLogin() {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameExists, setUsernameExists] = useState(null);
  const [usernameCheckError, setUsernameCheckError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [errorAnim, setErrorAnim] = useState(false);
  const [focusField, setFocusField] = useState("");

  const {
    setIsBloodBankLoggedIn,
    setIsHospitalLoggedIn,
    setIsOrganBankLoggedIn,
  } = useAuth();

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  const textFieldStyles = (fieldName) => ({
    mb: 2,
    "& .MuiInputBase-root": {
      height: "3rem",
      fontSize: "1rem",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "& fieldset": {
        borderColor: "#ef9a9a",
      },
      "&:hover fieldset": {
        borderColor: RED_ACCENT,
      },
      "&.Mui-focused fieldset": {
        borderColor: RED_ACCENT,
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: RED_ACCENT,
    },
    "& .MuiOutlinedInput-root.Mui-focused": {
      boxShadow: `0 0 14px ${RED_ACCENT}45`,
      borderRadius: "8px",
    },
    boxShadow: focusField === fieldName ? `0 0 10px ${RED_ACCENT}72` : "",
    transition: "box-shadow 0.2s",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      setLoginData({
        username: value,
        password: "",
      });
      setUsernameExists(null);
      setCheckingUsername(false);
      setUsernameCheckError("");
    } else {
      setLoginData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFocus = (field) => setFocusField(field);
  const handleBlur = () => setFocusField("");

  useEffect(() => {
    const trimmed = loginData.username.trim();

    if (!trimmed || trimmed.length < 3) {
      setDebouncedUsername("");
      setUsernameExists(null);
      setUsernameCheckError("");
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedUsername(trimmed);
    }, 700);

    return () => clearTimeout(timer);
  }, [loginData.username]);

  useEffect(() => {
    const checkUsername = async () => {
      if (!debouncedUsername) return;

      try {
        setCheckingUsername(true);
        setUsernameCheckError("");

        const res = await axios.get(
          `${baseUrl}/bloodbankapi/checkbloodbankusername/${encodeURIComponent(
            debouncedUsername
          )}`
        );

        setUsernameExists(res.data === true);
      } catch (err) {
        console.error("Username check error:", err);
        setUsernameExists(null);
        setUsernameCheckError("Unable to verify username right now.");
      } finally {
        setCheckingUsername(false);
      }
    };

    checkUsername();
  }, [debouncedUsername, baseUrl]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.username.trim()) {
      toast.error("Please enter username.");
      return;
    }

    if (!loginData.password.trim()) {
      toast.error("Please enter password.");
      return;
    }

    try {
      setLoggingIn(true);

      const res = await axios.post(
        `${baseUrl}/bloodbankapi/checkbloodbanklogin`,
        {
          username: loginData.username.trim(),
          password: loginData.password,
        }
      );

      if (res.status === 200 && res.data) {
        const bloodUser = res.data;
        const status = bloodUser?.status;

        if (status === false) {
          toast.error("Your account is blocked. Contact Admin.");
          return;
        }

        sessionStorage.setItem("Blood_user", JSON.stringify(bloodUser));

        toast.success("Login successful!");

        sessionStorage.setItem("isBloodBankLoggedIn", "true");
        sessionStorage.setItem("isHospitalLoggedIn", "false");
        sessionStorage.setItem("isOrganBankLoggedIn", "false");

        setIsBloodBankLoggedIn(true);
        setIsHospitalLoggedIn(false);
        setIsOrganBankLoggedIn(false);

        setTimeout(() => {
          navigate("/bloodbankdashboard");
        }, 1200);
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorAnim(true);
      setTimeout(() => setErrorAnim(false), 600);

      if (err.response?.status === 401) {
        toast.error("Invalid username or password!");
      } else {
        toast.error("Server error during login. Please try again later.");
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleRegister = () => {
    const username = loginData.username.trim();

    sessionStorage.setItem("prefill_bloodbank_username", username);

    navigate("/bloodbankregister", {
      state: { username },
    });
  };

  const showPasswordSection = !checkingUsername && usernameExists === true;

  const showRegisterSection =
    !checkingUsername &&
    usernameExists === false &&
    loginData.username.trim() !== "";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${RED_PRIMARY} 0%, ${RED_BG} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        py: 7,
      }}
    >
      <FloatingBubbles count={18} />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        style={{
          zIndex: 1,
          width: "98%",
          maxWidth: 430,
          padding: "0 1rem",
          margin: "0 auto",
        }}
      >
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 14px 32px rgba(120,0,0,0.15)",
            backgroundColor: "rgba(255,255,255,0.98)",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h5"
              align="center"
              fontWeight="bold"
              sx={{
                mb: 4,
                color: RED_ACCENT,
                textShadow: "0px 1px 4px rgba(80,0,0,0.07)",
              }}
            >
              Blood Bank Login
            </Typography>

            <form onSubmit={handleLogin} style={{ width: "100%" }}>
              <Box display="flex" flexDirection="column">
                <motion.div
                  animate={errorAnim ? "visible" : "hidden"}
                  variants={shakeX}
                >
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={loginData.username}
                    onChange={handleChange}
                    required
                    onFocus={() => handleFocus("username")}
                    onBlur={handleBlur}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="error" />
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldStyles("username")}
                  />
                </motion.div>

                {loginData.username.trim() !== "" &&
                  loginData.username.trim().length < 3 && (
                    <Typography
                      variant="body2"
                      sx={{ mb: 2, color: "text.secondary" }}
                    >
                      Enter at least 3 characters to check username.
                    </Typography>
                  )}

                {checkingUsername && (
                  <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
                    <CircularProgress size={24} sx={{ color: RED_ACCENT }} />
                  </Box>
                )}

                {usernameCheckError && (
                  <Typography color="error" sx={{ mb: 2 }}>
                    {usernameCheckError}
                  </Typography>
                )}

                {showPasswordSection && (
                  <>
                    <Typography
                      sx={{
                        mb: 2,
                        color: "#2e7d32",
                        fontWeight: "bold",
                      }}
                    >
                      Username found. Enter password.
                    </Typography>

                    <motion.div
                      animate={errorAnim ? "visible" : "hidden"}
                      variants={shakeX}
                    >
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
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="error" />
                            </InputAdornment>
                          ),
                        }}
                        sx={textFieldStyles("password")}
                      />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loggingIn}
                        sx={{
                          py: 1.3,
                          fontWeight: "bold",
                          fontSize: "1rem",
                          background: `linear-gradient(90deg, ${RED_ACCENT} 0%, ${RED_SECONDARY} 100%)`,
                          color: "#fff",
                          boxShadow: "0 9px 30px rgba(198,40,40,0.18)",
                          borderRadius: "12px",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: `linear-gradient(90deg, ${RED_SECONDARY} 0%, ${RED_ACCENT} 100%)`,
                            boxShadow: "0 14px 40px rgba(198,40,40,0.28)",
                          },
                        }}
                      >
                        {loggingIn ? "Logging in..." : "Login"}
                      </Button>
                    </motion.div>
                  </>
                )}

                {showRegisterSection && (
                  <>
                    <Typography color="error" sx={{ mb: 2 }}>
                      Username not found. Please register.
                    </Typography>

                    <Box display="flex" justifyContent="center">
                      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        <Button
                          variant="outlined"
                          onClick={handleRegister}
                          sx={{
                            minWidth: 180,
                            fontWeight: "bold",
                            borderRadius: "12px",
                            borderWidth: 2,
                            color: RED_ACCENT,
                            borderColor: RED_ACCENT,
                            background:
                              "linear-gradient(90deg, rgba(198,40,40,0.06) 0%, rgba(229,57,53,0.12) 100%)",
                            "&:hover": {
                              borderColor: RED_ACCENT,
                              background:
                                "linear-gradient(90deg, rgba(198,40,40,0.12) 0%, rgba(229,57,53,0.18) 100%)",
                            },
                          }}
                        >
                          Register Here
                        </Button>
                      </motion.div>
                    </Box>
                  </>
                )}
              </Box>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <ToastContainer position="top-center" autoClose={3000} />
    </Box>
  );
}