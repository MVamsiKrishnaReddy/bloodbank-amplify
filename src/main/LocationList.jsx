import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Typography, Box, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { LocationOn } from "@mui/icons-material";
import { GlowCard } from "./AnimationComponents";

const LocationList = () => {
  const [coverageData, setCoverageData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchCoverage = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/hospitalapi/coverage`
        );
        setCoverageData(res.data || {});
        setLoading(false);
      } catch (err) {
        console.error("Error fetching coverage:", err);
        setError("Unable to load state and city data.");
        setLoading(false);
      }
    };
    fetchCoverage();
  }, []);

  // Infinite scroll logic
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const entries = Object.entries(coverageData);
    if (entries.length === 0) return;

    let scrollSpeed = entries.length === 1 ? 1 : 0.3; // faster if single card

    let animationFrameId;

    const scrollStep = () => {
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += scrollSpeed;
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => cancelAnimationFrame(animationFrameId);
  }, [coverageData]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress color="error" />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center" mt={2}>
        {error}
      </Typography>
    );
  }

  // Prepare duplicated items for smooth scrolling
  const entries = Object.entries(coverageData);
  let trackItems = [];
  if (entries.length === 0) {
    trackItems = [];
  } else if (entries.length === 1) {
    trackItems = Array(10).fill(entries[0]); // duplicate 10x if single card
  } else {
    trackItems = [...entries, ...entries]; // duplicate 2+ items twice
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
      >
        States and Cities We’re Proudly Serving
      </Typography>

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflowX: "hidden",
          gap: 2,
          px: 2,
          py: 1,
        }}
      >
        {trackItems.length === 0 ? (
          <Typography color="textSecondary">No coverage data available</Typography>
        ) : (
          trackItems.map(([stateName, cities], index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <GlowCard
                color="#ff4d4d"
                sx={{
                  minWidth: 220,
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textAlign: "center",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 6px 20px rgba(255,77,77,0.4)",
                  },
                }}
              >
                <LocationOn sx={{ fontSize: 40, color: "#e74c3c", mb: 1 }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#2c3e50",
                    mb: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {stateName}
                </Typography>

                <Box
                  sx={{
                    backgroundColor: "#fff5f5",
                    borderRadius: "10px",
                    p: 1,
                    mt: 1,
                    boxShadow: "inset 0 0 6px rgba(255,0,0,0.15)",
                  }}
                >
                  {Array.isArray(cities) ? (
                    cities.length === 0 ? (
                      <Typography variant="body2" sx={{ color: "#555" }}>
                        No cities available
                      </Typography>
                    ) : (
                      cities.map((city, idx) => (
                        <Typography
                          key={idx}
                          variant="body2"
                          sx={{
                            color: "#555",
                            lineHeight: 1.6,
                            fontSize: 13,
                            "&:hover": { color: "#e74c3c", fontWeight: 600 },
                          }}
                        >
                          🩸 {city}
                        </Typography>
                      ))
                    )
                  ) : typeof cities === "string" ? (
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", color: "#e74c3c" }}
                    >
                      {cities}
                    </Typography>
                  ) : (
                    <Typography variant="body2" sx={{ color: "#555" }}>
                      No data
                    </Typography>
                  )}
                </Box>
              </GlowCard>
            </motion.div>
          ))
        )}
      </Box>
    </Box>
  );
};

export default LocationList;
