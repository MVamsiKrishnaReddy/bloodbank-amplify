import React, { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  IconButton,
  InputAdornment,
  Card
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const BASE_URL = `${import.meta.env.VITE_API_URL}/hospitalapi`

const stateCityData = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kurnool", "Rajahmundry"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Mahbubnagar"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Vellore"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangalore", "Hubballi", "Belagavi"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Delhi": ["New Delhi", "Dwarka", "Rohini", "Saket", "Karol Bagh"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior"],
  "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Kota"],
  "Punjab": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Karnal"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Korba"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Rishikesh", "Haldwani"],
  "Himachal Pradesh": ["Shimla", "Mandi", "Dharamshala", "Solan"],
  "Tripura": ["Agartala"],
  "Meghalaya": ["Shillong"],
  "Nagaland": ["Kohima", "Dimapur"],
  "Manipur": ["Imphal"],
  "Sikkim": ["Gangtok"]
}

const FloatingParticles = ({ count = 35 }) => {
  const [particles, setParticles] = useState([])
  useEffect(() => {
    const icons = ['\u2764', '\u2B24', '\u1F9E1']
    const colors = ['#3498db', '#2e86de', '#e74c3c', '#ff6b6b', '#1abc9c']
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 18 + 10,
      duration: Math.random() * 12 + 8,
      icon: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setParticles(newParticles)
  }, [count])
  return (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0
    }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          animate={{
            y: [-10, -150, -10],
            x: [-5, 5, -5],
            rotate: [0, 360, 0],
            opacity: [0.7, 0.2, 0.7]
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: p.size,
            color: p.color
          }}
        >
          {p.icon}
        </motion.div>
      ))}
    </Box>
  )
}

export default function HospitalUpdateForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({})
  const [editable, setEditable] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const states = Object.keys(stateCityData)

  useEffect(() => {
    const data = sessionStorage.getItem('Hospital_user')
    if (!data) {
      toast.error('No hospital data found! Please log in.')
      navigate('/hospital-login')
      return
    }
    setForm(JSON.parse(data))
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => name === 'state' ? { ...prev, state: value, city: '' } : { ...prev, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put(`${BASE_URL}/hospitals/${form.id}`, form)
      toast.success('Hospital updated successfully!')
      sessionStorage.setItem('Hospital_user', JSON.stringify(res.data || form))
      setEditable(false)
    } catch (err) {
      console.error(err)
      toast.error('Update failed. Try again.')
    }
  }

  const handleCancel = () => {
    const data = JSON.parse(sessionStorage.getItem('Hospital_user'))
    setForm(data)
    setEditable(false)
  }
  return (
    <Box sx={{
      position: 'relative',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3498db 0%, #e0f7fa 100%)',
      py: 6,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <FloatingParticles count={30} />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
        style={{ zIndex: 1, width: '100%', maxWidth: 650, padding: '0 1rem' }}
      >
        <Card
          sx={{
            backdropFilter: 'blur(12px)',
            backgroundColor: editable ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
            borderRadius: 3,
            boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
            p: 4
          }}
        >
          <Typography variant="h5" align="center" fontWeight="bold" sx={{ mb: 4, color: '#2e86de', textShadow: '0px 1px 4px rgba(0,0,0,0.2)' }}>
            {editable ? "Update Hospital Information" : "Hospital Information"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField label="Hospital ID" name="id" value={form.id || ''} disabled />
              <TextField label="Username" name="username" value={form.username || ''} disabled />
              <TextField label="Hospital Name" name="name" value={form.name || ''} disabled />
              <TextField label="Owner Name" name="ownerName" value={form.ownerName || ''} onChange={handleChange} disabled={!editable} required />
              <TextField select label="State" name="state" value={form.state || ''} onChange={handleChange} disabled={!editable} required>
                {states.map((s, idx) => <MenuItem key={idx} value={s}>{s}</MenuItem>)}
              </TextField>
              <TextField select label="City" name="city" value={form.city || ''} onChange={handleChange} disabled={!editable || !form.state} required>
                {form.state ? stateCityData[form.state].map((c, idx) => <MenuItem key={idx} value={c}>{c}</MenuItem>) : <MenuItem value="">Select State First</MenuItem>}
              </TextField>
              <TextField label="Address" name="address" value={form.address || ''} onChange={handleChange} multiline rows={3} disabled={!editable} required />
              <TextField label="Contact" name="contact" value={form.contact || ''} onChange={handleChange} disabled={!editable} required />
              <TextField label="Email" name="email" type="email" value={form.email || ''} onChange={handleChange} disabled={!editable} required />
              <TextField label="License No" name="licenseNo" value={form.licenseNo || ''} disabled />
              <TextField select label="Hospital Type" name="type" value={form.type || ''} onChange={handleChange} disabled={!editable} required>
                <MenuItem value="">Select Type</MenuItem>
                <MenuItem value="NGO">NGO</MenuItem>
                <MenuItem value="Private">Private</MenuItem>
                <MenuItem value="Government">Government</MenuItem>
              </TextField>
              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password || ''}
                onChange={handleChange}
                disabled={!editable}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              {editable ? (
                <Box display="flex" gap={2} mt={2}>
                  <Button type="submit" variant="contained" sx={{
                    background: 'linear-gradient(90deg, #3498db 0%, #1abc9c 100%)',
                    '&:hover': { background: 'linear-gradient(90deg, #2980b9 0%, #16a085 100%)' }
                  }}>Update</Button>
                  <Button type="button" onClick={handleCancel} variant="outlined" sx={{
                    borderColor: '#2179e6',
                    color: '#2179e6',
                    '&:hover': { backgroundColor: '#e3f0ff', borderColor: '#2179e6', color: '#1976d2' }
                  }}>Cancel</Button>
                </Box>
              ) : (
                <Button type="button" onClick={() => setEditable(true)} variant="outlined" sx={{
                  borderColor: '#2179e6',
                  color: '#2179e6',
                  '&:hover': { backgroundColor: '#e3f0ff', borderColor: '#2179e6', color: '#1976d2' },
                  mt: 2
                }}>Edit</Button>
              )}
            </Box>
          </form>
        </Card>
      </motion.div>
      <ToastContainer position="top-center" autoClose={3000} />
    </Box>
  )
}
