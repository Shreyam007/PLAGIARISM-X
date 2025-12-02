// src/components/Scanner/Scanner.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Activity, Terminal, Hash, Clock } from 'lucide-react';

const Scanner = ({ files, scanning }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 30);

      // Simulate logs
      const logMessages = [
        'Initializing quantum scanner...',
        'Loading Winnowing algorithm (k=30, window=25)...',
        'Configuring Rabin-Karp rolling hash (base 257)...',
        'Tokenizing source files...',
        'Removing comments and whitespace...',
        'Generating fingerprints...',
        'Calculating Jaccard similarities...',
        'Building force graph visualization...',
        'Almost done...'
      ];

      logMessages.forEach((msg, i) => {
        setTimeout(() => {
          setLogs(prev => [...prev, {
            id: i,
            message: msg,
            time: new Date().toLocaleTimeString()
          }]);
        }, i * 300);
      });

      return () => clearInterval(interval);
    }
  }, [scanning]);

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass"
        style={{
          width: '100%',
          maxWidth: '1200px',
          padding: '40px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px'
        }}
      >
        {/* Left Column - Progress & Stats */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '30px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '15px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Cpu size={30} color="white" />
            </div>
            <div>
              <h2 style={{
                fontSize: '2rem',
                background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Quantum Analysis
              </h2>
              <p style={{ opacity: 0.7 }}>
                Processing {files.length} file{files.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Progress Ring */}
          <div style={{
            position: 'relative',
            width: '300px',
            height: '300px',
            margin: '40px auto'
          }}>
            <svg width="300" height="300" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.826} 282.6`}
                transform="rotate(-90 50 50)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--secondary)" />
                </linearGradient>
              </defs>
            </svg>
            
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {progress}%
              </div>
              <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                COMPLETE
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginTop: '40px'
          }}>
            <div className="glass" style={{
              padding: '20px',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <Activity size={24} color="var(--primary)" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>FILES</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{files.length}</div>
            </div>
            
            <div className="glass" style={{
              padding: '20px',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <Hash size={24} color="var(--secondary)" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>FINGERPRINTS</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {(files.length * 750).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Terminal Logs */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <Terminal size={24} color="var(--primary)" />
            <h3 style={{ fontSize: '1.5rem' }}>Live Terminal</h3>
          </div>

          <div className="terminal" style={{
            height: '500px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div className="terminal-header">
              <div className="terminal-dot" style={{ background: '#ff5f57' }} />
              <div className="terminal-dot" style={{ background: '#ffbd2e' }} />
              <div className="terminal-dot" style={{ background: '#28ca42' }} />
              <div style={{ marginLeft: 'auto', fontSize: '0.9rem', opacity: 0.7 }}>
                plagiarism-x --scan
              </div>
            </div>
            
            <div className="terminal-content" style={{
              flex: 1,
              overflowY: 'auto',
              fontFamily: "'Courier New', monospace"
            }}>
              {logs.map(log => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="terminal-line"
                  style={{
                    marginBottom: '10px',
                    display: 'flex',
                    gap: '10px'
                  }}
                >
                  <span style={{ color: '#0095ff', minWidth: '70px' }}>[{log.time}]</span>
                  <span style={{ color: '#00ff9d' }}>{log.message}</span>
                  {log.id === logs.length - 1 && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      style={{ color: '#00ff9d' }}
                    >
                      █
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Algorithm Info */}
          <div className="glass" style={{
            marginTop: '30px',
            padding: '20px',
            borderRadius: '16px'
          }}>
            <h4 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>
              Active Algorithms
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '15px'
            }}>
              <div style={{ fontSize: '0.9rem' }}>
                <div style={{ opacity: 0.7 }}>Winnowing</div>
                <div>k=30, window=25</div>
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                <div style={{ opacity: 0.7 }}>Rabin-Karp</div>
                <div>base=257, rolling</div>
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                <div style={{ opacity: 0.7 }}>Similarity</div>
                <div>Jaccard Index</div>
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                <div style={{ opacity: 0.7 }}>Tokens</div>
                <div>Normalized</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Orbiting particles */}
      {scanning && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                background: 'var(--primary)',
                borderRadius: '50%',
                filter: 'blur(2px)'
              }}
              animate={{
                x: [0, Math.cos(i * 45) * 400, 0],
                y: [0, Math.sin(i * 45) * 400, 0],
                rotate: 360
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Scanner;