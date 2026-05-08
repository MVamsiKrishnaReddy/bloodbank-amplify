import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import { 
  Favorite,
  LocalHospital,
  Bloodtype,
  People,
  TrendingUp,
  Security,
  Speed,
  Support,
  ArrowForward,
  Star,
  CheckCircle,
  PlayArrow,
} from '@mui/icons-material';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { 
  TypewriterText, 
  BloodParticles, 
  BloodCounter, 
  GlowCard, 
  FloatingIcon,
  PulseButton,
  StaggerContainer,
  ParallaxContainer 
} from './AnimationComponents';

// Particle Animation Component
const ParticleBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const createParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
      setParticles(newParticles);
    };

    createParticles();

    const animateParticles = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
          y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
        }))
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: '#e74c3c',
            borderRadius: '50%',
            opacity: particle.opacity,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </Box>
  );
};

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

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Chief Medical Officer",
    hospital: "City General Hospital",
    content: "Blood 4 Life has revolutionized how we manage blood requests. The real-time availability tracking has saved countless lives.",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Blood Bank Director",
    hospital: "Regional Blood Center",
    content: "The platform's efficiency and user-friendly interface have made our operations seamless and more effective.",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Donor Coordinator",
    hospital: "LifeSave Blood Bank",
    content: "Connecting donors with hospitals has never been easier. The impact on our community has been incredible.",
    rating: 5,
    avatar: "ER",
  },
];

const features = [
  {
    icon: <Speed />,
    title: "Lightning Fast",
    description: "Get blood requests processed in minutes, not hours",
    color: "#3498db",
  },
  {
    icon: <Security />,
    title: "Secure & Reliable",
    description: "Bank-grade security for all medical data",
    color: "#27ae60",
  },
  {
    icon: <Support />,
    title: "24/7 Support",
    description: "Round-the-clock assistance for emergencies",
    color: "#e74c3c",
  },
  {
    icon: <TrendingUp />,
    title: "Real-time Updates",
    description: "Live tracking of blood availability and requests",
    color: "#f39c12",
  },
];

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <BloodParticles />
      
      {/* Enhanced Hero Section */}
      <motion.div style={{ y: heroY, opacity: heroOpacity }}>
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 40%, #8e44ad 80%, #3498db 100%)',
            color: 'white',
            py: { xs: 10, md: 15 },
            overflow: 'hidden',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Animated Background Elements */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 0%, transparent 50%),
                radial-gradient(circle at 40% 90%, rgba(255,255,255,0.05) 0%, transparent 50%)
              `,
              zIndex: 1,
            }}
          />
          
          <Container sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              {/* Floating Heart Icon */}
              <Box sx={{ position: 'relative', mb: 6 }}>
                <FloatingIcon 
                  icon={<Favorite sx={{ fontSize: 80 }} />} 
                  color="rgba(255, 255, 255, 0.2)" 
                  size={150}
                  style={{
                    margin: '0 auto',
                    backdropFilter: 'blur(10px)',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                  }}
                />
                
                {/* Floating Side Icons */}
                <Box sx={{ position: 'absolute', top: 20, left: '15%', display: { xs: 'none', md: 'block' } }}>
                  <FloatingIcon 
                    icon={<LocalHospital />} 
                    color="#3498db" 
                    size={60}
                    style={{ animationDelay: '0.5s' }}
                  />
                </Box>
                <Box sx={{ position: 'absolute', top: 40, right: '15%', display: { xs: 'none', md: 'block' } }}>
                  <FloatingIcon 
                    icon={<People />} 
                    color="#27ae60" 
                    size={60}
                    style={{ animationDelay: '1s' }}
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
                  variant={isMobile ? "h3" : "h1"}
                  sx={{
                    fontWeight: 'bold',
                    mb: 4,
                    fontSize: { xs: '2.5rem', md: '4.5rem' },
                    textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                    background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 50%, #e8f4fd 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2,
                  }}
                >
                  <TypewriterText 
                    text="BloodBridge" 
                    speed={150}
                    delay={800}
                  />
                </Typography>
              </motion.div>
              
              {/* Animated Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    mb: 4,
                    opacity: 0.95,
                    maxWidth: '900px',
                    mx: 'auto',
                    lineHeight: 1.6,
                    fontSize: { xs: '1.3rem', md: '2.2rem' },
                    textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                  }}
                >
                  <TypewriterText 
                    text="Connecting Lives Through Blood" 
                    speed={80}
                    delay={2500}
                  />
                </Typography>
              </motion.div>
              
              <Typography
                variant="h6"
                sx={{
                  mb: 6,
                  opacity: 0.8,
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Join our mission to save lives — one drop at a time. 
                We bridge the gap between hospitals, blood banks, and donors 
                to make life-saving blood accessible when it matters most.
              </Typography>

              {/* Enhanced Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 3.5 }}
              >
                <StaggerContainer stagger={0.2}>
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
                    >
                      <LocalHospital sx={{ fontSize: '1.5rem' }} />
                      For Hospitals
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
                    >
                      <People sx={{ fontSize: '1.5rem' }} />
                      For Donors
                    </PulseButton>
                  </Box>
                </StaggerContainer>
              </motion.div>
            </Box>
          </Container>
        </Box>
      </motion.div>

      {/* Enhanced Stats Section */}
      <ParallaxContainer offset={30}>
        <Container sx={{ py: 10, position: 'relative', zIndex: 1 }}>
          <StaggerContainer stagger={0.15}>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                mb: 8,
                color: '#2c3e50',
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Our Impact in Numbers
            </Typography>
            
            <Grid container spacing={4}>
              {[
                { name: 'Hospitals Connected', count: 120, color: '#3498db', icon: <LocalHospital />, prefix: '' },
                { name: 'Blood Banks', count: 80, color: '#e74c3c', icon: <Bloodtype />, prefix: '' },
                { name: 'Active Donors', count: 1500, color: '#27ae60', icon: <People />, prefix: '' },
                { name: 'Lives Saved', count: 5000, color: '#f39c12', icon: <Favorite />, prefix: '' },
              ].map((item, index) => (
                <Grid item xs={6} md={3} key={item.name}>
                  <GlowCard color={item.color} sx={{ p: 4, textAlign: 'center' }}>
                    <FloatingIcon 
                      icon={item.icon} 
                      color={item.color} 
                      size={70}
                      style={{ margin: '0 auto 16px' }}
                    />
                    
                    <BloodCounter 
                      end={item.count} 
                      suffix={item.name === 'Lives Saved' ? '+' : ''}
                      prefix={item.prefix}
                    />
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#666',
                        mt: 2,
                        fontWeight: 500,
                      }}
                    >
                      {item.name}
                    </Typography>
                  </GlowCard>
                </Grid>
              ))}
            </Grid>
          </StaggerContainer>
        </Container>
      </ParallaxContainer>

      {/* Enhanced Features Section */}
      <Box sx={{ backgroundColor: '#f8f9fa', py: 10, position: 'relative', zIndex: 1 }}>
        <Container>
          <StaggerContainer stagger={0.2}>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                mb: 8,
                color: '#2c3e50',
                background: 'linear-gradient(135deg, #2c3e50 0%, #e74c3c 50%, #3498db 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Why Choose BloodBridge?
            </Typography>
            
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={6} key={feature.title}>
                  <GlowCard color={feature.color} sx={{ p: 5, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <FloatingIcon 
                        icon={feature.icon} 
                        color={feature.color} 
                        size={60}
                        style={{ marginRight: '16px' }}
                      />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 'bold',
                          color: '#2c3e50',
                          background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}cc 100%)`,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#555',
                        lineHeight: 1.7,
                        fontSize: '1.1rem',
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </GlowCard>
                </Grid>
              ))}
            </Grid>
          </StaggerContainer>
        </Container>
      </Box>

      {/* Enhanced Testimonials Section */}
      <ParallaxContainer offset={-20}>
        <Container sx={{ py: 10, position: 'relative', zIndex: 1 }}>
          <StaggerContainer stagger={0.2}>
          <Typography
            variant={isMobile ? "h4" : "h3"}
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 6,
              color: '#2c3e50',
            }}
          >
            What Our Partners Say
          </Typography>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={testimonial.name}>
                <GlowCard color="#e74c3c" sx={{ p: 5, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <FloatingIcon 
                      icon={<Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {testimonial.avatar}
                      </Typography>}
                      color="#e74c3c"
                      size={60}
                      style={{ marginRight: '16px' }}
                    />
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold',
                          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                        {testimonial.role}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
                        {testimonial.hospital}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Star sx={{ color: '#f39c12', fontSize: '1.4rem' }} />
                      </motion.div>
                    ))}
                  </Box>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#555',
                      lineHeight: 1.7,
                      fontStyle: 'italic',
                      fontSize: '1.1rem',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        fontSize: '3rem',
                        color: '#e74c3c',
                        position: 'absolute',
                        top: '-10px',
                        left: '-10px',
                        opacity: 0.3,
                      },
                    }}
                  >
                    "{testimonial.content}"
                  </Typography>
                </GlowCard>
              </Grid>
            ))}
          </Grid>
        </StaggerContainer>
      </Container>
      </ParallaxContainer>

      {/* Enhanced Call to Action */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #e74c3c 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        <BloodParticles />
        
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <StaggerContainer stagger={0.3}>
            <Box sx={{ textAlign: 'center' }}>
              <FloatingIcon 
                icon={<Favorite sx={{ fontSize: 50 }} />}
                color="rgba(255, 255, 255, 0.2)"
                size={100}
                style={{ margin: '0 auto 32px' }}
              />
              
              <Typography
                variant={isMobile ? "h4" : "h2"}
                sx={{
                  fontWeight: 'bold',
                  mb: 4,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <TypewriterText 
                  text="Ready to Save Lives?" 
                  speed={100}
                  delay={500}
                />
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  mb: 6,
                  opacity: 0.95,
                  maxWidth: '700px',
                  mx: 'auto',
                  lineHeight: 1.6,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                Join thousands of hospitals, blood banks, and donors who are already 
                making a difference through BloodBridge.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <PulseButton
                  color="#e74c3c"
                  style={{
                    fontSize: '1.3rem',
                    padding: '18px 40px',
                    borderRadius: '16px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <ArrowForward sx={{ fontSize: '1.5rem' }} />
                  Get Started Today
                </PulseButton>
                
                <PulseButton
                  color="#3498db"
                  style={{
                    fontSize: '1.3rem',
                    padding: '18px 40px',
                    borderRadius: '16px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <PlayArrow sx={{ fontSize: '1.5rem' }} />
                  Watch Demo
                </PulseButton>
              </Box>
            </Box>
          </StaggerContainer>
        </Container>
      </Box>
    </Box>
  );
}
