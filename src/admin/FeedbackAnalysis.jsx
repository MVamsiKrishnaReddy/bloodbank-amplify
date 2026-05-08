import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  Paper,
} from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import BusinessIcon from "@mui/icons-material/Business";
import RateReviewIcon from "@mui/icons-material/RateReview";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import axios from "axios";
import dayjs from "dayjs";

export default function FeedbackAnalysis() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState("");
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [selectedFeedbackObj, setSelectedFeedbackObj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/admin/viewallfeedback`);
        setFeedbackData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError("Failed to fetch feedback data");
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [baseUrl]);

  const handleOrgChange = (event) => {
    const org = event.target.value;
    setSelectedOrg(org);
    setSelectedFeedback("");
    const filtered = feedbackData.filter((item) => item.org === org);
    setFilteredFeedbacks(filtered);
    setSelectedFeedbackObj(null);
  };

  const handleFeedbackChange = (event) => {
    const feedbackName = event.target.value;
    setSelectedFeedback(feedbackName);
    const fb = filteredFeedbacks.find((f) => f.name === feedbackName);
    setSelectedFeedbackObj(fb);
  };

  const getFeedbackStatus = (start, end) => {
    const now = dayjs();
    if (dayjs(start).isAfter(now)) return "not_started";
    if (dayjs(end).isBefore(now)) return "completed";
    return "ongoing";
  };

  const prepareQuestionChart = (questionObj) => {
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    questionObj.users.forEach((user) => {
      if (user.rating >= 1 && user.rating <= 5) {
        ratingCounts[user.rating]++;
      }
    });
    return Object.entries(ratingCounts).map(([rating, count]) => ({
      rating,
      count,
    }));
  };

  const feedbackStatus = selectedFeedbackObj
    ? getFeedbackStatus(
        selectedFeedbackObj.startdate,
        selectedFeedbackObj.enddate
      )
    : null;

  const commonFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      background: "rgba(255,255,255,0.92)",
      "& fieldset": {
        borderColor: "rgba(255,255,255,0.25)",
      },
      "&:hover fieldset": {
        borderColor: "#ffffff",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#e74c3c",
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root": {
      fontWeight: 600,
    },
  };

  const getStatusChip = (status) => {
    if (status === "not_started") {
      return (
        <Chip
          label="Not Started"
          sx={{
            bgcolor: "rgba(52, 152, 219, 0.18)",
            color: "#ffffff",
            fontWeight: "bold",
            border: "1px solid rgba(52, 152, 219, 0.45)",
          }}
        />
      );
    }

    if (status === "completed") {
      return (
        <Chip
          label="Completed"
          sx={{
            bgcolor: "rgba(231, 76, 60, 0.18)",
            color: "#ffffff",
            fontWeight: "bold",
            border: "1px solid rgba(231, 76, 60, 0.45)",
          }}
        />
      );
    }

    return (
      <Chip
        label="Ongoing"
        sx={{
          bgcolor: "rgba(46, 204, 113, 0.18)",
          color: "#ffffff",
          fontWeight: "bold",
          border: "1px solid rgba(46, 204, 113, 0.45)",
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 100px)",
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            maxWidth: "1100px",
            mx: "auto",
            background: "rgba(255,255,255,0.14)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: "24px",
            boxShadow: "0 12px 35px rgba(0,0,0,0.18)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: { xs: 2, sm: 3, md: 4 },
              py: 3,
              borderBottom: "1px solid rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <AnalyticsIcon sx={{ color: "#fff", fontSize: 32 }} />
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                fontWeight: 800,
                letterSpacing: 0.5,
                textShadow: "0 2px 10px rgba(0,0,0,0.25)",
                fontSize: { xs: "1.55rem", sm: "2rem" },
              }}
            >
              Feedback Analysis
            </Typography>
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              px: { xs: 2, sm: 3, md: 4 },
              py: 4,
            }}
          >
            {loading ? (
              <Box
                sx={{
                  py: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress sx={{ color: "#fff", mb: 2 }} />
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1.05rem",
                  }}
                >
                  Loading feedback analysis...
                </Typography>
              </Box>
            ) : error ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography
                  sx={{
                    color: "#ffebee",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                  }}
                >
                  {error}
                </Typography>
              </Box>
            ) : feedbackData.length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                  }}
                >
                  No feedback data available.
                </Typography>
              </Box>
            ) : (
              <>
                {/* Dropdowns */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                    mb: 3,
                  }}
                >
                  <FormControl fullWidth sx={commonFieldSx}>
                    <InputLabel>Select Organization</InputLabel>
                    <Select value={selectedOrg} onChange={handleOrgChange} label="Select Organization">
                      {[...new Set(feedbackData.map((item) => item.org))].map((org) => (
                        <MenuItem key={org} value={org}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <BusinessIcon fontSize="small" />
                            {org}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {selectedOrg && (
                    <FormControl fullWidth sx={commonFieldSx}>
                      <InputLabel>Select Feedback</InputLabel>
                      <Select
                        value={selectedFeedback}
                        onChange={handleFeedbackChange}
                        label="Select Feedback"
                      >
                        {filteredFeedbacks.map((fb) => (
                          <MenuItem key={fb.id} value={fb.name}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <RateReviewIcon fontSize="small" />
                              {fb.name}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Box>

                {/* Selected Feedback Info */}
                {selectedFeedbackObj && (
                  <Box sx={{ mb: 3 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.20)",
                        borderRadius: "18px",
                        p: 2.5,
                        color: "#fff",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: { xs: "flex-start", md: "center" },
                          flexDirection: { xs: "column", md: "row" },
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              mb: 0.8,
                              color: "#fff",
                            }}
                          >
                            {selectedFeedbackObj.name}
                          </Typography>
                          <Typography sx={{ color: "rgba(255,255,255,0.88)" }}>
                            Organization: {selectedFeedbackObj.org}
                          </Typography>
                          <Typography sx={{ color: "rgba(255,255,255,0.88)" }}>
                            Start: {dayjs(selectedFeedbackObj.startdate).format("DD MMM YYYY, hh:mm A")}
                          </Typography>
                          <Typography sx={{ color: "rgba(255,255,255,0.88)" }}>
                            End: {dayjs(selectedFeedbackObj.enddate).format("DD MMM YYYY, hh:mm A")}
                          </Typography>
                        </Box>

                        <Box>{getStatusChip(feedbackStatus)}</Box>
                      </Box>
                    </Paper>
                  </Box>
                )}

                {/* Status / Charts */}
                {selectedFeedbackObj && (
                  <>
                    {feedbackStatus === "not_started" ? (
                      <Box sx={{ py: 4, textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#fff",
                            fontWeight: 700,
                          }}
                        >
                          Feedback not yet started.
                        </Typography>
                      </Box>
                    ) : selectedFeedbackObj.feedbackset.length === 0 ? (
                      <Box sx={{ py: 4, textAlign: "center" }}>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontWeight: 700,
                          }}
                        >
                          No feedback questions available.
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {selectedFeedbackObj.feedbackset.map((question, index) => (
                          <motion.div
                            key={question.id}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: index * 0.07 }}
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                p: { xs: 2, sm: 3 },
                                background: "rgba(255,255,255,0.12)",
                                border: "1px solid rgba(255,255,255,0.20)",
                                borderRadius: "20px",
                                color: "#fff",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1.2,
                                  mb: 2,
                                }}
                              >
                                <QuestionAnswerIcon sx={{ color: "#fff" }} />
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 700,
                                    color: "#fff",
                                  }}
                                >
                                  {question.question}
                                </Typography>
                              </Box>

                              {question.users.length === 0 ? (
                                <Typography
                                  sx={{
                                    color: "rgba(255,255,255,0.88)",
                                    fontWeight: 500,
                                  }}
                                >
                                  No responses yet.
                                </Typography>
                              ) : (
                                <Box
                                  sx={{
                                    width: "100%",
                                    height: 260,
                                    background: "rgba(255,255,255,0.90)",
                                    borderRadius: "16px",
                                    p: 2,
                                  }}
                                >
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                      data={prepareQuestionChart(question)}
                                      layout="vertical"
                                      margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis type="number" allowDecimals={false} />
                                      <YAxis
                                        type="category"
                                        dataKey="rating"
                                        label={{
                                          value: "Rating",
                                          angle: -90,
                                          position: "insideLeft",
                                        }}
                                      />
                                      <Tooltip />
                                      <Bar
                                        dataKey="count"
                                        fill="#e74c3c"
                                        barSize={22}
                                        radius={[0, 8, 8, 0]}
                                        name="Responses"
                                      />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </Box>
                              )}
                            </Paper>
                          </motion.div>
                        ))}
                      </Box>
                    )}
                  </>
                )}
              </>
            )}
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}