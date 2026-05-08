import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Chip,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import OpacityIcon from '@mui/icons-material/Opacity';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

const RED_PRIMARY = "#b71c1c";
const RED_SECONDARY = "#e53935";
const RED_BG = "#ffebee";
const RED_ACCENT = "#c62828";

const cardFade = {
  hidden: { opacity: 0, y: 25 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08 },
  }),
};

const getBloodTypeColor = (type) => {
  const map = {
    "A+": "#d32f2f",
    "A-": "#c2185b",
    "B+": "#f4511e",
    "B-": "#7b1fa2",
    "O+": "#0288d1",
    "O-": "#1565c0",
    "AB+": "#2e7d32",
    "AB-": "#455a64",
  };
  return map[type] || RED_ACCENT;
};

export default function BloodBankDashboard() {
  const [bloodData, setBloodData] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchBloodData();
  }, []);

  const fetchBloodData = () => {
    axios
      .get(`${baseUrl}/bloodbankapi/viewallblooddata`)
      .then((res) => {
        const bloodUser = JSON.parse(sessionStorage.getItem('Blood_user'));
        const orgName = bloodUser?.name;

        const filteredData = res.data.filter((item) => item.org === orgName);

        const orderedTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
        const sortedData = [...filteredData].sort(
          (a, b) => orderedTypes.indexOf(a.type) - orderedTypes.indexOf(b.type)
        );

        setBloodData(sortedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch blood data:', err);
        setLoading(false);
      });
  };

  const handleDecrement = (type) => {
    axios
      .put(`${baseUrl}/bloodbankapi/decrement/${type}`)
      .then((res) => {
        const updatedData = bloodData.map((item) =>
          item.type === type ? res.data : item
        );
        setBloodData(updatedData);
      })
      .catch((err) => {
        console.error(`Failed to decrement blood unit for ${type}:`, err);
      });
  };

  const totalDonated = bloodData.reduce(
    (sum, item) => sum + (Number(item.donatedunits) || 0),
    0
  );
  const totalUsed = bloodData.reduce(
    (sum, item) => sum + (Number(item.usedunits) || 0),
    0
  );
  const totalAvailable = bloodData.reduce(
    (sum, item) => sum + (Number(item.aunits) || 0),
    0
  );

  return (
    <Box
      sx={{
        width: "100%",
        py: 4,
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: "28px",
          p: { xs: 2, sm: 3, md: 5 },
          background: "rgba(255,255,255,0.94)",
          boxShadow: "0 18px 45px rgba(120,0,0,0.18)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: RED_ACCENT,
              mb: 1,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Blood Stock Availability
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "text.secondary", maxWidth: 700, mx: "auto" }}
          >
            Live repository overview of donated, used, and currently available blood units.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: "20px",
                background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
                boxShadow: "0 10px 24px rgba(183,28,28,0.12)",
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <FavoriteIcon sx={{ fontSize: 34, color: RED_PRIMARY, mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total Donated
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: RED_PRIMARY }}>
                  {totalDonated}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: "20px",
                background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                boxShadow: "0 10px 24px rgba(230,81,0,0.12)",
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <OpacityIcon sx={{ fontSize: 34, color: "#ef6c00", mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total Used
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#ef6c00" }}>
                  {totalUsed}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: "20px",
                background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                boxShadow: "0 10px 24px rgba(46,125,50,0.12)",
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <WaterDropIcon sx={{ fontSize: 34, color: "#2e7d32", mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total Available
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#2e7d32" }}>
                  {totalAvailable}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {loading ? (
          <Box
            sx={{
              minHeight: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: RED_ACCENT }} />
            <Typography sx={{ color: "text.secondary" }}>
              Loading blood repository data...
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {bloodData.map((data, idx) => {
              const badgeColor = getBloodTypeColor(data.type);

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                  <motion.div
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    variants={cardFade}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <Card
                      sx={{
                        borderRadius: "22px",
                        minHeight: 250,
                        overflow: "hidden",
                        background: "linear-gradient(180deg, #ffffff 0%, #fff8f8 100%)",
                        boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                        border: "1px solid rgba(198,40,40,0.08)",
                      }}
                    >
                      <Box
                        sx={{
                          height: 8,
                          background: `linear-gradient(90deg, ${badgeColor}, ${RED_SECONDARY})`,
                        }}
                      />

                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 800,
                              color: "#222",
                            }}
                          >
                            Blood Type
                          </Typography>

                          <Chip
                            label={data.type}
                            sx={{
                              fontWeight: 800,
                              color: "#fff",
                              backgroundColor: badgeColor,
                              fontSize: "0.95rem",
                            }}
                          />
                        </Box>

                        <Box sx={{ display: "grid", gap: 1.5 }}>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: "14px",
                              background: "#fff5f5",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography sx={{ fontWeight: 600 }}>Donated Units</Typography>
                            <Typography sx={{ fontWeight: 800, color: RED_PRIMARY }}>
                              {data.donatedunits}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: "14px",
                              background: "#fff8f0",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography sx={{ fontWeight: 600 }}>Used Units</Typography>
                            <Typography sx={{ fontWeight: 800, color: "#ef6c00" }}>
                              {data.usedunits}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: "14px",
                              background: "#f1fff3",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography sx={{ fontWeight: 600 }}>Available Units</Typography>
                            <Typography sx={{ fontWeight: 800, color: "#2e7d32" }}>
                              {data.aunits}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}