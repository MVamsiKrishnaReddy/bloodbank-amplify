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
} from "@mui/material";
import axios from "axios";

export default function HospitalFeedback() {
  const baseUrl = import.meta.env.VITE_API_URL;

  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [responses, setResponses] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ✅ Read username from sessionStorage
  const storedUser = sessionStorage.getItem("Hospital_user");
  const username = storedUser ? JSON.parse(storedUser).username : null;

  // ✅ Helper: Parse ISO date string
  const parseToLocalDate = (str) => {
    if (!str) return null;
    const [datePart, timePart] = str.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute, 0);
  };

  // ✅ Fetch hospital feedbacks on load
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`${baseUrl}/hospitalapi/findallfeedbacks`);
        setFeedbackList(res.data || []);
      } catch (err) {
        console.error("Error fetching hospital feedbacks:", err);
      }
    };
    fetchFeedbacks();
  }, [baseUrl]);

  // ✅ Handle feedback selection and checks
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
          (u) =>
            u.username && username && u.username.trim() === username.trim()
        )
      );

    let message = "";

    if (alreadySubmitted) {
      message = "You have already submitted this feedback.";
      setSubmitted(true);
    } else if (now < start) {
      message = `Feedback not started yet. Starts on ${start.toLocaleString()}`;
    } else if (now > end) {
      message = `Feedback period ended on ${end.toLocaleString()}`;
    }

    setStatusMessage(message);
  };

  // ✅ Handle rating selection
  const handleRatingChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  // ✅ Submit feedback
  const handleSubmit = async () => {
    if (!selectedFeedback) return;

    const unanswered = selectedFeedback.feedbackset.filter(
      (q) => !responses[q.id]
    );

    if (unanswered.length > 0) {
      alert("Please answer all questions before submitting.");
      return;
    }

    // Build payload
    const payload = Object.entries(responses).map(([questionId, rating]) => ({
      rating: parseInt(rating),
      username: username,
      question: { id: parseInt(questionId) },
    }));

    try {
      await axios.post(`${baseUrl}/hospitalapi/submitresponses`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setSubmitted(true);
      setStatusMessage("Feedback submitted successfully!");
    } catch (err) {
      console.error("Error submitting hospital feedback:", err);
      setStatusMessage("Error submitting feedback. Please try again later.");
    }
  };

  // ✅ Render component
  return (
    <div className="container mt-5 mb-5 d-flex justify-content-center">
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "700px",
          p: 4,
          borderRadius: 3,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(6px)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ textAlign: "center", mb: 3, fontWeight: "bold" }}
        >
          Hospital Feedback
        </Typography>

        {/* Feedback Form Selector */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Feedback Form</InputLabel>
          <Select
            value={selectedFeedback?.id || ""}
            label="Select Feedback Form"
            onChange={(e) => handleSelectFeedback(e.target.value)}
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

        {/* Feedback Details */}
        {selectedFeedback && (
          <Box>
            <Typography
              variant="h6"
              sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}
            >
              {selectedFeedback.name}
            </Typography>

            {statusMessage ? (
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: "1.1rem",
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
                {selectedFeedback.feedbackset.map((q) => (
                  <Box key={q.id} sx={{ mb: 2 }}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      {q.question.replaceAll('"', "")}
                    </Typography>
                    <RadioGroup
                      row
                      value={responses[q.id] || ""}
                      onChange={(e) =>
                        handleRatingChange(q.id, parseInt(e.target.value))
                      }
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <FormControlLabel
                          key={num}
                          value={num}
                          control={<Radio />}
                          label={num}
                        />
                      ))}
                    </RadioGroup>
                  </Box>
                ))}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Submit Feedback
                </Button>
              </>
            )}
          </Box>
        )}
      </Paper>
    </div>
  );
}
