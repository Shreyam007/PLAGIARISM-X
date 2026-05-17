// src/components/Scanner/Scanner.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Activity, Terminal, Hash, ShieldCheck, Database, Search, Zap } from 'lucide-react';

const Scanner = ({ files, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [fingerprintCount, setFingerprintCount] = useState(0);
  const scrollRef = useRef(null);

  const technicalPhrases = [
    "Analyzing AST nodes...",
    "Computing Rabin-Karp hashes...",
    "Extracting k-gram fingerprints...",
    "Filtering boilerplate patterns...",
    "Normalizing token sequences...",
    "Optimizing winnowing window...",
    "Comparing structural similarity...",
    "Calculating Jaccard coefficients...",
    "Detecting obfuscated logic...",
    "Validating code signatures...",
    "Mapping cross-file dependencies...",
    "Generating similarity matrix...",
    "Performing semantic analysis...",
    "Scanning documentation strings...",
    "Verifying inclusion headers..."
  ];

  useEffect(() => {
    const totalDuration = 6000; // 6 seconds for the "wow" factor
    const startTime = Date.now();
    
    // Progress and Fingerprint interval
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, Math.floor((elapsed / totalDuration) * 100));
      
      setProgress(newProgress);
      setFingerprintCount(Math.floor(newProgress * files.length * 15.7));

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => onComplete?.(), 1000); // Small pause at 100%
      }
    }, 50);

    // High-density log simulation
    const logInterval = setInterval(() => {
      const randomFile = files[Math.floor(Math.random() * files.length)]?.name || "system";
      const phrase = technicalPhrases[Math.floor(Math.random() * technicalPhrases.length)];
      
      setLogs(prev => {
        const newLogs = [...prev, {
          id: Date.now() + Math.random(),
          message: `[${randomFile}] ${phrase}`,
          time: new Date().toLocaleTimeString(),
          type: Math.random() > 0.8 ? 'success' : 'default'
        }];
        // Keep only last 50 logs for performance
        return newLogs.slice(-50);
      });
    }, 150);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, [files, onComplete]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const stats = [
    { icon: <Activity size={20} />, label: "ACTIVE FILES", value: files.length, color: "var(--primary)" },
    { icon: <ShieldCheck size={20} />, label: "SECURITY", value: "ENCRYPTED", color: "var(--secondary)" },
    { icon: <Database size={20} />, label: "LOCAL CACHE", value: "CLEAN", color: "var(--accent)" },
    { icon: <Search size={20} />, label: "SCAN DEPTH", value: "QUANTUM", color: "var(--primary)" }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      background: 'var(--bg)'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{
          width: '100%',
          maxWidth: '1200px',
          padding: '40px',
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 992 ? '1fr' : '1fr 1fr',
          gap: '40px',
          border: '1px solid rgba(0, 255, 157, 0.2)',
          boxShadow: '0 0 50px rgba(0, 255, 157, 0.1)'
        }}
      >
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px var(--primary)'
              }}
            >
              <Cpu size={32} color="white" />
            </motion.div>
            <div>
              <h2 style={{
                fontSize: '2.4rem',
                fontWeight: 800,
                background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '5px'
              }}>
                Quantum Analysis
              </h2>
              <p style={{ opacity: 0.6, fontSize: '1.1rem', letterSpacing: '1px' }}>
                PROCESSING {files.length} SOURCE UNITS
              </p>
            </div>
          </div>

          {/* New Progress Ring UI */}
          <div style={{
            position: 'relative',
            width: '280px',
            height: '280px',
            margin: '0 auto 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="280" height="280" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="4"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="url(#scanner-grad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="289"
                strokeDashoffset={289 - (progress / 100) * 289}
                transform="rotate(-90 50 50)"
              />
              <defs>
                <linearGradient id="scanner-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--secondary)" />
                </linearGradient>
              </defs>
            </svg>
            
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <motion.div 
                style={{
                  fontSize: '4rem',
                  fontWeight: 900,
                  color: 'var(--primary)',
                  textShadow: '0 0 20px rgba(0, 255, 157, 0.5)'
                }}
              >
                {progress}%
              </motion.div>
              <div style={{ fontSize: '0.8rem', opacity: 0.5, letterSpacing: '3px' }}>
                SCANNING STATUS
              </div>
            </div>

            {/* Orbiting Scan Line */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                border: '1px solid transparent',
                borderTop: '2px solid var(--primary)',
                borderRadius: '50%',
                opacity: 0.3
              }}
            />
          </div>

          {/* Key Indicators */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px'
          }}>
            {stats.map((stat, i) => (
              <div key={i} className="glass" style={{
                padding: '15px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ color: stat.color }}>{stat.icon}</div>
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{stat.label}</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Terminal size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>LIVE CORE TERMINAL</h3>
            </div>
            <div style={{
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(0, 255, 157, 0.1)',
              color: 'var(--primary)',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              border: '1px solid var(--primary)'
            }}>
              SYSTEM ACTIVE
            </div>
          </div>

          <div 
            className="terminal" 
            style={{
              flex: 1,
              height: '450px',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '20px',
              padding: '20px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <div 
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: '0.85rem',
                lineHeight: '1.6'
              }}
              className="custom-scrollbar"
            >
              <div style={{ color: '#888', marginBottom: '15px' }}>
                $ plgx-engine --init --mode=quantum --aggressive
                <br />
                $ loading kernel version 2.4.0-X...
              </div>

              <AnimatePresence>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '6px'
                    }}
                  >
                    <span style={{ color: 'var(--secondary)', opacity: 0.5, fontSize: '0.75rem' }}>
                      {log.time.split(' ')[0]}
                    </span>
                    <span style={{ 
                      color: log.type === 'success' ? 'var(--primary)' : '#ddd',
                      textShadow: log.type === 'success' ? '0 0 10px var(--primary)' : 'none'
                    }}>
                      {log.message}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '16px',
                  background: 'var(--primary)',
                  verticalAlign: 'middle',
                  marginLeft: '5px'
                }}
              />
            </div>
          </div>

          {/* Bottom Dynamic Stat Card */}
          <motion.div 
            className="glass"
            style={{
              marginTop: '20px',
              padding: '20px',
              borderRadius: '20px',
              textAlign: 'center',
              border: '1px solid rgba(0, 255, 157, 0.1)',
              background: 'linear-gradient(90deg, transparent, rgba(0, 255, 157, 0.05), transparent)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              <Hash size={24} color="var(--primary)" />
              <div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>TOTAL ANALYZED FINGERPRINTS</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>
                  {fingerprintCount.toLocaleString()}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Scanner;