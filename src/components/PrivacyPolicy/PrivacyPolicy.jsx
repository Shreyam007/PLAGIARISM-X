// src/components/PrivacyPolicy/PrivacyPolicy.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Lock, Database, EyeOff, UserCheck } from 'lucide-react';

const PrivacyPolicy = ({ onBack }) => {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px 20px',
      maxWidth: '1000px',
      margin: '0 auto',
      position: 'relative'
    }}>
      <motion.button
        whileHover={{ x: -10 }}
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--primary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '40px',
          fontSize: '1.1rem',
          fontWeight: 'bold'
        }}
      >
        <ArrowLeft size={20} /> Back to Home
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{
          padding: '40px',
          borderRadius: '24px'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '40px'
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
            <Shield size={30} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Privacy Policy
            </h1>
            <p style={{ opacity: 0.7 }}>Last Updated: March 2024</p>
          </div>
        </div>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--primary)' }}>
            Developed By
          </h2>
          <div className="glass" style={{ padding: '20px', border: '1px solid var(--primary)' }}>
            <p style={{ fontSize: '1.2rem', margin: 0 }}>
              This professional plagiarism detection platform, <strong>PLAGIARISM-X</strong>, has been conceptualized and developed by <strong>Shreyam Pandey</strong>.
            </p>
          </div>
        </section>

        <div style={{ display: 'grid', gap: '30px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ color: 'var(--secondary)' }}><Lock size={24} /></div>
            <div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Client-Side Processing</h3>
              <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
                At PLAGIARISM-X, your data never leaves your device. All file parsing, fingerprinting, and similarity calculations are performed locally in your browser. We do not upload your documents to any server for analysis.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ color: 'var(--primary)' }}><Database size={24} /></div>
            <div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>No Data Retention</h3>
              <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
                We do not collect, store, or share any of the files you analyze. Once you close your browser tab, all analyzed content is cleared from the application's temporary memory.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ color: 'var(--accent)' }}><EyeOff size={24} /></div>
            <div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Zero Tracking</h3>
              <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
                We do not use tracking cookies or third-party analytics to monitor your behavior. Your identity and the contents of your documents remain 100% private.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ color: 'var(--secondary)' }}><UserCheck size={24} /></div>
            <div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Developer Accountability</h3>
              <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
                Shreyam Pandey is committed to providing a transparent and secure tool for students and educators. This project is built with the principle of "Privacy by Design."
              </p>
            </div>
          </div>
        </div>

        <footer style={{ marginTop: '60px', opacity: 0.5, textAlign: 'center', fontSize: '0.9rem' }}>
          &copy; 2024 PLAGIARISM-X • Made with ❤️ by Shreyam Pandey
        </footer>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
