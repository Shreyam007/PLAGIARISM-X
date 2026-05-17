// src/components/Hero/Hero.jsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Cpu, Zap, Shield, CheckCircle, ChevronDown, Globe, Lock, FileText, Layout, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Hero = ({ onStart, onOpenPolicy }) => {
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
    <div className="hero-scroll-container" style={{
      width: '100%',
      background: 'var(--bg)',
      scrollBehavior: 'smooth',
      position: 'relative'
    }}>
      {/* Fixed Background Layer */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%'
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 157, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
      </div>

      <div className="hero-container" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden'
      }}>
      
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
              fontSize: 'clamp(1.1rem, 3vw, 1.8rem)',
              color: 'var(--text)',
              marginBottom: '40px',
              maxWidth: '800px',
              margin: '0 auto 40px',
              lineHeight: 1.4,
              padding: '0 20px'
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

      {/* How it Works Section */}
      <div id="how-it-works" style={{
        minHeight: '100vh',
        padding: '100px 40px',
        position: 'relative',
        zIndex: 3,
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            marginBottom: '20px'
          }}>
            How it Works
          </h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.7, maxWidth: '700px', margin: '0 auto' }}>
            Powered by advanced algorithms used in professional plagiarism detection software, 
            PLAGIARISM X ensures the highest accuracy in code analysis.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px'
        }}>
          {/* Winnowing Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass"
            style={{ padding: '40px', borderRadius: '32px' }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'rgba(0, 255, 157, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
              border: '1px solid var(--primary)'
            }}>
              <Zap color="var(--primary)" size={30} />
            </div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--primary)' }}>
              Winnowing Fingerprinting
            </h3>
            <p style={{ lineHeight: 1.6, opacity: 0.8 }}>
              Our core engine uses the Winnowing algorithm to generate digital fingerprints of source code. 
              By selecting a subset of k-gram hashes, we create a robust signature that is immune to 
              whitespace changes, comment modifications, and variable renaming.
            </p>
          </motion.div>

          {/* Rabin-Karp Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass"
            style={{ padding: '40px', borderRadius: '32px' }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'rgba(0, 149, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
              border: '1px solid var(--secondary)'
            }}>
              <Cpu color="var(--secondary)" size={30} />
            </div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--secondary)' }}>
              Rabin-Karp Rolling Hash
            </h3>
            <p style={{ lineHeight: 1.6, opacity: 0.8 }}>
              To achieve quantum-level speeds, we implement the Rabin-Karp rolling hash. 
              This allows us to process thousands of lines of code per second by performing O(1) 
              hash updates, ensuring your results are instant even with batch processing.
            </p>
          </motion.div>

          {/* Jaccard Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glass"
            style={{ padding: '40px', borderRadius: '32px' }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'rgba(255, 0, 230, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
              border: '1px solid var(--accent)'
            }}>
              <Sparkles color="var(--accent)" size={30} />
            </div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--accent)' }}>
              Jaccard Similarity Index
            </h3>
            <p style={{ lineHeight: 1.6, opacity: 0.8 }}>
              We calculate the intersection over union of fingerprints to determine the Jaccard Similarity Index. 
              This provides a mathematically rigorous similarity score that accurately reflects the level 
              of structural similarity between any two files in your dataset.
            </p>
          </motion.div>
        </div>

        {/* Scroll back up indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            marginTop: '80px',
            textAlign: 'center',
            opacity: 0.5,
            cursor: 'pointer'
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div style={{ fontSize: '0.9rem', marginBottom: '10px' }}>BACK TO TOP</div>
          <div style={{ width: '2px', height: '40px', background: 'var(--primary)', margin: '0 auto' }} />
        </motion.div>
      </div>

      {/* Features Section */}
      <div id="features" style={{
        padding: '100px 40px',
        position: 'relative',
        zIndex: 3,
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>
            Quantum Features
          </h2>
          <p style={{ opacity: 0.7, fontSize: '1.2rem' }}>Experience the future of code integrity.</p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px'
        }}>
          {[
            { icon: <Lock size={24} />, title: "Bank-Grade Privacy", desc: "Your code never leaves your browser. All analysis is performed locally for 100% data security." },
            { icon: <Globe size={24} />, title: "Multilingual Engine", desc: "Support for 20+ programming languages including C++, Java, Python, and JavaScript." },
            { icon: <FileText size={24} />, title: "Document Support", desc: "Analysis of PDF and DOCX files in addition to standard source code files." },
            { icon: <CheckCircle size={24} />, title: "Real-time Verification", desc: "Instant result generation with detailed line-by-line comparison and risk assessment." }
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass"
              style={{ padding: '30px', borderRadius: '24px', textAlign: 'left' }}
            >
              <div style={{ color: 'var(--primary)', marginBottom: '20px' }}>{feat.icon}</div>
              <h4 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>{feat.title}</h4>
              <p style={{ opacity: 0.6, lineHeight: 1.6, fontSize: '0.95rem' }}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" style={{
        padding: '100px 40px',
        position: 'relative',
        zIndex: 3,
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Frequently Asked Questions</h2>
        </motion.div>

        {[
          { q: "Is my code shared with any server?", a: "No. PLAGIARISM X uses a client-side execution model. Your files are processed directly in your browser's memory and are never uploaded to our servers." },
          { q: "What constitutes a 'High Risk' result?", a: "Our algorithm flag levels are based on Jaccard Similarity thresholds. Anything above 70% is considered high risk and suggests significant structural overlap." },
          { q: "Can it detect variable renaming?", a: "Yes. The Winnowing algorithm focuses on the structural 'fingerprints' of the code rather than literal text matching, making it resistant to simple renaming obfuscation." }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            style={{ marginBottom: '20px' }}
          >
            <details className="glass" style={{ padding: '20px', borderRadius: '15px', cursor: 'pointer' }}>
              <summary style={{ fontWeight: 600, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {item.q}
                <ChevronDown size={20} />
              </summary>
              <p style={{ marginTop: '15px', opacity: 0.7, lineHeight: 1.6 }}>{item.a}</p>
            </details>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <div style={{
        padding: '120px 40px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 3
      }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="glass"
          style={{ padding: '80px 40px', borderRadius: '40px', display: 'inline-block', maxWidth: '900px', width: '100%' }}
        >
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '30px' }}>Ready to Scan?</h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '40px' }}>Join the next generation of code analysis today.</p>
          <button
            onClick={onStart}
            style={{
              padding: '20px 60px',
              fontSize: '1.2rem',
              background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 0 30px rgba(0, 255, 157, 0.3)'
            }}
          >
            GET STARTED NOW
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '60px 40px',
        background: 'rgba(0,0,0,0.3)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        zIndex: 3
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', color: 'var(--primary)' }}>PLAGIARISM X</h3>
            <p style={{ opacity: 0.5, fontSize: '0.9rem', lineHeight: 1.6 }}>The world's most advanced client-side code plagiarism detection engine.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px' }}>Product</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', opacity: 0.5, fontSize: '0.9rem' }}>
              <span>Features</span>
              <span>Security</span>
              <span>API (Coming Soon)</span>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px' }}>Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', opacity: 0.5, fontSize: '0.9rem' }}>
              <span>Documentation</span>
              <span>Help Center</span>
              <span 
                onClick={onOpenPolicy} 
                style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold' }}
              >
                Privacy Policy
              </span>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px' }}>Connect</h4>
            <div style={{ display: 'flex', gap: '20px', color: 'var(--primary)' }}>
              <Github size={20} style={{ cursor: 'pointer' }} />
              <Twitter size={20} style={{ cursor: 'pointer' }} />
              <Linkedin size={20} style={{ cursor: 'pointer' }} />
              <Mail size={20} style={{ cursor: 'pointer' }} />
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '40px auto 0', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', opacity: 0.5, fontSize: '1rem', fontWeight: 'bold' }}>
          &copy; {new Date().getFullYear()} PLAGIARISM X. All rights reserved. 
          <div style={{ marginTop: '10px', color: 'var(--primary)' }}>
            Developed by Shreyam Pandey
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;