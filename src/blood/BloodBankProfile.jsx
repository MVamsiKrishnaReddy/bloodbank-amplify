import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  TextField,
  Divider,
  InputAdornment,
} from "@mui/material";
import {
  Business,
  Person,
  Email,
  Phone,
  LocationOn,
  Badge,
  Edit,
  Save,
  Cancel,
  Delete,
  Dashboard,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contextapi/AuthContext";

const RED_PRIMARY = "#b71c1c";
const RED_SECONDARY = "#e53935";
const RED_LIGHT = "#ffebee";

export default function BloodProfile() {
  const navigate = useNavigate();
  const { setIsBloodBankLoggedIn } = useAuth();

  const [profile, setProfile] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    phone: "",
    location: "",
  });

  const [editData, setEditData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    location: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("Blood_user"));

    if (!userData) {
      navigate("/bloodlogin");
    } else {
      const mappedProfile = {
        id: userData.id || "",
        name: userData.name || "",
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        location:
          userData.location ||
          [userData.city, userData.state].filter(Boolean).join(", "),
      };

      setProfile(mappedProfile);
      setEditData({
        name: mappedProfile.name,
        username: mappedProfile.username,
        email: mappedProfile.email,
        phone: mappedProfile.phone,
        location: mappedProfile.location,
      });
    }
  }, [navigate]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditData({
      name: profile.name,
      username: profile.username,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
    });
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // frontend state update
      const updatedProfile = {
        ...profile,
        ...editData,
      };

      setProfile(updatedProfile);

      const existingUser = JSON.parse(sessionStorage.getItem("Blood_user")) || {};
      const updatedSessionUser = {
        ...existingUser,
        name: editData.name,
        username: editData.username,
        email: editData.email,
        phone: editData.phone,
        location: editData.location,
      };

      sessionStorage.setItem("Blood_user", JSON.stringify(updatedSessionUser));

      /*
        OPTIONAL BACKEND API CALL:
        Replace this with your actual backend update API if available.

        await axios.put(`${baseUrl}/bloodbankapi/update/${profile.id}`, {
          ...existingUser,
          name: editData.name,
          username: editData.username,
          email: editData.email,
          phone: editData.phone,
          location: editData.location,
        });
      */

      alert("Profile updated successfully.");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this Blood Bank?")) {
      try {
        await axios.put(`${baseUrl}/bloodbankapi/updatestatus/${profile.id}`);
        alert("Profile deleted.");

        sessionStorage.removeItem("Blood_user");
        sessionStorage.setItem("isBloodBankLoggedIn", "false");
        setIsBloodBankLoggedIn(false);

        navigate("/");
      } catch (err) {
        console.error(err);
        alert("Failed to delete profile.");
      }
    }
  };

  const infoCardStyle = {
    p: 1.5,
    borderRadius: "14px",
    background: "rgba(255,255,255,0.65)",
    border: "1px solid rgba(183,28,28,0.08)",
    display: "flex",
    alignItems: "center",
    gap: 1.5,
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      "& fieldset": {
        borderColor: "#ef9a9a",
      },
      "&:hover fieldset": {
        borderColor: RED_PRIMARY,
      },
      "&.Mui-focused fieldset": {
        borderColor: RED_PRIMARY,
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: RED_PRIMARY,
    },
  };

  return (
    <Box
      sx={{
        minHeight: "75vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent",
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 650,
          width: "100%",
          borderRadius: "24px",
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 14px 35px rgba(120,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.3)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(90deg, ${RED_PRIMARY}, ${RED_SECONDARY})`,
            py: 4,
            px: 3,
            textAlign: "center",
            color: "#fff",
          }}
        >
          <Avatar
            sx={{
              width: 72,
              height: 72,
              mx: "auto",
              mb: 2,
              bgcolor: "#fff",
              color: RED_PRIMARY,
              boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
            }}
          >
            <Business sx={{ fontSize: 36 }} />
          </Avatar>

          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Blood Bank Profile
          </Typography>

          <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
            Manage your organization details
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {!isEditing ? (
            <>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box sx={infoCardStyle}>
                  <Badge sx={{ color: RED_PRIMARY }} />
                  <Typography>
                    <strong>ID:</strong> {profile.id}
                  </Typography>
                </Box>

                <Box sx={infoCardStyle}>
                  <Business sx={{ color: RED_PRIMARY }} />
                  <Typography>
                    <strong>Name:</strong> {profile.name}
                  </Typography>
                </Box>

                <Box sx={infoCardStyle}>
                  <Person sx={{ color: RED_PRIMARY }} />
                  <Typography>
                    <strong>Username:</strong> {profile.username}
                  </Typography>
                </Box>

                <Box sx={infoCardStyle}>
                  <Email sx={{ color: RED_PRIMARY }} />
                  <Typography>
                    <strong>Email:</strong> {profile.email}
                  </Typography>
                </Box>

                <Box sx={infoCardStyle}>
                  <Phone sx={{ color: RED_PRIMARY }} />
                  <Typography>
                    <strong>Phone:</strong> {profile.phone}
                  </Typography>
                </Box>

                <Box sx={infoCardStyle}>
                  <LocationOn sx={{ color: RED_PRIMARY }} />
                  <Typography>
                    <strong>Location:</strong> {profile.location || "Not available"}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box
                mt={2}
                display="flex"
                justifyContent="center"
                gap={2}
                flexWrap="wrap"
              >
                <Button
                  variant="contained"
                  startIcon={<Dashboard />}
                  onClick={() => navigate("/bloodbankdashboard")}
                  sx={{
                    background: "#1976d2",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    px: 2.5,
                  }}
                >
                  Dashboard
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleStartEdit}
                  sx={{
                    background: "#f57c00",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    px: 2.5,
                    "&:hover": {
                      background: "#ef6c00",
                    },
                  }}
                >
                  Edit Profile
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Delete />}
                  onClick={handleDelete}
                  sx={{
                    background: "#d32f2f",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    px: 2.5,
                  }}
                >
                  Delete
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box display="flex" flexDirection="column" gap={2.2}>
                <TextField
                  label="Blood Bank Name"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  fullWidth
                  sx={textFieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business sx={{ color: RED_PRIMARY }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Username"
                  name="username"
                  value={editData.username}
                  onChange={handleEditChange}
                  fullWidth
                  sx={textFieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: RED_PRIMARY }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  fullWidth
                  sx={textFieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: RED_PRIMARY }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Phone"
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                  fullWidth
                  sx={textFieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: RED_PRIMARY }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Location"
                  name="location"
                  value={editData.location}
                  onChange={handleEditChange}
                  fullWidth
                  sx={textFieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: RED_PRIMARY }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box
                mt={2}
                display="flex"
                justifyContent="center"
                gap={2}
                flexWrap="wrap"
              >
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleUpdate}
                  disabled={loading}
                  sx={{
                    background: "#2e7d32",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    px: 2.5,
                    "&:hover": {
                      background: "#1b5e20",
                    },
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancelEdit}
                  sx={{
                    color: RED_PRIMARY,
                    borderColor: RED_PRIMARY,
                    fontWeight: "bold",
                    borderRadius: "10px",
                    px: 2.5,
                    "&:hover": {
                      borderColor: RED_PRIMARY,
                      background: RED_LIGHT,
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}