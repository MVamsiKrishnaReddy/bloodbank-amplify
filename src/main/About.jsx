import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, CardContent, Typography, Box, Container, Grid,
  Button, Avatar, Chip,
  useTheme, useMediaQuery, Paper,
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import { 
  Favorite, LocalHospital, Bloodtype, People, TrendingUp,
  Security, Speed, Support, CheckCircle, Star, ArrowForward,
} from '@mui/icons-material';
import { motion, useInView } from 'framer-motion';
import { 
  TypewriterText, BloodParticles, BloodCounter, GlowCard, 
  FloatingIcon, PulseButton, StaggerContainer, ParallaxContainer,
  AnimatedBadge, ShimmerIcon, BloodDrop 
} from './AnimationComponents';
import LocationList from './LocationList';

const data = [
  { name: 'Hospitals', count: 120, color: '#3498db' },
  { name: 'Blood Banks', count: 80, color: '#e74c3c' },
  { name: 'Donors', count: 150, color: '#27ae60' },
  { name: 'Lives Saved', count: 500, color: '#f39c12' },
];

const pieData = [
  { name: 'Hospitals', value: 120, color: '#3498db' },
  { name: 'Blood Banks', value: 80, color: '#e74c3c' },
  { name: 'Donors', value: 150, color: '#27ae60' },
];

const features = [
  {
    icon: <Speed />,
    title: 'Lightning Fast',
    description: 'Get blood requests processed in minutes, not hours',
    color: '#3498db',
  },
  {
    icon: <Security />,
    title: 'Secure & Reliable',
    description: 'Bank-grade security for all medical data',
    color: '#27ae60',
  },
  {
    icon: <Support />,
    title: '24/7 Support',
    description: 'Round-the-clock assistance for emergencies',
    color: '#e74c3c',
  },
  {
    icon: <TrendingUp />,
    title: 'Real-time Updates',
    description: 'Live tracking of blood availability and requests',
    color: '#f39c12',
  },
];

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime;
      const startCount = 0;
      const endCount = end;

      const updateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentCount = Math.floor(progress * (endCount - startCount) + startCount);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      requestAnimationFrame(updateCount);
    }
  }, [isInView, end, duration]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {count}{suffix}
    </motion.span>
  );
};

export default function About() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // refs for scrolling
  const hospitalRef = useRef(null);
  const donorRef = useRef(null);

  // scroll functions
  const scrollToHospital = () => hospitalRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollToDonor = () => donorRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa', overflow: 'hidden' }}>
      <BloodParticles />
      
      {/* Enhanced Healthcare Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 30%, #8e44ad 70%, #3498db 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 10, md: 15 },
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Enhanced Animated Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 15% 30%, rgba(255,255,255,0.15) 0%, transparent 50%),
              radial-gradient(circle at 85% 20%, rgba(255,255,255,0.12) 0%, transparent 50%),
              radial-gradient(circle at 30% 90%, rgba(255,255,255,0.08) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.05) 0%, transparent 50%)
            `,
            zIndex: 1,
          }}
        />
        
        {/* Floating Blood Drops */}
        <Box sx={{ position: 'absolute', top: '20%', left: '10%', zIndex: 1 }}>
          <BloodDrop delay={0} size={15} />
        </Box>
        <Box sx={{ position: 'absolute', top: '60%', right: '15%', zIndex: 1 }}>
          <BloodDrop delay={2} size={20} />
        </Box>
        <Box sx={{ position: 'absolute', top: '40%', left: '80%', zIndex: 1 }}>
          <BloodDrop delay={4} size={12} />
        </Box>
        
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              {/* Healthcare Hero Icon with Floating Elements */}
              <Box sx={{ position: 'relative', mb: 6 }}>
                <FloatingIcon 
                  icon={<Favorite sx={{ fontSize: 70 }} />}
                  color="rgba(255, 255, 255, 0.2)"
                  size={140}
                  style={{
                    margin: '0 auto',
                    backdropFilter: 'blur(15px)',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                  }}
                />
                
                {/* Side Medical Icons */}
                <Box sx={{ position: 'absolute', top: 20, left: '20%', display: { xs: 'none', md: 'block' } }}>
                  <FloatingIcon 
                    icon={<LocalHospital />}
                    color="#3498db"
                    size={50}
                    style={{ animationDelay: '1s' }}
                  />
                </Box>
                <Box sx={{ position: 'absolute', top: 60, right: '20%', display: { xs: 'none', md: 'block' } }}>
                  <FloatingIcon 
                    icon={<Bloodtype />}
                    color="#e74c3c"
                    size={50}
                    style={{ animationDelay: '1.5s' }}
                  />
                </Box>
              </Box>
              
              {/* Typewriter Hero Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Typography
                  variant={isMobile ? "h3" : "h2"}
                  sx={{
                    fontWeight: 'bold',
                    mb: 4,
                    fontSize: { xs: '2.2rem', md: '3.8rem' },
                    textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                    background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 50%, #e8f4fd 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2,
                  }}
                >
                  <TypewriterText 
                    text="Connecting Lives Through Blood" 
                    speed={120}
                    delay={800}
                  />
                </Typography>
              </motion.div>
              
              {/* Professional Healthcare Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.5 }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.95,
                    maxWidth: '900px',
                    mx: 'auto',
                    lineHeight: 1.7,
                    textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                  }}
                >
                  Empowering healthcare professionals and compassionate donors to create 
                  a seamless blood donation network that saves lives when every second counts.
                </Typography>
              </motion.div>

              {/* Healthcare Role Buttons with onClick to scroll */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 3.5 }}
              >
                <StaggerContainer stagger={0.3}>
                  <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}>
                    <PulseButton
                      color="#3498db"
                      style={{
                        fontSize: '1.2rem',
                        padding: '16px 32px',
                        borderRadius: '16px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                      onClick={scrollToHospital}
                    >
                      <LocalHospital sx={{ fontSize: '1.4rem' }} />
                      Hospital Solutions
                    </PulseButton>
                    
                    <PulseButton
                      color="#27ae60"
                      style={{
                        fontSize: '1.2rem',
                        padding: '16px 32px',
                        borderRadius: '16px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                      onClick={scrollToDonor}
                    >
                      <People sx={{ fontSize: '1.4rem' }} />
                      Donor Network
                    </PulseButton>
                  </Box>
                </StaggerContainer>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>
      
      {/* Hospital Solutions Section */}
      <ParallaxContainer offset={30}>
        <Box ref={hospitalRef} sx={{ backgroundColor: '#f8f9fa', py: 10 }}>
          <Container>
            <StaggerContainer stagger={0.2}>
              <Typography
                variant={isMobile ? "h4" : "h3"}
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  mb: 3,
                  color: '#2c3e50',
                  background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Hospital Management Solutions
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                  color: '#666',
                  mb: 8,
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Empowering hospitals with real-time blood inventory tracking, efficient request management, 
                and seamless communication with blood banks and donors.
              </Typography>
              
              {/* Layout: two cards horizontally, one centered below */}
              <Grid 
                container 
                spacing={4} 
                justifyContent="center" 
                alignItems="center"
              >
                {/* First feature */}
                <Grid item xs={12} md={5}>
                  <GlowCard color="#3498db" sx={{ p: 4, height: '100%' }}>
                    <FloatingIcon 
                      icon={<TrendingUp />}
                      color="#3498db"
                      size={70}
                      style={{ margin: '0 auto 20px' }}
                    />
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', color: '#2c3e50' }}
                    >
                      Real-Time Dashboard
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: '#666', lineHeight: 1.6, mb: 3, textAlign: 'center' }}
                    >
                      Monitor blood availability across all types with live updates and interactive charts
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {['Live Updates', 'Analytics', 'Forecasting'].map((badge, i) => (
                        <AnimatedBadge 
                          key={badge}
                          text={badge}
                          icon={<CheckCircle />}
                          color="#3498db"
                          delay={i * 0.2}
                        />
                      ))}
                    </Box>
                  </GlowCard>
                </Grid>

                {/* Second feature */}
                <Grid item xs={12} md={5}>
                  <GlowCard color="#e74c3c" sx={{ p: 4, height: '100%' }}>
                    <FloatingIcon 
                      icon={<LocalHospital />}
                      color="#e74c3c"
                      size={70}
                      style={{ margin: '0 auto 20px' }}
                    />
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', color: '#2c3e50' }}
                    >
                      Efficient Blood Requests
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: '#666', lineHeight: 1.6, mb: 3, textAlign: 'center' }}
                    >
                      Submit and track blood requests with priority levels and automated matching
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {['Priority System', 'Auto-Match', '24/7 Support'].map((badge, i) => (
                        <AnimatedBadge 
                          key={badge}
                          text={badge}
                          icon={<CheckCircle />}
                          color="#e74c3c"
                          delay={i * 0.2}
                        />
                      ))}
                    </Box>
                  </GlowCard>
                </Grid>

                {/* Third feature below center */}
                <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
                  <GlowCard color="#27ae60" sx={{ p: 4, height: '100%' }}>
                    <FloatingIcon 
                      icon={<Security />}
                      color="#27ae60"
                      size={70}
                      style={{ margin: '0 auto 20px' }}
                    />
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', color: '#2c3e50' }}
                    >
                      Secure Data Management
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: '#666', lineHeight: 1.6, mb: 3, textAlign: 'center' }}
                    >
                      Bank-grade security for patient data and medical records with full compliance
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {['HIPAA Compliant', 'Encrypted', 'Audit Trail'].map((badge, i) => (
                        <AnimatedBadge 
                          key={badge}
                          text={badge}
                          icon={<CheckCircle />}
                          color="#27ae60"
                          delay={i * 0.2}
                        />
                      ))}
                    </Box>
                  </GlowCard>
                </Grid>
              </Grid>
            </StaggerContainer>
          </Container>
        </Box>
      </ParallaxContainer>
      
      {/* Donor Network Section */}
      <ParallaxContainer offset={-30}>
        <Box ref={donorRef} sx={{ backgroundColor: '#fff', py: 10 }}>
          <Container>
            <StaggerContainer stagger={0.2}>
              <Typography
                variant={isMobile ? "h4" : "h3"}
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  mb: 3,
                  color: '#2c3e50',
                  background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Donor Experience Platform
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                  color: '#666',
                  mb: 8,
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Connecting compassionate donors with life-saving opportunities through 
                easy registration, convenient scheduling, and meaningful recognition.
              </Typography>
              
              {/* Layout: two cards horizontally, one centered below */}
              <Grid 
                container 
                spacing={4}
                justifyContent="center"
                alignItems="center"
              >
                {/* First */}
                <Grid item xs={12} md={5}>
                  <GlowCard color="#27ae60" sx={{ p: 4, height: '100%' }}>
                    <FloatingIcon 
                      icon={<People />}
                      color="#27ae60"
                      size={70}
                      style={{ margin: '0 auto 20px' }}
                    />
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', color: '#2c3e50' }}
                    >
                      Easy Registration
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: '#666', lineHeight: 1.6, mb: 3, textAlign: 'center' }}
                    >
                      Quick donor onboarding with step-by-step guidance and instant verification
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {['5-Min Setup', 'ID Verification', 'Medical Screening'].map((badge, i) => (
                        <AnimatedBadge 
                          key={badge}
                          text={badge}
                          icon={<CheckCircle />}
                          color="#27ae60"
                          delay={i * 0.2}
                        />
                      ))}
                    </Box>
                  </GlowCard>
                </Grid>

                {/* Second */}
                <Grid item xs={12} md={5}>
                  <GlowCard color="#e74c3c" sx={{ p: 4, height: '100%' }}>
                    <FloatingIcon 
                      icon={<Favorite />}
                      color="#e74c3c"
                      size={70}
                      style={{ margin: '0 auto 20px' }}
                    />
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', color: '#2c3e50' }}
                    >
                      Smart Notifications
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: '#666', lineHeight: 1.6, mb: 3, textAlign: 'center' }}
                    >
                      Receive personalized alerts for donation opportunities in your area
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {['Location-Based', 'Type Match', 'Emergency Alerts'].map((badge, i) => (
                        <AnimatedBadge 
                          key={badge}
                          text={badge}
                          icon={<CheckCircle />}
                          color="#e74c3c"
                          delay={i * 0.2}
                        />
                      ))}
                    </Box>
                  </GlowCard>
                </Grid>

                {/* Third */}
                <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
                  <GlowCard color="#f39c12" sx={{ p: 4, height: '100%' }}>
                    <FloatingIcon 
                      icon={<Star />}
                      color="#f39c12"
                      size={70}
                      style={{ margin: '0 auto 20px' }}
                    />
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', color: '#2c3e50' }}
                    >
                      Recognition Program
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: '#666', lineHeight: 1.6, mb: 3, textAlign: 'center' }}
                    >
                      Track your impact and receive acknowledgments for your life-saving contributions
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {['Impact Tracking', 'Badges', 'Community'].map((badge, i) => (
                        <AnimatedBadge 
                          key={badge}
                          text={badge}
                          icon={<CheckCircle />}
                          color="#f39c12"
                          delay={i * 0.2}
                        />
                      ))}
                    </Box>
                  </GlowCard>
                </Grid>
              </Grid>
            </StaggerContainer>
          </Container>
        </Box>
      </ParallaxContainer>

      {/* Enhanced Stats Section */}
      <ParallaxContainer offset={25}>
  <Container sx={{ py: 10 }}>
    <StaggerContainer stagger={0.15}>
      <Typography
        variant={isMobile ? "h4" : "h3"}
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          mb: 8,
          color: '#2c3e50',
          background: 'linear-gradient(135deg, #e74c3c 0%, #3498db 50%, #27ae60 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Our Healthcare Impact
      </Typography>
      
      <Grid container spacing={4} justifyContent="center">
        {data.map((item, index) => {
          const iconMap = {
            'Hospitals': <LocalHospital />,
            'Blood Banks': <Bloodtype />,
            'Donors': <People />,
            'Lives Saved': <Favorite />
          };
          
          return (
            <Grid 
              item 
              xs={10}  // reduce xs width so it's centered nicely on mobile
              sm={6}
              md={3} 
              key={item.name}
              sx={{ mx: 'auto' }} // auto margin for horizontal centering
            >
              <GlowCard color={item.color} sx={{ p: 4, textAlign: 'center' }}>
                <FloatingIcon 
                  icon={iconMap[item.name]}
                  color={item.color}
                  size={80}
                  style={{ margin: '0 auto 20px' }}
                />
                
                <BloodCounter 
                  end={item.count}
                  suffix={item.name === 'Lives Saved' ? '+' : ''}
                />
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#666',
                    mt: 2,
                    fontWeight: 600,
                  }}
                >
                  {item.name}
                </Typography>
              </GlowCard>
            </Grid>
          );
        })}
      </Grid>
    </StaggerContainer>
  </Container>
</ParallaxContainer>

      {/* Features Section */}
<Box sx={{ backgroundColor: '#fff', py: 8 }}>
  <Container>
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <Typography
        variant={isMobile ? "h4" : "h3"}
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          mb: 6,
          color: '#2c3e50',
        }}
      >
        Why Choose Blood 4 Life?
      </Typography>
      
      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} key={feature.title} sx={{ mx: 'auto' }}>
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  p: 4,
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: `2px solid ${feature.color}20`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 12px 40px ${feature.color}30`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      backgroundColor: feature.color,
                      width: 50,
                      height: 50,
                      mr: 2,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      color: '#2c3e50',
                    }}
                  >
                    {feature.title}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#666',
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </Typography>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  </Container>
</Box>

{/* Chart Section */}
<Container sx={{ py: 8 }}>
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <Typography
      variant={isMobile ? "h4" : "h3"}
      sx={{
        textAlign: 'center',
        fontWeight: 'bold',
        mb: 6,
        color: '#2c3e50',
      }}
    >
      Our Network Growth
    </Typography>
    
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} md={8}>
        <Card
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            Partnership Growth Over Time
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#e74c3c" 
                strokeWidth={3} 
                dot={{ r: 6 }} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            height: '100%',
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            Network Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Grid>
    </Grid>
  </motion.div>
</Container>

{/* Call to Action */}
<Box
  sx={{
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    color: 'white',
    py: 8,
  }}
>
  <Container>
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: '600px', mx: 'auto' }}>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          sx={{
            fontWeight: 'bold',
            mb: 3,
          }}
        >
          Ready to Make a Difference?
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            opacity: 0.9,
          }}
        >
          Join thousands of hospitals, blood banks, and donors who are already 
          saving lives through our platform.
        </Typography>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
              color: '#fff',
              px: 6,
              py: 2,
              borderRadius: 4,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 8px 25px rgba(231, 76, 60, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #c0392b 0%, #a93226 100%)',
                boxShadow: '0 12px 35px rgba(231, 76, 60, 0.5)',
              },
            }}
          >
            Get Started Today
          </Button>
        </motion.div>
      </Box>
    </motion.div>
  </Container>
</Box>

{/* States and Cities Availability Section */}
<Box
  sx={{
    backgroundColor: '#f8f9fa',
    py: 8,
    textAlign: 'center',
  }}
>
  <Container>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <Typography
        variant={isMobile ? "h4" : "h3"}
        sx={{
          fontWeight: 'bold',
          mb: 6,
          color: '#2c3e50',
          background: 'linear-gradient(135deg, #e74c3c 0%, #27ae60 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        States and Cities We’re Proudly Serving
      </Typography>

      {/* Fetch and Display Locations */}
      <LocationList />
    </motion.div>
  </Container>
</Box>
    </Box>

    
  );
}
