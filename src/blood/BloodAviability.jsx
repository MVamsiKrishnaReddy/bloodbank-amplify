import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  TextField,
  MenuItem,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";
import BadgeIcon from "@mui/icons-material/Badge";
import CloseIcon from "@mui/icons-material/Close";
import PublicIcon from "@mui/icons-material/Public";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RED_PRIMARY = "#b71c1c";
const RED_SECONDARY = "#e53935";
const RED_ACCENT = "#c62828";
const ACCESS_DURATION_MS = 3 * 60 * 1000;

export default function BloodAviability() {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("");

  const [showOverlay, setShowOverlay] = useState(false);
  const [externalVisible, setExternalVisible] = useState(false);
  const [externalLoading, setExternalLoading] = useState(false);

  const [allDonors, setAllDonors] = useState([]);
  const [filteredAllDonors, setFilteredAllDonors] = useState([]);

  const [externalState, setExternalState] = useState("");
  const [externalCity, setExternalCity] = useState("");
  const [externalBloodType, setExternalBloodType] = useState("");

  const [verifyForm, setVerifyForm] = useState({
    username: "",
    password: "",
  });

  const [expiryTime, setExpiryTime] = useState(null);
  const [remainingMs, setRemainingMs] = useState(0);

  const hideTimerRef = useRef(null);
  const countdownRef = useRef(null);

  const baseUrl = import.meta.env.VITE_API_URL;
  const bloodUser = JSON.parse(sessionStorage.getItem("Blood_user") || "{}");
  const loggedInOrg = bloodUser?.name || "";

  useEffect(() => {
    if (!loggedInOrg) {
      setLoading(false);
      toast.error("Blood bank session not found.");
      return;
    }

    axios
      .get(`${baseUrl}/bloodbankapi/donors/${encodeURIComponent(loggedInOrg)}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setDonors(data);
        setFilteredDonors(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to fetch donor records.");
        setLoading(false);
      });
  }, [baseUrl, loggedInOrg]);

  useEffect(() => {
    let filtered = donors;

    if (selectedState) {
      filtered = filtered.filter((d) => d.state === selectedState);
    }

    if (selectedCity) {
      filtered = filtered.filter((d) => d.city === selectedCity);
    }

    if (selectedBloodType) {
      filtered = filtered.filter((d) => d.bloodType === selectedBloodType);
    }

    setFilteredDonors(filtered);
  }, [selectedState, selectedCity, selectedBloodType, donors]);

  useEffect(() => {
    let filtered = allDonors;

    if (externalState) {
      filtered = filtered.filter((d) => d.state === externalState);
    }

    if (externalCity) {
      filtered = filtered.filter((d) => d.city === externalCity);
    }

    if (externalBloodType) {
      filtered = filtered.filter((d) => d.bloodType === externalBloodType);
    }

    setFilteredAllDonors(filtered);
  }, [externalState, externalCity, externalBloodType, allDonors]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const states = [...new Set(donors.map((d) => d.state).filter(Boolean))];
  const cities = [
    ...new Set(
      donors
        .filter((d) => !selectedState || d.state === selectedState)
        .map((d) => d.city)
        .filter(Boolean)
    ),
  ];
  const bloodTypes = [...new Set(donors.map((d) => d.bloodType).filter(Boolean))];

  const externalStates = [...new Set(allDonors.map((d) => d.state).filter(Boolean))];
  const externalCities = [
    ...new Set(
      allDonors
        .filter((d) => !externalState || d.state === externalState)
        .map((d) => d.city)
        .filter(Boolean)
    ),
  ];
  const externalBloodTypes = [
    ...new Set(allDonors.map((d) => d.bloodType).filter(Boolean)),
  ];

  const clearExternalAccess = (showMsg = false) => {
    setExternalVisible(false);
    setAllDonors([]);
    setFilteredAllDonors([]);
    setExternalState("");
    setExternalCity("");
    setExternalBloodType("");
    setExpiryTime(null);
    setRemainingMs(0);

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    if (showMsg) {
      toast.info("View all donors access expired.");
    }
  };

  const startAccessTimer = () => {
    const end = Date.now() + ACCESS_DURATION_MS;

    setExpiryTime(end);
    setRemainingMs(ACCESS_DURATION_MS);

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    hideTimerRef.current = setTimeout(() => {
      clearExternalAccess(true);
    }, ACCESS_DURATION_MS);

    countdownRef.current = setInterval(() => {
      const remaining = Math.max(0, end - Date.now());
      setRemainingMs(remaining);

      if (remaining <= 0) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    }, 1000);
  };

  const formatRemaining = () => {
    const mins = Math.floor(remainingMs / 60000);
    const secs = Math.floor((remainingMs % 60000) / 1000);
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const handleResetFilters = () => {
    setSelectedState("");
    setSelectedCity("");
    setSelectedBloodType("");
    setFilteredDonors(donors);
  };

  const handleResetExternalFilters = () => {
    setExternalState("");
    setExternalCity("");
    setExternalBloodType("");
    setFilteredAllDonors(allDonors);
  };

  const handleVerifyChange = (e) => {
    const { name, value } = e.target;
    setVerifyForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewAllDonors = async () => {
    if (!verifyForm.username.trim() || !verifyForm.password.trim()) {
      toast.error("Please enter username and password.");
      return;
    }

    try {
      setExternalLoading(true);

      const res = await axios.post(`${baseUrl}/bloodbankapi/viewalldonorsverify`, {
        username: verifyForm.username.trim(),
        password: verifyForm.password,
      });

      const data = Array.isArray(res.data) ? res.data : [];

      setAllDonors(data);
      setFilteredAllDonors(data);
      setExternalVisible(true);
      setShowOverlay(false);

      setVerifyForm({
        username: "",
        password: "",
      });

      startAccessTimer();
      toast.success("All donor data visible for 3 minutes.");
    } catch {
      toast.error("Access failed.");
    } finally {
      setExternalLoading(false);
    }
  };

  const textFieldStyle = {
    minWidth: 180,
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(6px)",
      "& fieldset": {
        borderColor: "rgba(255,255,255,0.25)",
      },
      "&:hover fieldset": {
        borderColor: RED_ACCENT,
      },
      "&.Mui-focused fieldset": {
        borderColor: RED_ACCENT,
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.9)",
      fontWeight: 500,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#fff",
    },
    "& .MuiSelect-select": {
      color: "#fff",
    },
    "& .MuiInputBase-input": {
      color: "#fff",
    },
    "& .MuiSvgIcon-root": {
      color: "#fff",
    },
  };

  const dialogFieldStyle = {
    mt: 1.5,
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
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
  };

  const renderDonorTable = (rows) => (
    <TableContainer
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        backdropFilter: "blur(6px)",
        background: "rgba(255,255,255,0.15)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              background: `linear-gradient(90deg, ${RED_PRIMARY}, ${RED_SECONDARY})`,
            }}
          >
            {["Name", "Gender", "Blood", "Phone", "Age", "State", "City", "Organization"].map(
              (heading, idx) => (
                <TableCell
                  key={idx}
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    borderBottom: "none",
                  }}
                >
                  {heading}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                align="center"
                sx={{
                  color: "#fff",
                  background: "rgba(255,255,255,0.08)",
                  borderBottom: "none",
                }}
              >
                No donors found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((donor, idx) => (
              <TableRow
                key={idx}
                sx={{
                  background: "rgba(255,255,255,0.08)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.18)",
                  },
                }}
              >
                <TableCell sx={{ color: "#fff" }}>{donor.fullName}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{donor.gender}</TableCell>
                <TableCell sx={{ color: "#fff" }}>
                  <Box
                    sx={{
                      background: RED_ACCENT,
                      color: "#fff",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "10px",
                      display: "inline-block",
                      fontWeight: "bold",
                    }}
                  >
                    {donor.bloodType}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: "#fff" }}>{donor.phoneno}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{donor.age}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{donor.state}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{donor.city}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{donor.org}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box
      sx={{
        width: "100%",
        px: 2,
        py: 4,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          p: 2,
          borderRadius: "20px",
          background: "transparent",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 4,
            fontWeight: "bold",
            color: "#fff",
            textShadow: "0 2px 10px rgba(0,0,0,0.20)",
          }}
        >
          Blood Donor Records
        </Typography>

        {loading ? (
          <Box textAlign="center">
            <CircularProgress sx={{ color: "#fff" }} />
          </Box>
        ) : donors.length === 0 ? (
          <Typography align="center" sx={{ color: "#fff", fontWeight: 500 }}>
            No donors found for your organization.
          </Typography>
        ) : (
          <>
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="center"
              gap={2}
              mb={3}
            >
              <TextField
                select
                label="State"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity("");
                }}
                sx={textFieldStyle}
              >
                <MenuItem value="">All States</MenuItem>
                {states.map((state, idx) => (
                  <MenuItem key={idx} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="City"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                sx={textFieldStyle}
                disabled={!selectedState && cities.length === 0}
              >
                <MenuItem value="">All Cities</MenuItem>
                {cities.map((city, idx) => (
                  <MenuItem key={idx} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Blood Type"
                value={selectedBloodType}
                onChange={(e) => setSelectedBloodType(e.target.value)}
                sx={textFieldStyle}
              >
                <MenuItem value="">All Blood Types</MenuItem>
                {bloodTypes.map((type, idx) => (
                  <MenuItem key={idx} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                onClick={handleResetFilters}
                sx={{
                  background: RED_SECONDARY,
                  color: "#fff",
                  borderRadius: "10px",
                  minWidth: "50px",
                  height: "56px",
                  "&:hover": {
                    background: RED_PRIMARY,
                  },
                }}
              >
                <RefreshIcon />
              </Button>

              <Button
                startIcon={<PublicIcon />}
                onClick={() => setShowOverlay(true)}
                sx={{
                  background: "linear-gradient(90deg, #8b0000, #c62828)",
                  color: "#fff",
                  borderRadius: "10px",
                  px: 2.2,
                  height: "56px",
                  fontWeight: "bold",
                  "&:hover": {
                    background: "linear-gradient(90deg, #6d0000, #b71c1c)",
                  },
                }}
              >
                View All Blood Donors
              </Button>
            </Box>

            {renderDonorTable(filteredDonors)}

            {externalVisible && (
              <Box mt={5}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={2}
                  mb={2}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      textShadow: "0 2px 10px rgba(0,0,0,0.20)",
                    }}
                  >
                    All Blood Donors
                  </Typography>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        background: "rgba(0,0,0,0.18)",
                        px: 2,
                        py: 1,
                        borderRadius: "10px",
                        minWidth: "140px",
                        textAlign: "center",
                      }}
                    >
                      Expires in: {formatRemaining()}
                    </Typography>

                    <IconButton
                      onClick={() => clearExternalAccess(false)}
                      sx={{
                        color: "#fff",
                        background: "rgba(255,255,255,0.12)",
                        "&:hover": {
                          background: "rgba(255,255,255,0.2)",
                        },
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box
                  display="flex"
                  flexWrap="wrap"
                  justifyContent="center"
                  gap={2}
                  mb={3}
                >
                  <TextField
                    select
                    label="State"
                    value={externalState}
                    onChange={(e) => {
                      setExternalState(e.target.value);
                      setExternalCity("");
                    }}
                    sx={textFieldStyle}
                  >
                    <MenuItem value="">All States</MenuItem>
                    {externalStates.map((state, idx) => (
                      <MenuItem key={idx} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="City"
                    value={externalCity}
                    onChange={(e) => setExternalCity(e.target.value)}
                    sx={textFieldStyle}
                    disabled={!externalState && externalCities.length === 0}
                  >
                    <MenuItem value="">All Cities</MenuItem>
                    {externalCities.map((city, idx) => (
                      <MenuItem key={idx} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Blood Type"
                    value={externalBloodType}
                    onChange={(e) => setExternalBloodType(e.target.value)}
                    sx={textFieldStyle}
                  >
                    <MenuItem value="">All Blood Types</MenuItem>
                    {externalBloodTypes.map((type, idx) => (
                      <MenuItem key={idx} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Button
                    onClick={handleResetExternalFilters}
                    sx={{
                      background: RED_SECONDARY,
                      color: "#fff",
                      borderRadius: "10px",
                      minWidth: "50px",
                      height: "56px",
                      "&:hover": {
                        background: RED_PRIMARY,
                      },
                    }}
                  >
                    <RefreshIcon />
                  </Button>
                </Box>

                {renderDonorTable(filteredAllDonors)}
              </Box>
            )}
          </>
        )}
      </Box>

      <Dialog
        open={showOverlay}
        onClose={() => setShowOverlay(false)}
        fullWidth
        maxWidth="sm"
        sx={{ zIndex: 1400 }}
        PaperProps={{
          sx: {
            borderRadius: "18px",
            background: "rgba(255,255,255,0.97)",
            boxShadow: "0 18px 40px rgba(120,0,0,0.22)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: RED_PRIMARY,
            textAlign: "center",
            pb: 1,
          }}
        >
          View All Blood Donors
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              mb: 2,
              color: "#555",
              textAlign: "center",
            }}
          >
            Re-enter blood bank credentials to view all blood donors for 3 minutes.
          </Typography>

          <TextField
            fullWidth
            label="Username"
            name="username"
            value={verifyForm.username}
            onChange={handleVerifyChange}
            sx={dialogFieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon color="error" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={verifyForm.password}
            onChange={handleVerifyChange}
            sx={dialogFieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="error" />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, justifyContent: "center", gap: 1 }}>
          <Button
            onClick={() => setShowOverlay(false)}
            variant="outlined"
            sx={{
              borderColor: RED_ACCENT,
              color: RED_ACCENT,
              borderRadius: "10px",
              fontWeight: "bold",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleViewAllDonors}
            variant="contained"
            startIcon={<VisibilityIcon />}
            disabled={externalLoading}
            sx={{
              background: `linear-gradient(90deg, ${RED_ACCENT} 0%, ${RED_SECONDARY} 100%)`,
              color: "#fff",
              borderRadius: "10px",
              fontWeight: "bold",
              px: 2.5,
              "&:hover": {
                background: `linear-gradient(90deg, ${RED_SECONDARY} 0%, ${RED_ACCENT} 100%)`,
              },
            }}
          >
            {externalLoading ? "Verifying..." : "View All"}
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        toastStyle={{
          marginTop: "90px",
          zIndex: 20000,
        }}
        style={{
          zIndex: 20000,
        }}
      />
    </Box>
  );
}