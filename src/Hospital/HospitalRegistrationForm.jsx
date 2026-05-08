import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  InputAdornment
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LocalHospital,
  Person,
  Badge,
  Email,
  Phone,
  Info,
  Favorite,
  Lock,
  Business
} from "@mui/icons-material";

// Blue theme variables
const BLUE_PRIMARY = "#2179e6";
const BLUE_SECONDARY = "#1bb6ec";
const BLUE_BG = "#ecf6ff";
const BLUE_ACCENT = "#2e86de";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
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
        <LocalHospital key="h" />,
        <Favorite key="f" />,
        <Person key="p" />,
        <Business key="b" />
      ][Math.floor(Math.random() * 4)],
      color: [BLUE_PRIMARY, BLUE_SECONDARY, "#297fb9", "#42a1ec"][
        Math.floor(Math.random() * 4)
      ]
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
        zIndex: 0
      }}
    >
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          animate={{
            y: [-10, -110, -10],
            x: [-6, 5, -6],
            rotate: [0, 360, 0],
            opacity: [0.7, 0.2, 0.7]
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
  );
};

const stateCityData = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kurnool", "Rajahmundry"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Mahbubnagar"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Vellore"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangalore", "Hubballi", "Belagavi"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Delhi": ["New Delhi", "Dwarka", "Rohini", "Saket", "Karol Bagh"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior"],
  "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Kota"],
  "Punjab": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Karnal"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Korba"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Rishikesh", "Haldwani"],
  "Himachal Pradesh": ["Shimla", "Mandi", "Dharamshala", "Solan"],
  "Tripura": ["Agartala"],
  "Meghalaya": ["Shillong"],
  "Nagaland": ["Kohima", "Dimapur"],
  "Manipur": ["Imphal"],
  "Sikkim": ["Gangtok"]
};

export default function HospitalRegistrationForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const passedUsername =
    location.state?.username ||
    sessionStorage.getItem("prefill_hospital_username") ||
    "";

  const [form, setForm] = useState({
    username: passedUsername,
    name: "",
    ownerName: "",
    state: "",
    city: "",
    address: "",
    contact: "",
    email: "",
    licenseNo: "",
    type: "",
    password: "",
    confirmPassword: ""
  });

  const [focusField, setFocusField] = useState("");
  const [existErrors, setExistErrors] = useState({});
  const [errors, setErrors] = useState({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const states = Object.keys(stateCityData);

  useEffect(() => {
    if (passedUsername) {
      setForm((prev) => ({
        ...prev,
        username: passedUsername
      }));
    }
  }, [passedUsername]);

  // Central validation
  const validateField = (name, value, values = form) => {
    switch (name) {
      case "username":
        if (!value) return "Username is required";
        break;
      case "name":
        if (!value) return "Hospital Name is required";
        break;
      case "ownerName":
        if (!value) return "Owner Name is required";
        break;
      case "state":
        if (!value) return "State is required";
        break;
      case "city":
        if (!value) return "City is required";
        break;
      case "address":
        if (!value) return "Address is required";
        break;
      case "contact":
        if (!value) return "Contact Number is required";
        if (!phoneRegex.test(value)) return "Invalid phone number";
        break;
      case "email":
        if (!value) return "Email is required";
        if (!emailRegex.test(value)) return "Invalid email";
        break;
      case "licenseNo":
        if (!value) return "License Number is required";
        break;
      case "type":
        if (!value) return "Hospital Type is required";
        break;
      case "password":
        if (!value) return "Password is required";
        break;
      case "confirmPassword":
        if (!value) return "Confirm Password is required";
        if (value !== values.password) return "Passwords do not match";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setForm((prev) => ({
        ...prev,
        state: value,
        city: ""
      }));

      setErrors((prev) => ({
        ...prev,
        state: validateField("state", value, { ...form, state: value, city: "" }),
        city: ""
      }));

      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, { ...form, [name]: value })
    }));

    if (existErrors[name]) {
      setExistErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, { ...form, [name]: value })
    }));
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        if (form.username) {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/hospitalapi/findusername/${encodeURIComponent(form.username)}`
          );
          setExistErrors((prev) => ({
            ...prev,
            username: res.data === true ? "Username already exists" : ""
          }));
        }

        if (form.email && emailRegex.test(form.email)) {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/hospitalapi/findemail/${encodeURIComponent(form.email)}`
          );
          setExistErrors((prev) => ({
            ...prev,
            email: res.data === true ? "Email already exists" : ""
          }));
        }

        if (form.contact && phoneRegex.test(form.contact)) {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/hospitalapi/findcontact/${encodeURIComponent(form.contact)}`
          );
          setExistErrors((prev) => ({
            ...prev,
            contact: res.data === true ? "Contact already exists" : ""
          }));
        }

        if (form.name) {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/hospitalapi/findname/${encodeURIComponent(form.name)}`
          );
          setExistErrors((prev) => ({
            ...prev,
            name: res.data === true ? "Hospital name already exists" : ""
          }));
        }
      } catch {
        // silent
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.username, form.email, form.contact, form.name]);

  const isFormValid =
    Object.values(form).every((f) => f.trim() !== "") &&
    Object.values(errors).every((v) => !v) &&
    Object.values(existErrors).every((v) => !v);

  const textFieldStyles = (fieldName, multiline = false) => ({
    mb: 2,
    ...(multiline
      ? {}
      : { "& .MuiInputBase-root": { height: "3rem", fontSize: "1rem" } }),
    "& .MuiOutlinedInput-root.Mui-focused": {
      boxShadow: `0 0 14px ${BLUE_ACCENT}45`,
      borderRadius: "8px",
      borderColor: BLUE_ACCENT
    },
    boxShadow: focusField === fieldName ? `0 0 10px ${BLUE_ACCENT}72` : "",
    transition: "box-shadow 0.2s"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.entries(form).forEach(([name, value]) => {
      newErrors[name] = validateField(name, value, form);
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (
      Object.values(newErrors).some((error) => error) ||
      Object.values(existErrors).some((error) => error)
    ) {
      toast.error("Please fix validation errors.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/hospitalapi/register`, form);
      toast.success("Hospital registered successfully!");

      sessionStorage.removeItem("prefill_hospital_username");

      setTimeout(() => navigate("/hospital-login"), 1200);
    } catch (err) {
      toast.error(err.response?.data || "Registration failed.");
    }
  };

  const showError = (field) => {
    if (existErrors[field]) return existErrors[field];
    if (errors[field]) return errors[field];
    return "";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${BLUE_PRIMARY} 0%, ${BLUE_BG} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        py: 7
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
          maxWidth: 620,
          padding: "0 1rem",
          margin: "0 auto"
        }}
      >
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 14px 32px rgba(0,0,128,0.12)",
            backgroundColor: "rgba(255,255,255,0.98)"
          }}
        >
          <Box sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h5"
              align="center"
              fontWeight="bold"
              sx={{
                mb: 4,
                color: BLUE_ACCENT,
                textShadow: "0px 1px 4px rgba(0,0,80,0.07)"
              }}
            >
              Hospital Registration
            </Typography>

            <form onSubmit={handleSubmit}>
              {[
                { label: "Username", name: "username", icon: <Person color="primary" /> },
                { label: "Hospital Name", name: "name", icon: <LocalHospital color="info" /> },
                { label: "Owner Name", name: "ownerName", icon: <Person color="info" /> }
              ].map((field) => (
                <motion.div key={field.name} variants={fadeInUp} whileHover={{ scale: 1.025 }}>
                  <TextField
                    label={field.label}
                    name={field.name}
                    required
                    fullWidth
                    value={form[field.name]}
                    onChange={handleChange}
                    onFocus={() => setFocusField(field.name)}
                    onBlur={handleBlur}
                    error={Boolean(showError(field.name))}
                    helperText={showError(field.name) || ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {field.icon}
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldStyles(field.name)}
                  />
                </motion.div>
              ))}

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.025 }}>
                <TextField
                  select
                  label="State"
                  name="state"
                  required
                  fullWidth
                  value={form.state}
                  onChange={handleChange}
                  onFocus={() => setFocusField("state")}
                  onBlur={handleBlur}
                  error={Boolean(showError("state"))}
                  helperText={showError("state")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("state")}
                >
                  {states.map((s, idx) => (
                    <MenuItem key={idx} value={s}>{s}</MenuItem>
                  ))}
                </TextField>
              </motion.div>

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.025 }}>
                <TextField
                  select
                  label="City"
                  name="city"
                  required
                  fullWidth
                  value={form.city}
                  onChange={handleChange}
                  onFocus={() => setFocusField("city")}
                  onBlur={handleBlur}
                  error={Boolean(showError("city"))}
                  helperText={showError("city")}
                  disabled={!form.state}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("city")}
                >
                  {form.state
                    ? stateCityData[form.state].map((c, idx) => (
                        <MenuItem key={idx} value={c}>
                          {c}
                        </MenuItem>
                      ))
                    : [<MenuItem key="0" value="">Select State First</MenuItem>]}
                </TextField>
              </motion.div>

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.025 }}>
                <TextField
                  label="Address"
                  name="address"
                  required
                  multiline
                  rows={3}
                  fullWidth
                  value={form.address}
                  onChange={handleChange}
                  onFocus={() => setFocusField("address")}
                  onBlur={handleBlur}
                  error={Boolean(showError("address"))}
                  helperText={showError("address")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Info color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("address", true)}
                />
              </motion.div>

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.025 }}>
                <TextField
                  label="Contact Number"
                  name="contact"
                  required
                  fullWidth
                  value={form.contact}
                  onChange={handleChange}
                  onFocus={() => setFocusField("contact")}
                  onBlur={handleBlur}
                  error={Boolean(showError("contact"))}
                  helperText={showError("contact")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="info" />
                      </InputAdornment>
                    ),
                    inputProps: {
                      maxLength: 10,
                      pattern: "[0-9]*",
                      inputMode: "numeric"
                    }
                  }}
                  sx={textFieldStyles("contact")}
                />
              </motion.div>

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.025 }}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  required
                  fullWidth
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusField("email")}
                  onBlur={handleBlur}
                  error={Boolean(showError("email"))}
                  helperText={showError("email")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="info" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("email")}
                />
              </motion.div>

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.025 }}>
                <TextField
                  label="License Number"
                  name="licenseNo"
                  required
                  fullWidth
                  value={form.licenseNo}
                  onChange={handleChange}
                  onFocus={() => setFocusField("licenseNo")}
                  onBlur={handleBlur}
                  error={Boolean(showError("licenseNo"))}
                  helperText={showError("licenseNo")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge color="info" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("licenseNo")}
                />
              </motion.div>

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.025 }}>
                <TextField
                  select
                  label="Hospital Type"
                  name="type"
                  required
                  fullWidth
                  value={form.type}
                  onChange={handleChange}
                  onFocus={() => setFocusField("type")}
                  onBlur={handleBlur}
                  error={Boolean(showError("type"))}
                  helperText={showError("type")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("type")}
                >
                  <MenuItem value="">Select Type</MenuItem>
                  <MenuItem value="NGO">NGO</MenuItem>
                  <MenuItem value="Private">Private</MenuItem>
                  <MenuItem value="Government">Government</MenuItem>
                </TextField>
              </motion.div>

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.025 }}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  required
                  fullWidth
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusField("password")}
                  onBlur={handleBlur}
                  error={Boolean(showError("password"))}
                  helperText={showError("password")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("password")}
                />
              </motion.div>

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.025 }}>
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  required
                  fullWidth
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusField("confirmPassword")}
                  onBlur={handleBlur}
                  error={Boolean(showError("confirmPassword"))}
                  helperText={showError("confirmPassword")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="info" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("confirmPassword")}
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={!isFormValid}
                  sx={{
                    py: 1.3,
                    fontWeight: "bold",
                    fontSize: "1rem",
                    background: `linear-gradient(90deg, ${BLUE_ACCENT} 0%, ${BLUE_SECONDARY} 100%)`,
                    color: "#fff",
                    boxShadow: "0 9px 30px rgba(33,121,230,0.18)",
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: `linear-gradient(90deg, ${BLUE_SECONDARY} 0%, ${BLUE_ACCENT} 100%)`,
                      boxShadow: "0 14px 40px rgba(33,121,230,0.28)"
                    }
                  }}
                >
                  Register Hospital
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