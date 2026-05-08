import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ViewAllHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_URL;

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/admin/hospitals`);
      setHospitals(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch hospitals. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const toggleBlockHospital = async (id) => {
    try {
      const response = await axios.put(`${baseUrl}/admin/hospital/block/${id}`);
      if (response.data) {
        toast.success("Hospital status updated successfully!");
      } else {
        toast.error("Failed to update hospital status.");
      }
      fetchHospitals();
    } catch (err) {
      console.error(err);
      toast.error("Error: " + err.message);
      setError("Unexpected Error: " + err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 100px)",
        px: { xs: 1.5, sm: 2, md: 4 },
        py: 4,
      }}
    >
      <ToastContainer position="top-center" autoClose={3000} />

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            maxWidth: "1200px",
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
            <LocalHospitalIcon sx={{ color: "#fff", fontSize: 32 }} />
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                fontWeight: 800,
                letterSpacing: 0.5,
                textShadow: "0 2px 10px rgba(0,0,0,0.25)",
                fontSize: { xs: "1.6rem", sm: "2rem" },
              }}
            >
              View All Hospitals
            </Typography>
          </Box>

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
                Loading hospitals...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ py: 6, px: 3, textAlign: "center" }}>
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
          ) : hospitals.length > 0 ? (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                background: "transparent",
                boxShadow: "none",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      background: "rgba(255,255,255,0.12)",
                    }}
                  >
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.95rem",
                        borderBottom: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.95rem",
                        borderBottom: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      Hospital Name
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.95rem",
                        borderBottom: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      Address
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.95rem",
                        borderBottom: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.95rem",
                        borderBottom: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {hospitals.map((hospital, index) => (
                    <TableRow
                      key={hospital.id}
                      component={motion.tr}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      sx={{
                        "&:hover": {
                          background: "rgba(255,255,255,0.08)",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "#fff",
                          borderBottom: "1px solid rgba(255,255,255,0.10)",
                          fontWeight: 600,
                        }}
                      >
                        {hospital.id}
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "#fff",
                          borderBottom: "1px solid rgba(255,255,255,0.10)",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <BusinessIcon sx={{ color: "#fff", fontSize: 20 }} />
                          <Typography sx={{ color: "#fff", fontWeight: 600 }}>
                            {hospital.name}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "#fff",
                          borderBottom: "1px solid rgba(255,255,255,0.10)",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <LocationOnIcon sx={{ color: "#fff", fontSize: 20 }} />
                          <Typography sx={{ color: "#fff" }}>
                            {hospital.address}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell
                        sx={{
                          borderBottom: "1px solid rgba(255,255,255,0.10)",
                        }}
                      >
                        {hospital.blocked ? (
                          <Chip
                            label="Blocked"
                            sx={{
                              bgcolor: "rgba(231, 76, 60, 0.18)",
                              color: "#ffffff",
                              fontWeight: "bold",
                              border: "1px solid rgba(231, 76, 60, 0.45)",
                            }}
                          />
                        ) : (
                          <Chip
                            label="Active"
                            sx={{
                              bgcolor: "rgba(46, 204, 113, 0.18)",
                              color: "#ffffff",
                              fontWeight: "bold",
                              border: "1px solid rgba(46, 204, 113, 0.45)",
                            }}
                          />
                        )}
                      </TableCell>

                      <TableCell
                        align="center"
                        sx={{
                          borderBottom: "1px solid rgba(255,255,255,0.10)",
                        }}
                      >
                        <Button
                          variant="contained"
                          startIcon={
                            hospital.blocked ? <LockOpenIcon /> : <BlockIcon />
                          }
                          onClick={() => toggleBlockHospital(hospital.id)}
                          sx={{
                            background: "rgba(255,255,255,0.92)",
                            color: hospital.blocked ? "#27ae60" : "#e74c3c",
                            fontWeight: "bold",
                            borderRadius: "12px",
                            textTransform: "none",
                            px: 2,
                            "&:hover": {
                              background: hospital.blocked ? "#eafaf1" : "#fdecea",
                              color: hospital.blocked ? "#1e8449" : "#c0392b",
                            },
                          }}
                        >
                          {hospital.blocked ? "Unblock" : "Block"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ py: 7, textAlign: "center", px: 2 }}>
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.15rem",
                  textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                No Hospital Data Found
              </Typography>
            </Box>
          )}
        </Box>
      </motion.div>
    </Box>
  );
}