import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Box,
  Container
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

export default function HospitalOrganRequest() {
  const [hospital, setHospital] = useState('');
  const [organ, setOrgan] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [urgency, setUrgency] = useState('');
  const [date, setDate] = useState('');
  const [submittedRequests, setSubmittedRequests] = useState([]);

  useEffect(() => {
    const nameFromStorage = sessionStorage.getItem('hospitalName') || 'Unknown Hospital';
    setHospital(nameFromStorage);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!organ || !bloodType || !urgency || !date) {
      toast.error('Please fill all fields');
      return;
    }

    const payload = {
      hospital,
      organ,
      bloodtype: bloodType,
      urgency,
      status: 'Pending',
      date
    };

    try {
      await axios.post(`${BASE_URL}/addorganrequest`, payload);
      toast.success('Organ Request Submitted Successfully');
      setOrgan('');
      setBloodType('');
      setUrgency('');
      setDate('');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request');
    }
  };

  return (
    <Container maxWidth="sm" className="mt-5 mb-5">
      <Typography variant="h4" className="text-center mb-4 text-primary">
        Submit Organ Request
      </Typography>

      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        <Box mb={3}>
          <TextField
            label="Hospital Name"
            fullWidth
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            variant="outlined"
          />
        </Box>

        <Box mb={3}>
          <TextField
            select
            label="Organ Needed"
            fullWidth
            value={organ}
            onChange={(e) => setOrgan(e.target.value)}
          >
            {['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas'].map(organ => (
              <MenuItem key={organ} value={organ}>{organ}</MenuItem>
            ))}
          </TextField>
        </Box>

        <Box mb={3}>
          <TextField
            select
            label="Required Blood Type"
            fullWidth
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
          >
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>
        </Box>

        <Box mb={3}>
          <TextField
            select
            label="Urgency Level"
            fullWidth
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
          >
            {['Low', 'Medium', 'High', 'Critical'].map(level => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </TextField>
        </Box>

        <Box mb={4}>
          <TextField
            label="Required Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Box>

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Submit Request
        </Button>
      </form>

      {submittedRequests.length > 0 && (
        <>
          <Typography variant="h5" className="mt-5 mb-3 text-center text-success">
            Submitted Organ Requests
          </Typography>

          <div className="row">
            {submittedRequests.map(req => (
              <div className="col-md-6 col-lg-4 mb-4" key={req.id}>
                <Card className="shadow-sm h-100">
                  <CardContent>
                    <Typography variant="h6" className="text-primary mb-2">
                      {req.hospital}
                    </Typography>
                    <Typography>Organ: <strong>{req.organ}</strong></Typography>
                    <Typography>Blood Type: <strong>{req.bloodtype}</strong></Typography>
                    <Typography>Urgency: <strong>{req.urgency}</strong></Typography>
                    <Typography>Date Needed: {req.date}</Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </Container>
  );
}
