import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/hospitalapi`;

export default function BloodRequestStatus() {
  const hospitalUserJson = sessionStorage.getItem("Hospital_user");
  const hospitalUsername = hospitalUserJson
    ? JSON.parse(hospitalUserJson).username
    : null;

  const [loading, setLoading] = useState(true);
  const [activeRequests, setActiveRequests] = useState([]);
  const [closedRequests, setClosedRequests] = useState([]);
  const [expandedMap, setExpandedMap] = useState({});

  useEffect(() => {
    if (hospitalUsername) fetchRequests();
    else {
      toast.error("Hospital user not found in session storage");
      setLoading(false);
    }
  }, [hospitalUsername]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const resAll = await axios.get(
        `${BASE_URL}/blood-requests/hospital/${hospitalUsername}`
      );
      const allRequests = Array.isArray(resAll.data) ? resAll.data : [];

      const active = allRequests.filter(
        (req) =>
          req.status &&
          ["PENDING", "REQUIRES ACTION", "PARTIALLY_ACCEPTED"].includes(
            req.status.toString().toUpperCase()
          )
      );
      const closed = allRequests.filter(
        (req) =>
          req.status &&
          ["ACCEPTED", "REJECTED", "FULFILLED"].includes(
            req.status.toString().toUpperCase()
          )
      );

      const urgencyOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      const sortByUrgencyAndDate = (list) =>
        list.sort(
          (a, b) =>
            urgencyOrder[b.urgency] - urgencyOrder[a.urgency] ||
            new Date(b.date) - new Date(a.date)
        );

      setActiveRequests(sortByUrgencyAndDate(active));
      setClosedRequests(sortByUrgencyAndDate(closed));
    } catch (err) {
      console.error("Error fetching hospital requests:", err);
      toast.error("Failed to fetch hospital requests");
      setActiveRequests([]);
      setClosedRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await axios.delete(`${BASE_URL}/blood-requests/${id}`);
      toast.success("Request deleted successfully");
      fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete request");
    }
  };

  const toggleExpand = (id) => {
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="container mt-5 mb-5">
      <Typography variant="h4" className="text-center mb-4">
        Active Blood Requests
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : activeRequests.length === 0 ? (
        <Typography className="text-center">No active requests found.</Typography>
      ) : (
        <div className="row">
          {activeRequests.map((req) => {
            const contribCount = req.bloodbanks?.length || 0;
            return (
              <div className="col-md-6 col-lg-4 mb-4" key={req.id}>
                <Card className="shadow h-100">
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h6" className="text-primary">
                        {req.patientName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          cursor: "pointer",
                          color: "green",
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                        onClick={() => toggleExpand(req.id)}
                      >
                        {contribCount > 0
                          ? `${contribCount} Contribution${
                              contribCount > 1 ? "s" : ""
                            }`
                          : "No contributions"}
                      </Typography>
                    </Box>

                    <Typography sx={{ mt: 1 }}>
                      Blood Group: <strong>{req.bloodGroup}</strong>
                    </Typography>
                    <Typography>
                      Units Needed: <strong>{req.unitsNeeded}</strong>
                    </Typography>
                    <Typography>
                      Urgency: <strong>{req.urgency}</strong>
                    </Typography>
                    <Typography>
                      Date: <strong>{req.date}</strong>
                    </Typography>
                    <Typography>
                      Status:{" "}
                      <strong
                        style={{
                          color:
                            req.status === "ACCEPTED"
                              ? "green"
                              : req.status === "REJECTED"
                              ? "red"
                              : "orange",
                        }}
                      >
                        {req.status}
                      </strong>
                    </Typography>

                    {/* Expand/Collapse Section */}
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      alignItems="center"
                      mt={1}
                    >
                      <Typography
                        sx={{
                          mr: 1,
                          fontWeight: "bold",
                          color: "green",
                        }}
                      >
                        Contributions
                      </Typography>
                      <IconButton onClick={() => toggleExpand(req.id)}>
                        {expandedMap[req.id] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>

                    <Collapse in={expandedMap[req.id]} timeout="auto" unmountOnExit>
                      <Box mt={1}>
                        {req.bloodbanks && req.bloodbanks.length > 0 ? (
                          req.bloodbanks.map((b) => (
                            <Typography
                              key={b.id}
                              variant="body2"
                              sx={{
                                cursor: "pointer",
                                color: "green",
                                fontWeight: "bold",
                                fontSize: "16px",
                              }}
                            >
                              • {b.bloodBank} — {b.givenUnits} units
                            </Typography>
                          ))
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No contributions yet.
                          </Typography>
                        )}
                      </Box>
                    </Collapse>

                    <Box mt={2}>
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() => handleDelete(req.id)}
                      >
                        Delete Request
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Closed Requests */}
      <Typography variant="h4" className="text-center my-4">
        Closed / Completed Requests
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : closedRequests.length === 0 ? (
        <Typography className="text-center mb-4">
          No closed requests found.
        </Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Blood Group</TableCell>
              <TableCell>Units Needed</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Contributions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {closedRequests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.patientName}</TableCell>
                <TableCell>{req.bloodGroup}</TableCell>
                <TableCell>{req.unitsNeeded}</TableCell>
                <TableCell>{req.status}</TableCell>
                <TableCell>
                  {req.bloodbanks && req.bloodbanks.length > 0
                    ? req.bloodbanks
                        .map((b) => `${b.bloodBank} (${b.givenUnits})`)
                        .join(", ")
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
