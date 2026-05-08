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
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ViewAllBloodbanks() {
  const [bloodbanks, setBloodbanks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_URL;

  const fetchBloodbanks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/admin/bloodbanks`);
      setBloodbanks(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch blood banks. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodbanks();
  }, []);

  const deleteBloodBank = async (id) => {
    if (window.confirm("Are you sure you want to block this Blood Bank?")) {
      try {
        await axios.put(`${baseUrl}/bloodbankapi/updatestatus/${id}`);
        toast.success("Blood bank account blocked successfully.");
        fetchBloodbanks();
      } catch (err) {
        console.error(err);
        toast.error("Block failed: " + err.message);
        setError("Unexpected Error: " + err.message);
      }
    }
  };

  const unblockBloodBank = async (id) => {
    if (window.confirm("Are you sure you want to unblock this Blood Bank?")) {
      try {
        await axios.put(`${baseUrl}/bloodbankapi/updatestatus/${id}?status=true`);
        toast.success("Blood bank account unblocked successfully.");
        fetchBloodbanks();
      } catch (err) {
        console.error(err);
        toast.error("Unblock failed: " + err.message);
        setError("Unexpected Error: " + err.message);
      }
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
            <BloodtypeIcon sx={{ color: "#fff", fontSize: 32 }} />
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
              View All Blood Banks
            </Typography>
          </Box>

          {/* Loading */}
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
                Loading blood banks...
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
          ) : bloodbanks.length > 0 ? (
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
                      Blood Bank Name
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.95rem",
                        borderBottom: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      Location
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
                  {bloodbanks.map((bank, index) => (
                    <TableRow
                      key={bank.id}
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
                        {bank.id}
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
                            {bank.name}
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
                            {bank.location}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell
                        sx={{
                          borderBottom: "1px solid rgba(255,255,255,0.10)",
                        }}
                      >
                        {bank.status ? (
                          <Chip
                            label="Active"
                            sx={{
                              bgcolor: "rgba(46, 204, 113, 0.18)",
                              color: "#ffffff",
                              fontWeight: "bold",
                              border: "1px solid rgba(46, 204, 113, 0.45)",
                            }}
                          />
                        ) : (
                          <Chip
                            label="Blocked"
                            sx={{
                              bgcolor: "rgba(231, 76, 60, 0.18)",
                              color: "#ffffff",
                              fontWeight: "bold",
                              border: "1px solid rgba(231, 76, 60, 0.45)",
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
                        {bank.status ? (
                          <Button
                            variant="contained"
                            startIcon={<DeleteIcon />}
                            onClick={() => deleteBloodBank(bank.id)}
                            sx={{
                              background: "rgba(255,255,255,0.92)",
                              color: "#e74c3c",
                              fontWeight: "bold",
                              borderRadius: "12px",
                              textTransform: "none",
                              px: 2,
                              "&:hover": {
                                background: "#fdecea",
                                color: "#c0392b",
                              },
                            }}
                          >
                            Block
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => unblockBloodBank(bank.id)}
                            sx={{
                              background: "rgba(255,255,255,0.92)",
                              color: "#27ae60",
                              fontWeight: "bold",
                              borderRadius: "12px",
                              textTransform: "none",
                              px: 2,
                              "&:hover": {
                                background: "#eafaf1",
                                color: "#1e8449",
                              },
                            }}
                          >
                            Unblock
                          </Button>
                        )}
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
                No Blood Bank Data Found
              </Typography>
            </Box>
          )}
        </Box>
      </motion.div>
    </Box>
  );
}