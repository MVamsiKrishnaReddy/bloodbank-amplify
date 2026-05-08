import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Box, Typography, Avatar, Card } from '@mui/material';
import { Favorite, Security, CheckCircle } from '@mui/icons-material';

// Animated Background Particles
export const BloodParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const createParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 20 + 15,
        });
      }
      setParticles(newParticles);
    };

    createParticles();
  }, []);

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
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            opacity: 0.6,
          }}
          animate={{
            y: [-20, -100, -20],
            x: [-10, 10, -10],
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </Box>
  );
};

// Typewriter Text Effect
export const TypewriterText = ({ text, delay = 0, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typeInterval);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay, speed]);

  return (
    <span>
      {displayText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ display: 'inline-block', marginLeft: '2px' }}
        >
          |
        </motion.span>
      )}
    </span>
  );
};

// Floating Icon Animation
export const FloatingIcon = ({ icon, color = '#e74c3c', size = 60, ...props }) => {
  return (
    <motion.div
      animate={{
        y: [-10, 10, -10],
        rotate: [-5, 5, -5],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      {...props}
    >
      <Avatar
        sx={{
          backgroundColor: color,
          width: size,
          height: size,
          boxShadow: `0 8px 25px ${color}40`,
        }}
      >
        {icon}
      </Avatar>
    </motion.div>
  );
};

// Pulsing Button
export const PulseButton = ({ children, color = '#e74c3c', onClick, ...props }) => {
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.button
      animate={isPulsing ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 1, ease: 'easeInOut' }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        border: 'none',
        borderRadius: '12px',
        color: 'white',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        padding: '12px 24px',
        cursor: 'pointer',
        boxShadow: `0 8px 25px ${color}40`,
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Animated Counter with Blood Drop Effect
export const BloodCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentCount = Math.floor(progress * end);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {prefix}{count}{suffix}
      </Typography>
    </motion.div>
  );
};

// Animated Card with Glow Effect
export const GlowCard = ({ children, color = '#e74c3c', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      viewport={{ once: true }}
    >
      <Card
        sx={{
          borderRadius: 4,
          border: `2px solid ${color}20`,
          boxShadow: `0 8px 32px ${color}20`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: `0 16px 48px ${color}30`,
            borderColor: `${color}40`,
          },
          ...props.sx,
        }}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
};

// Shimmer Effect for Security Icons
export const ShimmerIcon = ({ icon, color = '#27ae60', ...props }) => {
  return (
    <motion.div
      animate={{
        background: [
          `linear-gradient(45deg, ${color} 0%, ${color}80 50%, ${color} 100%)`,
          `linear-gradient(45deg, ${color}80 0%, ${color} 50%, ${color}80 100%)`,
          `linear-gradient(45deg, ${color} 0%, ${color}80 50%, ${color} 100%)`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{
        borderRadius: '50%',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...props.style,
      }}
      {...props}
    >
      <Box sx={{ color: 'white', display: 'flex' }}>
        {icon}
      </Box>
    </motion.div>
  );
};

// Animated Badge
export const AnimatedBadge = ({ text, icon, color = '#e74c3c', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        type: 'spring',
        bounce: 0.5 
      }}
      viewport={{ once: true }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          padding: '8px 16px',
          backgroundColor: `${color}15`,
          border: `2px solid ${color}30`,
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ color: color }}>
          {icon}
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: color,
            fontWeight: 'bold',
          }}
        >
          {text}
        </Typography>
      </Box>
    </motion.div>
  );
};

// Blood Drop Animation
export const BloodDrop = ({ delay = 0, size = 20 }) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 1.5, 
        delay,
        type: 'spring',
        bounce: 0.6 
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          width: size,
          height: size * 1.2,
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          borderRadius: `${size * 0.5}px ${size * 0.5}px 0 ${size * 0.5}px`,
          transform: 'rotate(45deg)',
          boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)',
        }}
      />
    </motion.div>
  );
};

// Parallax Container
export const ParallaxContainer = ({ children, offset = 50 }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, offset]);

  return (
    <motion.div style={{ y }}>
      {children}
    </motion.div>
  );
};

// Staggered Children Animation
export const StaggerContainer = ({ children, stagger = 0.1 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default {
  BloodParticles,
  TypewriterText,
  FloatingIcon,
  PulseButton,
  BloodCounter,
  GlowCard,
  ShimmerIcon,
  AnimatedBadge,
  BloodDrop,
  ParallaxContainer,
  StaggerContainer,
};