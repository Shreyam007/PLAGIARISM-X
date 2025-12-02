// src/components/Hero/Hero.jsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Cpu, Zap } from 'lucide-react';

const Hero = ({ onStart }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    const particles = [];
    const particleCount = 150;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.color = `hsl(${Math.random() * 60 + 180}, 100%, 70%)`;
        this.alpha = Math.random() * 0.5 + 0.3;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around edges
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.closePath();
      }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    let animationId;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, 'rgba(10, 10, 15, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 255, 157, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Connect close particles with lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 157, ${0.2 * (1 - distance/100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div className="hero-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--bg)'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      />
      
      {/* Animated gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 157, 0.1) 0%, transparent 70%)',
        zIndex: 2,
        pointerEvents: 'none'
      }} />
      
      <div className="hero-content" style={{
        position: 'relative',
        zIndex: 3,
        textAlign: 'center',
        maxWidth: '1200px',
        padding: '40px',
        width: '100%'
      }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="logo-container"
          style={{
            display: 'inline-block',
            marginBottom: '40px'
          }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotate: { duration: 5, repeat: Infinity, repeatType: "reverse" },
              scale: { duration: 3, repeat: Infinity, repeatType: "reverse" }
            }}
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '35px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 30px',
              boxShadow: '0 0 60px rgba(0, 255, 157, 0.5)',
              position: 'relative',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <Cpu size={70} color="white" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px'
              }}
            >
              <Sparkles size={30} color="var(--accent)" />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="title"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            style={{
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              background: 'linear-gradient(45deg, var(--primary), var(--secondary), var(--accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '20px',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              lineHeight: 1.1,
              textShadow: '0 0 30px rgba(0, 255, 157, 0.3)'
            }}
          >
            PLAGIARISM X
          </motion.h1>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 1.8rem)',
              color: 'var(--text)',
              marginBottom: '40px',
              maxWidth: '800px',
              margin: '0 auto 40px',
              lineHeight: 1.4
            }}
          >
            Detect Code Theft at{' '}
            <motion.span 
              style={{ 
                color: 'var(--primary)',
                fontWeight: 700
              }}
              animate={{ 
                textShadow: [
                  '0 0 10px var(--primary)',
                  '0 0 20px var(--primary)',
                  '0 0 10px var(--primary)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Quantum Speed
            </motion.span>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={onStart}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 60px rgba(0, 255, 157, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '20px 60px',
              fontSize: '1.2rem',
              background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              margin: '0 auto',
              boxShadow: '0 0 40px rgba(0, 255, 157, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              minWidth: '300px'
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap size={24} />
            </motion.div>
            <span>LAUNCH DETECTOR</span>
            
            {/* Scanning effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              transform: 'translateX(-100%)',
              animation: 'scan 2s linear infinite'
            }} />
            
            {/* Glow effect */}
            <div style={{
              position: 'absolute',
              top: '-10px',
              left: '-10px',
              right: '-10px',
              bottom: '-10px',
              background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
              borderRadius: '60px',
              zIndex: -1,
              filter: 'blur(20px)',
              opacity: 0.3
            }} />
          </motion.button>
          
          {/* Additional tech badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginTop: '40px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{
              padding: '8px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              border: '1px solid rgba(0, 255, 157, 0.2)',
              fontSize: '0.9rem',
              color: 'var(--text)',
              opacity: 0.8
            }}>
              ⚡ Winnowing Algorithm
            </div>
            <div style={{
              padding: '8px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              border: '1px solid rgba(0, 149, 255, 0.2)',
              fontSize: '0.9rem',
              color: 'var(--text)',
              opacity: 0.8
            }}>
              🔍 Rabin-Karp Hashing
            </div>
            <div style={{
              padding: '8px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 0, 230, 0.2)',
              fontSize: '0.9rem',
              color: 'var(--text)',
              opacity: 0.8
            }}>
              📊 Jaccard Similarity
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;