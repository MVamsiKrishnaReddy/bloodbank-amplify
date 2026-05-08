import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  TextField,
  MenuItem,
  Collapse,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Card,
  CardContent,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  Bloodtype,
  LocalHospital,
  Person,
  CalendarMonth,
  WarningAmber,
  Inventory2,
  Favorite,
  CheckCircle,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const RED_PRIMARY = "#b71c1c";
const RED_SECONDARY = "#e53935";
const RED_ACCENT = "#c62828";

const compatibilityMap = {
  "O-": ["O-"],
  "O+": ["O-", "O+"],
  "A-": ["O-", "A-"],
  "A+": ["O-", "O+", "A-", "A+"],
  "B-": ["O-", "B-"],
  "B+": ["O-", "O+", "B-", "B+"],
  "AB-": ["O-", "A-", "B-", "AB-"],
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
};

export default function UpdateBloodRequest() {
  const [requests, setRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnitsMap, setSelectedUnitsMap] = useState({});
  const [selectedBloodTypeMap, setSelectedBloodTypeMap] = useState({});
  const [expandedMap, setExpandedMap] = useState({});
  const [availableStockMap, setAvailableStockMap] = useState({});
  const [focusField, setFocusField] = useState("");

  const bloodUser = JSON.parse(sessionStorage.getItem("Blood_user") || "{}");
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (bloodUser?.name) {
      fetchRequests();
    } else {
      toast.error("Blood user not found in session storage");
      setLoading(false);
    }
  }, []);

  const getCompatibleDonorTypes = (requestedBloodGroup) => {
    return compatibilityMap[requestedBloodGroup] || [];
  };

  const getAvailableUnits = async (bloodBankName, bloodType) => {
    try {
      const res = await axios.get(
        `${baseUrl}/bloodbankapi/availableunits/${encodeURIComponent(
          bloodBankName
        )}/${encodeURIComponent(bloodType)}`
      );
      return Number(res.data) || 0;
    } catch (err) {
      console.error("Error fetching available units:", err);
      return 0;
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/bloodbankapi/viewallrequests`);
      const allRequests = Array.isArray(res.data) ? res.data : [];

      const filtered = allRequests.filter(
        (req) =>
          req.status &&
          ["PENDING", "PARTIALLY_ACCEPTED"].includes(
            req.status.toString().toUpperCase()
          )
      );

      setRequests(filtered);

      const unitMap = {};
      const bloodTypeMap = {};
      const stockMap = {};

      for (const req of filtered) {
        const compatibleTypes = getCompatibleDonorTypes(req.bloodGroup);
        const defaultBloodType =
          compatibleTypes.length > 0 ? compatibleTypes[0] : "";

        bloodTypeMap[req.id] = defaultBloodType;

        if (defaultBloodType) {
          const available = await getAvailableUnits(
            bloodUser.name,
            defaultBloodType
          );
          stockMap[req.id] = available;
          unitMap[req.id] = 0;
        } else {
          stockMap[req.id] = 0;
          unitMap[req.id] = 0;
        }
      }

      setSelectedUnitsMap(unitMap);
      setSelectedBloodTypeMap(bloodTypeMap);
      setAvailableStockMap(stockMap);

      const accepted = allRequests.filter(
        (req) => req.status && req.status.toString().toUpperCase() === "ACCEPTED"
      );
      setAcceptedRequests(accepted);
    } catch (err) {
      console.error("Failed to fetch blood requests:", err);
      toast.error("Failed to load blood requests");
      setRequests([]);
      setAcceptedRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBloodTypeChange = async (reqId, bloodType) => {
    setSelectedBloodTypeMap((prev) => ({
      ...prev,
      [reqId]: bloodType,
    }));

    const available = await getAvailableUnits(bloodUser.name, bloodType);

    setAvailableStockMap((prev) => ({
      ...prev,
      [reqId]: available,
    }));

    setSelectedUnitsMap((prev) => ({
      ...prev,
      [reqId]: 0,
    }));
  };

  const handleAccept = async (id) => {
    const units = selectedUnitsMap[id];
    const bloodtype = selectedBloodTypeMap[id];
    const available = availableStockMap[id] || 0;

    if (units === null || units === undefined || units < 1) {
      toast.error("Please select units greater than 0.");
      return;
    }

    if (!bloodtype) {
      toast.error("Please select blood type.");
      return;
    }

    if (units > available) {
      toast.error("Selected units exceed available stock.");
      return;
    }

    try {
      const payload = {
        givenUnits: units,
        bloodBank: bloodUser?.name,
        bloodtype: bloodtype,
        request: { id },
      };

      const res = await axios.put(
        `${baseUrl}/bloodbankapi/updatebloodstatus`,
        payload
      );

      toast.success(res.data || "Request updated successfully.");
      await fetchRequests();
    } catch (err) {
      console.error("Error updating request:", err);
      if (err.response?.status === 400) {
        toast.error("Insufficient units available.");
      } else if (err.response?.status === 404) {
        toast.error("Data not found for this blood type or request.");
      } else {
        toast.error("Failed to update request.");
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const buildUnitOptions = (remaining, available) => {
    const maxUnits = Math.min(5, Number(remaining) || 0, Number(available) || 0);
    return Array.from({ length: maxUnits + 1 }, (_, i) => i);
  };

  const textFieldStyles = (fieldName) => ({
    mb: 1.5,
    "& .MuiInputBase-root": {
      height: "3rem",
      fontSize: "1rem",
      background: "rgba(255,255,255,0.96)",
    },
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
    "& .MuiOutlinedInput-root.Mui-focused": {
      boxShadow: `0 0 14px ${RED_ACCENT}45`,
      borderRadius: "10px",
    },
    boxShadow: focusField === fieldName ? `0 0 10px ${RED_ACCENT}72` : "",
    transition: "box-shadow 0.2s",
  });

  const infoRow = (icon, label, value, color = "#333") => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mb: 1,
        color,
      }}
    >
      {icon}
      <Typography variant="body2">
        <strong>{label}:</strong> {value}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ width: "100%", px: 2, py: 4 }}>
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
        Pending / Partially Accepted Blood Requests
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress sx={{ color: "#fff" }} />
        </Box>
      ) : requests.length === 0 ? (
        <Typography align="center" sx={{ color: "#fff", fontWeight: 500 }}>
          No pending requests found.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              xl: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {requests.map((req) => {
            const remaining = Number(req.unitsNeeded) || 0;
            const contribCount = req.bloodbanks?.length || 0;
            const compatibleTypes = getCompatibleDonorTypes(req.bloodGroup);
            const selectedBloodType = selectedBloodTypeMap[req.id] || "";
            const available = availableStockMap[req.id] || 0;
            const unitOptions = buildUnitOptions(remaining, available);
            const selectedValue = selectedUnitsMap[req.id] ?? 0;

            return (
              <Card
                key={req.id}
                sx={{
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.94)",
                  boxShadow: "0 14px 32px rgba(120,0,0,0.15)",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: 8,
                    background: `linear-gradient(90deg, ${RED_PRIMARY}, ${RED_SECONDARY})`,
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                    gap={2}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocalHospital sx={{ color: RED_ACCENT }} />
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: RED_PRIMARY }}>
                        {req.hospitalUsername}
                      </Typography>
                    </Box>

                    <Chip
                      label={
                        contribCount > 0
                          ? `${contribCount} Contribution${contribCount > 1 ? "s" : ""}`
                          : "No contributions"
                      }
                      sx={{
                        fontWeight: "bold",
                        background: contribCount > 0 ? "#e8f5e9" : "#f5f5f5",
                        color: contribCount > 0 ? "#2e7d32" : "#666",
                      }}
                    />
                  </Box>

                  {infoRow(
                    <Bloodtype sx={{ color: RED_ACCENT, fontSize: 20 }} />,
                    "Blood Group Needed",
                    req.bloodGroup
                  )}
                  {infoRow(
                    <Inventory2 sx={{ color: RED_ACCENT, fontSize: 20 }} />,
                    "Units Needed",
                    remaining
                  )}
                  {infoRow(
                    <Favorite sx={{ color: RED_ACCENT, fontSize: 20 }} />,
                    `Available in Blood Bank (${selectedBloodType || "—"})`,
                    available
                  )}
                  {infoRow(
                    <WarningAmber sx={{ color: "#ef6c00", fontSize: 20 }} />,
                    "Urgency",
                    req.urgency,
                    "#ef6c00"
                  )}
                  {infoRow(
                    <CalendarMonth sx={{ color: RED_ACCENT, fontSize: 20 }} />,
                    "Date",
                    req.date
                  )}
                  {infoRow(
                    <Person sx={{ color: RED_ACCENT, fontSize: 20 }} />,
                    "Patient",
                    `${req.patientName} (${req.patientAge} yrs)`
                  )}

                  {remaining > 0 ? (
                    <>
                      <TextField
                        select
                        label="Donated Blood Type"
                        size="small"
                        value={selectedBloodType}
                        onChange={(e) =>
                          handleBloodTypeChange(req.id, e.target.value, remaining)
                        }
                        onFocus={() => setFocusField(`blood-${req.id}`)}
                        onBlur={() => setFocusField("")}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Bloodtype color="error" />
                            </InputAdornment>
                          ),
                        }}
                        sx={textFieldStyles(`blood-${req.id}`)}
                      >
                        {compatibleTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        select
                        label="Units to Contribute"
                        size="small"
                        value={selectedValue}
                        onChange={(e) =>
                          setSelectedUnitsMap((prev) => ({
                            ...prev,
                            [req.id]: parseInt(e.target.value, 10),
                          }))
                        }
                        onFocus={() => setFocusField(`units-${req.id}`)}
                        onBlur={() => setFocusField("")}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Inventory2 color="error" />
                            </InputAdornment>
                          ),
                        }}
                        sx={textFieldStyles(`units-${req.id}`)}
                      >
                        {unitOptions.map((num) => (
                          <MenuItem key={num} value={num}>
                            {num}
                          </MenuItem>
                        ))}
                      </TextField>
                    </>
                  ) : (
                    <Box mt={2}>
                      <Typography variant="body2" color="text.secondary">
                        No units needed right now.
                      </Typography>
                    </Box>
                  )}

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1.5}
                  >
                    <Typography sx={{ fontWeight: "bold", color: "#2e7d32" }}>
                      Contributions
                    </Typography>
                    <IconButton onClick={() => toggleExpand(req.id)}>
                      {expandedMap[req.id] ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>

                  <Collapse in={expandedMap[req.id]} timeout="auto" unmountOnExit>
                    <Box
                      mt={1}
                      sx={{
                        p: 2,
                        borderRadius: "12px",
                        background: "#fff8f8",
                        border: "1px solid rgba(183,28,28,0.08)",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold", color: RED_PRIMARY, mb: 1 }}
                      >
                        Contribution Details
                      </Typography>

                      {req.bloodbanks && req.bloodbanks.length > 0 ? (
                        req.bloodbanks.map((b) => (
                          <Typography
                            key={b.id}
                            variant="body2"
                            sx={{ mb: 0.7, color: "#2e7d32", fontWeight: 500 }}
                          >
                            • {b.bloodBank} - {b.givenUnits} units - Blood Type:{" "}
                            {b.bloodtype || "N/A"}
                          </Typography>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No contributions yet.
                        </Typography>
                      )}
                    </Box>
                  </Collapse>

                  <Box mt={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={remaining <= 0 || available <= 0}
                      onClick={() => handleAccept(req.id)}
                      startIcon={<CheckCircle />}
                      sx={{
                        py: 1.2,
                        fontWeight: "bold",
                        fontSize: "0.95rem",
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
                      Contribute
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      <Typography
        variant="h4"
        align="center"
        sx={{
          mt: 6,
          mb: 3,
          fontWeight: "bold",
          color: "#fff",
          textShadow: "0 2px 10px rgba(0,0,0,0.20)",
        }}
      >
        Accepted Blood Requests
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress sx={{ color: "#fff" }} />
        </Box>
      ) : acceptedRequests.length === 0 ? (
        <Typography align="center" sx={{ color: "#fff", mb: 4 }}>
          No accepted requests found.
        </Typography>
      ) : (
        <Table
          sx={{
            background: "rgba(255,255,255,0.14)",
            backdropFilter: "blur(6px)",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                background: `linear-gradient(90deg, ${RED_PRIMARY}, ${RED_SECONDARY})`,
              }}
            >
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Hospital</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Patient</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Blood Group Needed</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Accepted Units</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Contributed By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {acceptedRequests.map((req) => (
              <TableRow
                key={req.id}
                sx={{
                  background: "rgba(255,255,255,0.08)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.18)",
                  },
                }}
              >
                <TableCell sx={{ color: "#fff" }}>{req.hospitalUsername}</TableCell>
                <TableCell sx={{ color: "#fff" }}>
                  {`${req.patientName} (${req.patientAge} yrs)`}
                </TableCell>
                <TableCell sx={{ color: "#fff" }}>{req.bloodGroup}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{req.acceptedUnits}</TableCell>
                <TableCell sx={{ color: "#fff" }}>
                  {req.bloodbanks && req.bloodbanks.length > 0
                    ? req.bloodbanks
                        .map((b) => `${b.bloodBank} (${b.givenUnits} units)`)
                        .join(", ")
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        toastStyle={{ marginTop: "90px" }}
        style={{ zIndex: 2000 }}
      />
    </Box>
  );
}