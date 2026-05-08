import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
  Divider,
  InputAdornment,
} from "@mui/material";
import RateReviewIcon from "@mui/icons-material/RateReview";
import QuizIcon from "@mui/icons-material/Quiz";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ApartmentIcon from "@mui/icons-material/Apartment";
import TitleIcon from "@mui/icons-material/Title";
import NumbersIcon from "@mui/icons-material/Numbers";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function CreateFeedback() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  const [feedbackName, setFeedbackName] = useState("");
  const [org, setOrg] = useState("");
  const [numQuestions, setNumQuestions] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNumQuestionsChange = (e) => {
    const n = Math.max(1, parseInt(e.target.value) || 1);
    setNumQuestions(n);
    setQuestions((prev) => {
      const updated = Array(n).fill("");
      for (let i = 0; i < Math.min(prev.length, n); i++) {
        updated[i] = prev[i];
      }
      return updated;
    });
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const isFormValid =
    feedbackName.trim() !== "" &&
    org.trim() !== "" &&
    questions.length > 0 &&
    questions.every((q) => q.trim() !== "") &&
    startDate &&
    endDate &&
    new Date(startDate) > new Date() &&
    new Date(endDate) > new Date(startDate);

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      backgroundColor: "#ffffff",
      transition: "all 0.25s ease",
      "& fieldset": {
        borderColor: "#d7dce2",
      },
      "&:hover fieldset": {
        borderColor: "#e74c3c",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#e74c3c",
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#5f6b7a",
      fontWeight: 600,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#e74c3c",
    },
  };

  const pickerTextFieldProps = {
    fullWidth: true,
    sx: fieldSx,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please fill all fields correctly.");
      return;
    }

    const payload = {
      name: feedbackName,
      org,
      startdate: startDate,
      enddate: endDate,
      feedbackset: questions.map((q) => ({ question: q })),
    };

    try {
      setLoading(true);
      await axios.post(`${baseUrl}/admin/addfeedback`, payload);

      toast.success("Feedback set created successfully!");

      setFeedbackName("");
      setOrg("");
      setNumQuestions(1);
      setQuestions([]);
      setStartDate("");
      setEndDate("");

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create feedback set.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 100px)",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, md: 5 },
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <ToastContainer position="top-center" autoClose={3000} />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ width: "100%", maxWidth: "900px" }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: "24px",
            overflow: "hidden",
            background: "rgba(255,255,255,0.96)",
            boxShadow: "0 18px 45px rgba(0,0,0,0.22)",
            border: "1px solid rgba(255,255,255,0.45)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #d84335 0%, #ef5350 100%)",
              color: "#fff",
              px: { xs: 2.5, sm: 4 },
              py: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <RateReviewIcon sx={{ fontSize: 34 }} />
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.7rem", sm: "2.1rem" },
                    lineHeight: 1.1,
                  }}
                >
                  Create Feedback Set
                </Typography>
                <Typography
                  sx={{
                    mt: 0.7,
                    color: "rgba(255,255,255,0.88)",
                    fontSize: "0.98rem",
                  }}
                >
                  Configure feedback name, organization, dates, and questions.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              px: { xs: 2, sm: 4 },
              py: 4,
              background:
                "linear-gradient(180deg, #fff 0%, #fff8f8 50%, #ffffff 100%)",
            }}
          >
            {/* Basic Details */}
            <Box sx={{ mb: 4 }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "#c0392b",
                  fontSize: "1.1rem",
                  mb: 2,
                }}
              >
                Basic Details
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <TextField
                  label="Feedback Name"
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  required
                  fullWidth
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon sx={{ color: "#e74c3c" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl fullWidth required sx={fieldSx}>
                  <InputLabel>Organization</InputLabel>
                  <Select
                    value={org}
                    label="Organization"
                    onChange={(e) => setOrg(e.target.value)}
                  >
                    <MenuItem value="Blood Bank">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ApartmentIcon sx={{ color: "#e74c3c", fontSize: 20 }} />
                        Blood Bank
                      </Box>
                    </MenuItem>
                    <MenuItem value="Hospital">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ApartmentIcon sx={{ color: "#e74c3c", fontSize: 20 }} />
                        Hospital
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Schedule */}
            <Box sx={{ mb: 4 }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "#c0392b",
                  fontSize: "1.1rem",
                  mb: 2,
                }}
              >
                Schedule
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Start Date & Time"
                    value={startDate ? dayjs(startDate) : null}
                    onChange={(newValue) => {
                      const iso = newValue ? newValue.toISOString().slice(0, 16) : "";
                      setStartDate(iso);
                    }}
                    disablePast
                    slotProps={{
                      textField: {
                        ...pickerTextFieldProps,
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTimeIcon sx={{ color: "#e74c3c" }} />
                            </InputAdornment>
                          ),
                        },
                      },
                    }}
                  />

                  <DateTimePicker
                    label="End Date & Time"
                    value={endDate ? dayjs(endDate) : null}
                    onChange={(newValue) => {
                      const iso = newValue ? newValue.toISOString().slice(0, 16) : "";
                      setEndDate(iso);
                    }}
                    minDateTime={startDate ? dayjs(startDate).add(1, "day") : dayjs()}
                    slotProps={{
                      textField: {
                        ...pickerTextFieldProps,
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTimeIcon sx={{ color: "#e74c3c" }} />
                            </InputAdornment>
                          ),
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Box>

            {/* Questions Setup */}
            <Box sx={{ mb: 4 }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "#c0392b",
                  fontSize: "1.1rem",
                  mb: 2,
                }}
              >
                Question Setup
              </Typography>

              <TextField
                label="Number of Questions"
                type="number"
                value={numQuestions}
                onChange={handleNumQuestionsChange}
                inputProps={{ min: 1, max: 20 }}
                required
                fullWidth
                sx={{ ...fieldSx, mb: 2.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersIcon sx={{ color: "#e74c3c" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {questions.map((q, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: "16px",
                      border: "1px solid #f0d7d7",
                      background: "#fffafa",
                    }}
                  >
                    <Typography
                      sx={{
                        mb: 1.2,
                        fontWeight: 700,
                        color: "#7f1d1d",
                        fontSize: "0.98rem",
                      }}
                    >
                      Question {index + 1}
                    </Typography>

                    <TextField
                      label={`Enter question ${index + 1}`}
                      value={q}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                      required
                      fullWidth
                      multiline
                      minRows={2}
                      sx={fieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}>
                            <QuizIcon sx={{ color: "#e74c3c" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Paper>
                ))}
              </Box>
            </Box>

            {/* Button */}
            <Box sx={{ pt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!isFormValid || loading}
                fullWidth
                sx={{
                  py: 1.55,
                  borderRadius: "14px",
                  fontWeight: 800,
                  fontSize: "1rem",
                  textTransform: "none",
                  background: "linear-gradient(135deg, #e74c3c 0%, #d84335 100%)",
                  color: "#fff",
                  boxShadow: "0 10px 22px rgba(231,76,60,0.28)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #d84335 0%, #c0392b 100%)",
                  },
                  "&.Mui-disabled": {
                    background: "#d7dde5",
                    color: "#6b7280",
                    boxShadow: "none",
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: "#fff" }} />
                    Creating Feedback...
                  </Box>
                ) : (
                  "Create Feedback"
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}