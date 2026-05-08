import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  TextField, 
  CardContent,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import { 
  LocationOn, 
  Phone, 
  Email, 
  Send,
  CheckCircle,
  Message,
  Person,
  Subject,
  Favorite,
  Bloodtype,
  Star,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { 
  GlowCard, 
  FloatingIcon, 
  PulseButton, 
  StaggerContainer,
  BloodParticles,
  TypewriterText
} from './AnimationComponents';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const contactInfo = [
    {
      icon: <LocationOn />,
      title: 'Our Office',
      details: ['123 LifeLine Street', 'Health City, IN 500001'],
      color: '#3498db',
    },
    {
      icon: <Phone />,
      title: 'Phone',
      details: ['+91 98765 43210', '+91 12345 67890'],
      color: '#27ae60',
    },
    {
      icon: <Email />,
      title: 'Email',
      details: ['support@blood4life.org', 'info@blood4life.org'],
      color: '#e74c3c',
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setShowConfetti(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setShowConfetti(false), 5000);
    }, 2000);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa', position: 'relative', overflow: 'hidden' }}>
      <BloodParticles />

      {/* 🎉 Confetti Effect with hearts, stars, blood drops */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000, pointerEvents: 'none' }}
          >
            <Confetti
              width={windowDimensions.width}
              height={windowDimensions.height}
              recycle={false}
              numberOfPieces={300}
              gravity={0.3}
              drawShape={(ctx) => {
                const shapes = ['❤️','💉','⭐','🩸'];
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                ctx.font = '20px Arial';
                ctx.fillText(shape, 0, 0);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 Header Section */}
      <Box sx={{
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 50%, #8e44ad 100%)',
          color: 'white',
          py: 10,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <StaggerContainer stagger={0.3}>
            <Box sx={{ textAlign: 'center', position: 'relative' }}>
              <FloatingIcon 
                icon={<Message sx={{ fontSize: 50 }} />}
                color="rgba(255, 255, 255, 0.2)"
                size={120}
                style={{
                  margin: '0 auto 32px',
                  backdropFilter: 'blur(15px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
              />
              <FloatingIcon 
                icon={<Favorite sx={{ fontSize: 40 }} />} 
                color="rgba(255, 0, 0, 0.3)" 
                size={80} 
                style={{
                  position: 'absolute',
                  top: '20%',
                  left: '10%',
                  animation: 'float 6s ease-in-out infinite',
                }}
              />
              <FloatingIcon 
                icon={<Bloodtype sx={{ fontSize: 35 }} />} 
                color="rgba(255, 50, 50, 0.3)" 
                size={60} 
                style={{
                  position: 'absolute',
                  top: '40%',
                  right: '15%',
                  animation: 'float 5s ease-in-out infinite',
                }}
              />
              <FloatingIcon 
                icon={<Star sx={{ fontSize: 30 }} />} 
                color="rgba(255, 215, 0, 0.4)" 
                size={50} 
                style={{
                  position: 'absolute',
                  bottom: '10%',
                  left: '20%',
                  animation: 'float 7s ease-in-out infinite',
                }}
              />

              <Typography
                variant={isMobile ? "h4" : "h3"}
                sx={{
                  fontWeight: 'bold',
                  mb: 3,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <TypewriterText text="Get in Touch" speed={150} delay={500} />
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  opacity: 0.95,
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                We'd love to hear from you. Connect with our healthcare support team 
                through any of the channels below.
              </Typography>
            </Box>
          </StaggerContainer>
        </Container>
      </Box>

      {/* 💬 Main Contact Section */}
      <Container sx={{ py: 10, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} justifyContent="center">
          {/* Contact Info Cards */}
          {contactInfo.map((info) => (
            <Grid item xs={12} sm={6} md={4} key={info.title}>
              <GlowCard color={info.color} sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <FloatingIcon 
                    icon={info.icon}
                    color={info.color}
                    size={55}
                  />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 1 }}>
                  {info.title}
                </Typography>
                {info.details.map((detail, idx) => (
                  <Typography key={idx} variant="body1" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>
                    {detail}
                  </Typography>
                ))}
              </GlowCard>
            </Grid>
          ))}

          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <GlowCard color="#e74c3c" sx={{ overflow: 'hidden' }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                  color: 'white',
                  p: 3,
                  borderRadius: '16px 16px 0 0',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Send us a Message
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Fill out the form below and we'll get back to you as soon as possible
                </Typography>
              </Box>

              <CardContent sx={{ p: 4 }}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {[
                      { label: 'Full Name', name: 'name', icon: <Person /> },
                      { label: 'Email Address', name: 'email', icon: <Email />, type: 'email' },
                    ].map((field, i) => (
                      <Grid item xs={12} md={6} key={field.name}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
                        >
                          <TextField
                            fullWidth
                            label={field.label}
                            name={field.name}
                            type={field.type || 'text'}
                            value={formData[field.name]}
                            onChange={handleChange}
                            error={!!errors[field.name]}
                            helperText={errors[field.name]}
                            InputProps={{
                              startAdornment: React.cloneElement(field.icon, { sx: { mr: 1, color: '#e74c3c' } }),
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                          />
                        </motion.div>
                      </Grid>
                    ))}

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        error={!!errors.subject}
                        helperText={errors.subject}
                        InputProps={{
                          startAdornment: <Subject sx={{ mr: 1, color: '#e74c3c' }} />,
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        error={!!errors.message}
                        helperText={errors.message}
                        placeholder="Tell us how we can help you..."
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ position: 'relative' }}>
                        <PulseButton
                          type="submit"
                          disabled={isSubmitting}
                          color={isSubmitting ? '#bdc3c7' : '#e74c3c'}
                          style={{
                            width: '100%',
                            fontSize: '1.2rem',
                            padding: '16px 24px',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {!isSubmitting && <Send sx={{ fontSize: '1.3rem' }} />}
                          {isSubmitting ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                              ⏳
                            </motion.div>
                          ) : null}
                          {isSubmitting ? 'Sending Message...' : 'Send Message'}
                        </PulseButton>
                        <motion.div
                          animate={{ y: [0, -15, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          style={{ position: 'absolute', top: -25, right: 20 }}
                        >
                          <Favorite sx={{ color: '#e74c3c', fontSize: 28 }} />
                        </motion.div>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </GlowCard>
          </Grid>
        </Grid>
      </Container>

      {/* ✅ Success Alert */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
            style={{
              position: 'fixed',
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1300,
              maxWidth: '90%',
            }}
          >
            <Alert
              onClose={() => setShowSuccess(false)}
              severity="success"
              sx={{
                borderRadius: 4,
                background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                color: 'white',
                boxShadow: '0 8px 32px rgba(39, 174, 96, 0.3)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: 2 }}>
                  <CheckCircle sx={{ fontSize: '1.5rem' }} />
                </motion.div>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    Message Sent Successfully! 🎉
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </Typography>
                </Box>
              </Box>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
