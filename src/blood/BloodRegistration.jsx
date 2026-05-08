import React, { useState } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Person,
  Badge,
  Wc,
  Bloodtype,
  Business,
  Phone,
  LocationOn,
  CreditCard,
  MonitorWeight,
  Height,
} from '@mui/icons-material';

const RED_PRIMARY = "#b71c1c";
const RED_SECONDARY = "#e53935";
const RED_ACCENT = "#c62828";

export default function BloodRegistration() {
  const storedUser = JSON.parse(sessionStorage.getItem('Blood_user'));
  const orgFromSession = storedUser?.name || '';
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    fullName: '',
    addhar: '',
    age: '',
    gender: '',
    bloodType: '',
    phoneno: '',
    org: orgFromSession,
    state: '',
    city: '',
    weight: '',
    height: '',
  });

  const [focusField, setFocusField] = useState('');
  const [eligible, setEligible] = useState(true);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const genders = ['Male', 'Female', 'Other'];

  const textFieldStyles = (fieldName) => ({
    mb: 2,
    "& .MuiInputBase-root": {
      height: "3rem",
      fontSize: "1rem",
      backgroundColor: "#fff",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "& fieldset": { borderColor: "#ef9a9a" },
      "&:hover fieldset": { borderColor: RED_ACCENT },
      "&.Mui-focused fieldset": { borderColor: RED_ACCENT },
    },
    "& .MuiOutlinedInput-root.Mui-focused": {
      boxShadow: `0 0 14px ${RED_ACCENT}45`,
    },
    boxShadow: focusField === fieldName ? `0 0 10px ${RED_ACCENT}72` : "",
  });

  // 🔥 Aadhaar Check API
  const checkDonor = async (aadhaar) => {
    try {
      const res = await axios.get(`${baseUrl}/bloodbankapi/donor/${aadhaar}`);

      if (res.data) {
        const donor = res.data.donor;
        const days = res.data.daysSinceLastDonation;

        setForm((prev) => ({
          ...prev,
          fullName: donor.fullName,
          gender: donor.gender,
          age: donor.age,
          bloodType: donor.bloodType,
          weight: donor.weight,
          height: donor.height,
          phoneno: donor.phoneno,
          state: donor.state,
          city: donor.city,
        }));

        // eligibility check
        if (donor.gender === "Female" && days < 120) {
          setEligible(false);
          toast.error(`Time Remaining for to donate ${120 - days} days`);
        } else if (days < 90) {
          setEligible(false);
          toast.error(`Time Remaining for to donate ${90 - days}  days`);
        } else {
          setEligible(true);
          toast.success("Eligible for donation");
        }
      }
    } catch (err) {
      setEligible(true); // new donor
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "addhar") {
      const val = value.replace(/\D/g, '').slice(0, 12);
      setForm((prev) => ({ ...prev, addhar: val }));

      if (val.length === 12) {
        checkDonor(val);
      }
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eligible) {
      toast.error("Donor not eligible yet");
      return;
    }

    try {
      await axios.post(`${baseUrl}/bloodbankapi/registerblooddonor`, form);

      toast.success("Donation recorded successfully");

      setTimeout(() => {
        navigate('/bloodbankdashboard');
      }, 1000);
    } catch (err) {
      toast.error(err?.response?.data || "Error saving donor");
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Card sx={{ width: 600, p: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" sx={{ mb: 3 }}>
            Blood Donation
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Aadhaar"
              name="addhar"
              fullWidth
              value={form.addhar}
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start"><CreditCard /></InputAdornment>
              }}
              sx={textFieldStyles("addhar")}
            />

            <TextField label="Name" name="fullName" fullWidth value={form.fullName} onChange={handleChange} sx={textFieldStyles("fullName")} />

            <TextField label="Age" name="age" type="number" fullWidth value={form.age} onChange={handleChange} sx={textFieldStyles("age")} />

            <TextField select label="Gender" name="gender" fullWidth value={form.gender} onChange={handleChange} sx={textFieldStyles("gender")}>
              {genders.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
            </TextField>

            <TextField select label="Blood Type" name="bloodType" fullWidth value={form.bloodType} onChange={handleChange} sx={textFieldStyles("bloodType")}>
              {bloodGroups.map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
            </TextField>

            <TextField label="Weight" name="weight" type="number" fullWidth value={form.weight} onChange={handleChange} sx={textFieldStyles("weight")} />

            <TextField label="Height" name="height" type="number" fullWidth value={form.height} onChange={handleChange} sx={textFieldStyles("height")} />

            <TextField label="Phone" name="phoneno" fullWidth value={form.phoneno} onChange={handleChange} sx={textFieldStyles("phoneno")} />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!eligible}
              sx={{
                mt: 2,
                background: RED_PRIMARY,
                "&:hover": { background: RED_SECONDARY }
              }}
            >
              Submit Donation
            </Button>
          </form>

         <ToastContainer
  position="top-center"
  autoClose={10000}
  toastStyle={{ marginTop: "80px" }}   // 👈 push below navbar
  style={{ zIndex: 9999 }}             // 👈 ensure it's above navbar
/>
        </CardContent>
      </Card>
    </Box>
  );
}