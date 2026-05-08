import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import {
  Feedback as FeedbackIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import axios from "axios";

const RED_PRIMARY = "#b71c1c";
const RED_SECONDARY = "#e53935";
const RED_ACCENT = "#c62828";

export default function FeedbackForm() {
  const baseUrl = import.meta.env.VITE_API_URL;

  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [responses, setResponses] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focusField, setFocusField] = useState("");

  const storedUser = sessionStorage.getItem("Blood_user");
  const username = storedUser ? JSON.parse(storedUser).username : null;

  const parseToLocalDate = (str) => {
    if (!str) return null;
    const [datePart, timePart] = str.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute, 0);
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`${baseUrl}/bloodbankapi/findallfeedbacks`);
        setFeedbackList(res.data || []);
      } catch (err) {
        console.error("Error fetching feedback list:", err);
      }
    };
    fetchFeedbacks();
  }, [baseUrl]);

  const selectStyles = (fieldName) => ({
    mb: 3,
    "& .MuiInputBase-root": {
      height: "3rem",
      fontSize: "1rem",
      borderRadius: "8px",
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

  const handleSelectFeedback = (id) => {
    const selected = feedbackList.find((f) => f.id === id);
    setSelectedFeedback(selected);
    setResponses({});
    setSubmitted(false);
    setStatusMessage("");

    if (!selected) return;

    const now = new Date();
    const start = parseToLocalDate(selected.startdate);
    const end = parseToLocalDate(selected.enddate);

    const alreadySubmitted =
      selected.feedbackset &&
      selected.feedbackset.some((q) =>
        q.users?.some(
          (u) => u.username && username && u.username.trim() === username.trim()
        )
      );

    let message = "";

    if (alreadySubmitted) {
      message = "You have already submitted this feedback.";
      setSubmitted(true);
    } else if (now < start) {
      message = `Feedback has not started yet. Starts on ${start.toLocaleString()}`;
    } else if (now > end) {
      message = `Feedback period is over. Ended on ${end.toLocaleString()}`;
    }

    setStatusMessage(message);
  };

  const handleRatingChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedFeedback) return;

    const unanswered = selectedFeedback.feedbackset.filter(
      (q) => !responses[q.id]
    );

    if (unanswered.length > 0) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const payload = Object.entries(responses).map(([questionId, rating]) => ({
      rating: parseInt(rating),
      username: username,
      question: { id: parseInt(questionId) },
    }));

    try {
      await axios.post(`${baseUrl}/bloodbankapi/submitresponses`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setSubmitted(true);
      setStatusMessage("Feedback submitted successfully!");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setStatusMessage("Error submitting feedback. Please try again later.");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "760px",
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          background: "rgba(255,255,255,0.96)",
          boxShadow: "0 14px 32px rgba(120,0,0,0.15)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            mb: 4,
            fontWeight: "bold",
            color: RED_ACCENT,
            textShadow: "0px 1px 4px rgba(80,0,0,0.07)",
          }}
        >
          User Feedback
        </Typography>

        <FormControl fullWidth sx={selectStyles("feedbackForm")}>
          <InputLabel>Select Feedback Form</InputLabel>
          <Select
            value={selectedFeedback?.id || ""}
            label="Select Feedback Form"
            onChange={(e) => handleSelectFeedback(e.target.value)}
            onFocus={() => setFocusField("feedbackForm")}
            onBlur={() => setFocusField("")}
            startAdornment={
              <InputAdornment position="start" sx={{ mr: 1 }}>
                <FeedbackIcon color="error" />
              </InputAdornment>
            }
          >
            {feedbackList.length > 0 ? (
              feedbackList.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.name} ({f.org})
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No feedback forms found</MenuItem>
            )}
          </Select>
        </FormControl>

        {selectedFeedback && (
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(180deg, #ffffff 0%, #fff8f8 100%)",
                border: "1px solid rgba(198,40,40,0.08)",
                boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mb: 2,
                  flexWrap: "wrap",
                }}
              >
                <AssignmentIcon sx={{ color: RED_ACCENT }} />
                <Typography
                  variant="h6"
                  sx={{ textAlign: "center", fontWeight: "bold", color: RED_PRIMARY }}
                >
                  {selectedFeedback.name}
                </Typography>
              </Box>

              {statusMessage ? (
                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: "1.05rem",
                    fontWeight: "bold",
                    mt: 2,
                    color:
                      statusMessage.includes("successfully") ||
                      statusMessage.includes("submitted")
                        ? "green"
                        : "error.main",
                  }}
                >
                  {statusMessage}
                </Typography>
              ) : submitted ? (
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "green",
                    fontWeight: "bold",
                    mt: 2,
                  }}
                >
                  Feedback submitted successfully!
                </Typography>
              ) : (
                <>
                  {selectedFeedback.feedbackset.map((q, index) => (
                    <Paper
                      key={q.id}
                      elevation={0}
                      sx={{
                        mb: 2.5,
                        p: 2,
                        borderRadius: "16px",
                        background: index % 2 === 0 ? "#fff5f5" : "#fffafa",
                        border: "1px solid rgba(183,28,28,0.06)",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
                        <QuizIcon sx={{ color: RED_ACCENT, mt: "2px" }} />
                        <Typography sx={{ fontWeight: "bold" }}>
                          {q.question.replaceAll('"', "")}
                        </Typography>
                      </Box>

                      <RadioGroup
                        row
                        value={responses[q.id] || ""}
                        onChange={(e) =>
                          handleRatingChange(q.id, parseInt(e.target.value))
                        }
                        sx={{
                          mt: 1,
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <FormControlLabel
                            key={num}
                            value={num}
                            control={
                              <Radio
                                sx={{
                                  color: "#ef9a9a",
                                  "&.Mui-checked": {
                                    color: RED_ACCENT,
                                  },
                                }}
                              />
                            }
                            label={num}
                            sx={{
                              m: 0,
                              px: 1.5,
                              py: 0.6,
                              borderRadius: "12px",
                              background: "rgba(255,255,255,0.75)",
                              minWidth: "60px",
                              justifyContent: "center",
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </Paper>
                  ))}

                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    fullWidth
                    startIcon={<SendIcon />}
                    sx={{
                      mt: 2,
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
                    Submit Feedback
                  </Button>
                </>
              )}
            </Paper>
          </Box>
        )}
      </Paper>
    </Box>
  );
}