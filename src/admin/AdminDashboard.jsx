import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bloodBankImage from "./images/bloodbimage.png";
import hospitalImage from "./images/hospitalimage.jpg";

export default function AdminDashboard() {
  const [hospitalCount, setHospitalCount] = useState(0);
  const [bloodBankCount, setBloodBankCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [hospitalRes, bloodBankRes] = await Promise.all([
          axios.get(`${baseUrl}/admin/hospitals`),
          axios.get(`${baseUrl}/admin/bloodbanks`),
        ]);

        setHospitalCount(hospitalRes.data.length);
        setBloodBankCount(bloodBankRes.data.length);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [baseUrl]);

  const dashboardCards = [
    {
      title: "Total Hospitals",
      count: hospitalCount,
      image: hospitalImage,
      navigateTo: "/admin/hospitals",
      buttonText: "View Hospitals",
    },
    {
      title: "Total Blood Banks",
      count: bloodBankCount,
      image: bloodBankImage,
      navigateTo: "/admin/bloodbanks",
      buttonText: "View Blood Banks",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 100px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
      }}
    >
      {loading ? (
        <Box sx={{ textAlign: "center", color: "#fff" }}>
          <CircularProgress sx={{ color: "#fff", mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Loading Dashboard...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {dashboardCards.map((card, index) => (
            <Grid item xs={12} sm={10} md={6} lg={5} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card
                  sx={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.18)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    boxShadow: "0 12px 35px rgba(0,0,0,0.18)",
                    minHeight: 420,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.3s ease",
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: "center",
                      px: 4,
                      py: 4,
                    }}
                  >
                    <Box
                      sx={{
                        width: 150,
                        height: 150,
                        mx: "auto",
                        mb: 3,
                        borderRadius: "20px",
                        overflow: "hidden",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
                        border: "3px solid rgba(255,255,255,0.35)",
                        background: "#fff",
                      }}
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        color: "#fff",
                        mb: 2,
                        textShadow: "0 2px 10px rgba(0,0,0,0.25)",
                      }}
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 800,
                        color: "#ffffff",
                        mb: 1,
                        textShadow: "0 3px 12px rgba(0,0,0,0.25)",
                      }}
                    >
                      {card.count}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgba(255,255,255,0.9)",
                        fontWeight: 500,
                      }}
                    >
                      Registered records available in the system
                    </Typography>
                  </CardContent>

                  <Box sx={{ px: 3, pb: 3 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate(card.navigateTo)}
                      sx={{
                        py: 1.4,
                        borderRadius: "14px",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        background: "#ffffff",
                        color: "#e74c3c",
                        boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
                        "&:hover": {
                          background: "#fdecea",
                          color: "#c0392b",
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      {card.buttonText}
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}