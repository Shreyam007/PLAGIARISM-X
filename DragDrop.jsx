// src/components/DragDrop/DragDrop.jsx
import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, FolderUp } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const DragDrop = ({ onFilesDrop }) => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
    
    // Animate files flying in
    setTimeout(() => {
      onFilesDrop(acceptedFiles);
    }, 1000);
  }, [onFilesDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go'],
      'application/json': ['.json']
    },
    multiple: true
  });

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      position: 'relative'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{
          width: '100%',
          maxWidth: '800px',
          padding: '60px 40px',
          textAlign: 'center'
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px',
            boxShadow: '0 0 40px rgba(0, 255, 157, 0.3)'
          }}
        >
          <FolderUp size={48} color="white" />
        </motion.div>
        
        <h2 style={{
          fontSize: '2.5rem',
          marginBottom: '20px',
          background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Upload Source Files
        </h2>
        
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text)',
          opacity: 0.8,
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Drag & drop code files or click to browse. Supports JavaScript, Python, Java, C++, and 20+ languages.
        </p>
        
        <div
          {...getRootProps()}
          style={{
            border: '3px dashed',
            borderColor: isDragActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.2)',
            borderRadius: '24px',
            padding: '60px 40px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: isDragActive ? 'rgba(0, 255, 157, 0.05)' : 'transparent',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '40px'
          }}
        >
          <input {...getInputProps()} />
          
          {isDragActive ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}
            >
              <Upload size={60} color="var(--primary)" />
              <p style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
                Drop files here...
              </p>
            </motion.div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px'
            }}>
              <Upload size={60} color="var(--text)" opacity={0.5} />
              <p style={{ fontSize: '1.2rem', color: 'var(--text)', opacity: 0.7 }}>
                Drag & drop files here, or click to select
              </p>
            </div>
          )}
          
          {/* Animated border effect */}
          {isDragActive && (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: '2px solid transparent',
                borderImage: 'linear-gradient(45deg, var(--primary), var(--secondary)) 1',
                borderRadius: '24px',
                pointerEvents: 'none'
              }}
            />
          )}
        </div>
        
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              marginTop: '40px',
              textAlign: 'left'
            }}
          >
            <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>
              Selected Files ({files.length})
            </h3>
            
            <div style={{
              display: 'grid',
              gap: '15px',
              maxHeight: '300px',
              overflowY: 'auto',
              paddingRight: '10px'
            }}>
              {files.map((file, index) => (
                <motion.div
                  key={file.name + index}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '15px 20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <FileText color="var(--primary)" />
                    <div>
                      <div style={{ fontWeight: '500' }}>{file.name}</div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                        {(file.size / 1024).toFixed(2)} KB
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    style={{
                      background: 'rgba(255, 0, 0, 0.2)',
                      border: 'none',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={18} color="#ff4757" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onFilesDrop(files)}
              style={{
                marginTop: '30px',
                width: '100%',
                padding: '18px',
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                letterSpacing: '1px'
              }}
            >
              ANALYZE {files.length} FILE{files.length > 1 ? 'S' : ''}
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DragDrop;