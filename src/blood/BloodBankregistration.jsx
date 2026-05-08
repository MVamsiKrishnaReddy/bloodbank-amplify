import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Favorite,
  Bloodtype,
  LocalHospital,
  Person,
  Email,
  Phone,
  Business,
  Lock,
} from "@mui/icons-material";

const RED_PRIMARY = "#b71c1c";
const RED_SECONDARY = "#e53935";
const RED_BG = "#ffebee";
const RED_ACCENT = "#c62828";

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
  "Sikkim": ["Gangtok"],
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
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

export default function BloodBankRegistration() {
  const navigate = useNavigate();
  const location = useLocation();

  const passedUsername =
    location.state?.username ||
    sessionStorage.getItem("prefill_bloodbank_username") ||
    "";

  const [form, setForm] = useState({
    name: "",
    username: passedUsername,
    password: "",
    state: "",
    city: "",
    typeorg: "",
    phone: "",
    email: "",
    ownername: "",
  });

  const [focusField, setFocusField] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [nameExists, setNameExists] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const baseUrl = import.meta.env.VITE_API_URL;
  const states = Object.keys(stateCityData);

  useEffect(() => {
    if (passedUsername) {
      setForm((prev) => ({
        ...prev,
        username: passedUsername,
      }));
    }
  }, [passedUsername]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setForm((prev) => ({
        ...prev,
        state: value,
        city: "",
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") setPasswordTouched(true);

    if (name === "email") {
      setEmailError(value.length > 0 && !emailRegex.test(value));
      setEmailExists(false);
    }

    if (name === "phone") {
      setPhoneError(value.length > 0 && !phoneRegex.test(value));
      setPhoneExists(false);
    }

    if (name === "username") setUsernameExists(false);
    if (name === "name") setNameExists(false);
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        if (form.email && !emailError) {
          const res = await axios.get(
            `${baseUrl}/bloodbankapi/findemail/${encodeURIComponent(form.email)}`
          );
          setEmailExists(res.data === true);
        }

        if (form.phone && !phoneError) {
          const res = await axios.get(
            `${baseUrl}/bloodbankapi/findphone/${encodeURIComponent(form.phone)}`
          );
          setPhoneExists(res.data === true);
        }

        if (form.username) {
          const res = await axios.get(
            `${baseUrl}/bloodbankapi/findusername/${encodeURIComponent(form.username)}`
          );
          setUsernameExists(res.data === true);
        }

        if (form.name) {
          const res = await axios.get(
            `${baseUrl}/bloodbankapi/findname/${encodeURIComponent(form.name)}`
          );
          setNameExists(res.data === true);
        }
      } catch (err) {
        console.error("Error checking uniqueness:", err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.email, form.phone, form.username, form.name, emailError, phoneError, baseUrl]);

  const passwordValidations = {
    hasSpecialChar: /[^A-Za-z0-9 ]/.test(form.password),
    hasMinLength: form.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(form.password),
    hasNumber: /\d/.test(form.password),
  };

  const isPasswordValid = Object.values(passwordValidations).every(Boolean);

  const isFormValid =
    isPasswordValid &&
    form.name.trim() &&
    !nameExists &&
    form.username.trim() &&
    !usernameExists &&
    form.password.trim() &&
    form.state.trim() &&
    form.city.trim() &&
    form.typeorg.trim() &&
    form.phone.trim() &&
    !phoneError &&
    !phoneExists &&
    form.email.trim() &&
    !emailError &&
    !emailExists &&
    form.ownername.trim();

  const textFieldStyles = (fieldName, multiline = false) => ({
    mb: 2,
    ...(multiline
      ? {}
      : {
          "& .MuiInputBase-root": {
            height: "3rem",
            fontSize: "1rem",
          },
        }),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const res = await axios.post(
        `${baseUrl}/bloodbankapi/registerbloodbank`,
        form
      );

      toast.success(res.data || "Registration successful!");

      sessionStorage.removeItem("prefill_bloodbank_username");

      setForm({
        name: "",
        username: "",
        password: "",
        state: "",
        city: "",
        typeorg: "",
        phone: "",
        email: "",
        ownername: "",
      });

      setTimeout(() => {
        navigate("/bloodbank-login");
      }, 1200);
    } catch (err) {
      console.error("Error submitting:", err);
      toast.error("Failed to register blood bank.");
    }
  };

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
          maxWidth: 620,
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
              Blood Bank Registration
            </Typography>

            <form onSubmit={handleSubmit}>
              <motion.div variants={fadeInUp} whileHover={{ scale: 1.025 }}>
                <TextField
                  label="Blood Bank Name"
                  name="name"
                  required
                  fullWidth
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocusField("name")}
                  onBlur={() => setFocusField("")}
                  error={nameExists}
                  helperText={nameExists ? "Name already exists" : ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalHospital color="error" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("name")}
                />
              </motion.div>

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.025 }}>
                <TextField
                  label="Username"
                  name="username"
                  required
                  fullWidth
                  value={form.username}
                  onChange={handleChange}
                  onFocus={() => setFocusField("username")}
                  onBlur={() => setFocusField("")}
                  error={usernameExists}
                  helperText={usernameExists ? "Username already in use" : ""}
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
                  onBlur={() => {
                    setFocusField("");
                    setPasswordTouched(true);
                  }}
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

              {passwordTouched && (
                <Box sx={{ mb: 2 }}>
                  {Object.entries({
                    "Contains Special Character": passwordValidations.hasSpecialChar,
                    "Minimum Length 8": passwordValidations.hasMinLength,
                    "Contains Capital Letter": passwordValidations.hasUpperCase,
                    "Contains Number": passwordValidations.hasNumber,
                  }).map(([label, valid]) => (
                    <Typography
                      key={label}
                      variant="body2"
                      sx={{ color: valid ? "green" : "red" }}
                    >
                      {valid ? `✅ ${label}` : `❌ ${label}`}
                    </Typography>
                  ))}
                </Box>
              )}

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
                  onBlur={() => setFocusField("")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business color="error" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("state")}
                >
                  {states.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
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
                  disabled={!form.state}
                  value={form.city}
                  onChange={handleChange}
                  onFocus={() => setFocusField("city")}
                  onBlur={() => setFocusField("")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business color="error" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("city")}
                >
                  {form.state
                    ? stateCityData[form.state].map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))
                    : [<MenuItem key="0" value="">Select State First</MenuItem>]}
                </TextField>
              </motion.div>

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.025 }}>
                <TextField
                  select
                  label="Organization Type"
                  name="typeorg"
                  required
                  fullWidth
                  value={form.typeorg}
                  onChange={handleChange}
                  onFocus={() => setFocusField("typeorg")}
                  onBlur={() => setFocusField("")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business color="error" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("typeorg")}
                >
                  <MenuItem value="NGO">NGO</MenuItem>
                  <MenuItem value="GOVERNMENT">GOVERNMENT</MenuItem>
                  <MenuItem value="PRIVATE">PRIVATE</MenuItem>
                </TextField>
              </motion.div>

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.025 }}>
                <TextField
                  label="Contact Number"
                  name="phone"
                  required
                  fullWidth
                  value={form.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusField("phone")}
                  onBlur={() => setFocusField("")}
                  error={phoneError || phoneExists}
                  helperText={
                    phoneError
                      ? "Invalid phone number"
                      : phoneExists
                      ? "Phone number already exists"
                      : ""
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="error" />
                      </InputAdornment>
                    ),
                    inputProps: {
                      maxLength: 10,
                      pattern: "[0-9]*",
                      inputMode: "numeric",
                    },
                  }}
                  sx={textFieldStyles("phone")}
                />
              </motion.div>

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.025 }}>
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  fullWidth
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusField("email")}
                  onBlur={() => setFocusField("")}
                  error={emailError || emailExists}
                  helperText={
                    emailError
                      ? "Invalid email"
                      : emailExists
                      ? "Email already exists"
                      : ""
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="error" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("email")}
                />
              </motion.div>

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.025 }}>
                <TextField
                  label="Owner Name"
                  name="ownername"
                  required
                  fullWidth
                  value={form.ownername}
                  onChange={handleChange}
                  onFocus={() => setFocusField("ownername")}
                  onBlur={() => setFocusField("")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="error" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles("ownername")}
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
                  Register Blood Bank
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <ToastContainer position="top-center" autoClose={3000} />
    </Box>
  );
}