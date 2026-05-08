import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Bloodtype, LocalHospital, Favorite, Warning } from '@mui/icons-material';

const BASE_URL = `${import.meta.env.VITE_API_URL}/hospitalapi`;
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

// === Floating bubbles ===
const FloatingBubbles = ({ count = 25 }) => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 25 + 15,
      duration: Math.random() * 20 + 10,
      icon: [<Bloodtype key="b" />, <LocalHospital key="h" />, <Favorite key="f" />, <Warning key="w" />][Math.floor(Math.random() * 4)],
      color: ['#3498db', '#2e86de', '#1abc9c', '#e74c3c'][Math.floor(Math.random() * 4)],
    }));
    setBubbles(newBubbles);
  }, [count]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          animate={{
            y: [-10, -180, -10],
            x: [-10, 10, -10],
            rotate: [0, 360, 0],
            opacity: [0.7, 0.2, 0.7],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            fontSize: bubble.size,
            color: bubble.color,
          }}
        >
          {bubble.icon}
        </motion.div>
      ))}
    </Box>
  );
};

export default function BloodAvailability() {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAvailability = async (group) => {
    try {
      const res = await axios.get(`${BASE_URL}/blood-availability/${group}`);
      setInventory(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setInventory([]);
    }
  };

  const handleChange = (e) => {
    const group = e.target.value;
    setSelectedGroup(group);
    setSearchTerm('');
    if (group) fetchAvailability(group);
    else setInventory([]);
  };

  const filteredInventory = Array.isArray(inventory)
    ? inventory.filter((item) =>
        item.org.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #3498db 0%, #e0f7fa 100%)',
        py: 6,
      }}
    >
      <FloatingBubbles count={25} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h4"
            align="center"
            color="white"
            fontWeight="bold"
            gutterBottom
            sx={{ textShadow: '2px 2px 6px rgba(0,0,0,0.3)' }}
          >
            Blood Availability by Blood Group
          </Typography>
        </motion.div>

        <Box
          my={4}
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
            <InputLabel sx={{ color: 'white' }}>Select Blood Group</InputLabel>
            <Select
              value={selectedGroup}
              onChange={handleChange}
              label="Select Blood Group"
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            >
              {BLOOD_GROUPS.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedGroup && inventory.length > 0 && (
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by Blood Bank Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 3, backgroundColor: 'white', borderRadius: 1 }}
            />
          )}

          {selectedGroup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {filteredInventory.length > 0 ? (
                <TableContainer
                  component={Paper}
                  sx={{ boxShadow: 3, borderRadius: 2 }}
                >
                  <Table>
                    <TableHead sx={{ backgroundColor: '#2e86de' }}>
                      <TableRow>
                        <TableCell sx={{ color: 'white' }}>
                          <b>Blood Bank (Org)</b>
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          <b>Blood Group</b>
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          <b>Available Units</b>
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          <b>Used Units</b>
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          <b>Donated Units</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredInventory.map((item) => (
                        <TableRow
                          key={item.id}
                          component={motion.tr}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <TableCell>{item.org}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.aunits}</TableCell>
                          <TableCell>{item.usedunits}</TableCell>
                          <TableCell>{item.donatedunits}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography
                  variant="h6"
                  align="center"
                  sx={{
                    color: 'white',
                    mt: 4,
                    textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  No blood banks found matching "{searchTerm}"
                </Typography>
              )}
            </motion.div>
          )}
        </Box>
      </Container>
    </Box>
  );
}
