import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  InputAdornment,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bloodtype,
  LocalHospital,
  Person,
  Numbers,
  Info,
  Warning,
  Favorite,
  Error,
  ReportProblem,
  CheckCircle,
} from "@mui/icons-material";

// -- FIX: Height only on non-multiline
const textFieldStyles = (fieldName, multiline = false) => ({
  mb: 2,
  ...(multiline
    ? { }  // No forced height for multiline
    : { "& .MuiInputBase-root": { height: "3rem", fontSize: "1rem" } }),
  "& .MuiOutlinedInput-root.Mui-focused": {
    boxShadow: `0 0 13px #3498db40`,
    borderRadius: "8px",
    borderColor: "#3498db"
  },
  transition: "box-shadow 0.2s"
});

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const getUrgencyIcon = (urgency) => {
  switch (urgency) {
    case "LOW":
      return <CheckCircle sx={{ color: "#4caf50" }} />;
    case "MEDIUM":
      return <ReportProblem sx={{ color: "#faad14" }} />;
    case "HIGH":
      return <Error sx={{ color: "#e74c3c" }} />;
    default:
      return <CheckCircle sx={{ color: "#4caf50" }} />;
  }
};

const FloatingBubbles = ({ count = 20 }) => {
  const [bubbles, setBubbles] = useState([]);
  useEffect(() => {
    const newBubbles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 12,
      duration: Math.random() * 15 + 10,
      icon: [
        <Bloodtype key="b" />,
        <LocalHospital key="h" />,
        <Favorite key="f" />,
        <Warning key="w" />,
      ][Math.floor(Math.random() * 4)],
      color: ["#3498db", "#2e86de", "#1abc9c", "#e74c3c"][
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
            y: [-10, -150, -10],
            x: [-5, 5, -5],
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

const BASE_URL = `${import.meta.env.VITE_API_URL}/hospitalapi`;
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const URGENCY_LEVELS = ["LOW", "MEDIUM", "HIGH"];

export default function BloodRequest() {
  const [form, setForm] = useState({
    bloodGroup: "",
    unitsNeeded: "",
    urgency: "LOW",
    patientName: "",
    patientAge: "",
    patientInfo: "",
  });
  const [focusField, setFocusField] = useState("");
  const navigate = useNavigate();

  const hospitalUser = JSON.parse(sessionStorage.getItem("Hospital_user") || "{}");
  const username = hospitalUser.username || null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["patientAge", "unitsNeeded"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      toast.error("Hospital user not logged in or session expired.");
      return;
    }
    const payload = {
      bloodGroup: form.bloodGroup,
      unitsNeeded: form.unitsNeeded,
      urgency: form.urgency,
      patientName: form.patientName,
      patientAge: form.patientAge,
      patientInfo: form.patientInfo,
      hospitalUsername: username,
      date: getCurrentDate(),
      status: "Pending",
    };
    try {
      await axios.post(`${BASE_URL}/blood-requests`, payload);
      toast.success('Blood Request Submitted Successfully');
      setForm({
        bloodGroup: '',
        unitsNeeded: '',
        urgency: 'LOW',
        patientName: '',
        patientAge: '',
        patientInfo: ''
      });
      setTimeout(() => navigate('/blood-request-status'), 2000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit blood request');
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #3498db 0%, #e0f7fa 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        py: 6,
      }}
    >
      <FloatingBubbles count={22} />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        style={{
          zIndex: 1,
          width: "95%",
          maxWidth: 520,
          padding: "0 1rem",
          margin: "0 auto",
        }}
      >
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
            backgroundColor: "rgba(255,255,255,0.97)",
          }}
        >
          <Box sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h5"
              align="center"
              fontWeight="bold"
              sx={{
                mb: 4,
                color: "#2e86de",
                textShadow: "0px 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              Blood Request Form
            </Typography>
            <form onSubmit={handleSubmit}>
              {/* BLOOD GROUP */}
              <motion.div variants={fadeInUp} whileHover={{ scale: 1.03 }}>
                <TextField
                  select
                  fullWidth
                  required
                  label="Select Blood Group"
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  onFocus={() => setFocusField("bloodGroup")}
                  onBlur={() => setFocusField("")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Favorite color="error" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("bloodGroup")}
                >
                  {BLOOD_GROUPS.map((group) => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ))}
                </TextField>
              </motion.div>
              {/* UNITS NEEDED */}
              <motion.div variants={fadeInUp} whileHover={{ scale: 1.03 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Units Needed"
                  name="unitsNeeded"
                  value={form.unitsNeeded}
                  onChange={handleChange}
                  inputProps={{ min: 1 }}
                  onFocus={() => setFocusField("unitsNeeded")}
                  onBlur={() => setFocusField("")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Numbers color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("unitsNeeded")}
                />
              </motion.div>
              {/* URGENCY */}
              <motion.div variants={fadeInUp} whileHover={{ scale: 1.03 }}>
                <TextField
                  select
                  fullWidth
                  required
                  label="Urgency Level"
                  name="urgency"
                  value={form.urgency}
                  onChange={handleChange}
                  onFocus={() => setFocusField("urgency")}
                  onBlur={() => setFocusField("")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {getUrgencyIcon(form.urgency)}
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("urgency")}
                >
                  {URGENCY_LEVELS.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </TextField>
              </motion.div>
              {/* PATIENT NAME */}
              <motion.div variants={fadeInUp} whileHover={{ scale: 1.03 }}>
                <TextField
                  fullWidth
                  required
                  label="Patient Name"
                  name="patientName"
                  value={form.patientName}
                  onChange={handleChange}
                  onFocus={() => setFocusField("patientName")}
                  onBlur={() => setFocusField("")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("patientName")}
                />
              </motion.div>
              {/* PATIENT AGE */}
              <motion.div variants={fadeInUp} whileHover={{ scale: 1.03 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Patient Age"
                  name="patientAge"
                  value={form.patientAge}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  onFocus={() => setFocusField("patientAge")}
                  onBlur={() => setFocusField("")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Info color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("patientAge")}
                />
              </motion.div>
              {/* ADDITIONAL INFO */}
              <motion.div variants={fadeInUp} whileHover={{ scale: 1.03 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Additional Patient Info"
                  name="patientInfo"
                  value={form.patientInfo}
                  onChange={handleChange}
                  onFocus={() => setFocusField("patientInfo")}
                  onBlur={() => setFocusField("")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalHospital color="secondary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("patientInfo", true)}
                />
              </motion.div>
              {/* SUBMIT BUTTON */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  sx={{
                    py: 1.3,
                    fontWeight: "bold",
                    fontSize: "1rem",
                    background: "linear-gradient(90deg, #3498db 0%, #1abc9c 100%)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(90deg, #2980b9 0%, #16a085 100%)",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
                    },
                  }}
                >
                  Submit Request
                </Button>
              </motion.div>
            </form>
          </Box>
        </Card>
      </motion.div>
      <ToastContainer position="top-center" autoClose={3000} />
    </Box>
  );
}
