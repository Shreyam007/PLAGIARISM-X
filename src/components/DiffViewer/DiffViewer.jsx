// src/components/DiffViewer/DiffViewer.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, FileDiff } from 'lucide-react';

const DiffViewer = ({ file1, file2, similarity, onClose }) => {
  const [activeTab, setActiveTab] = useState('comparison');

  // Generate matched lines based on actual content comparison
  const findMatchedLines = () => {
    const lines1 = file1.content.split('\n');
    const lines2 = file2.content.split('\n');
    const matches = [];
    
    // Use a map to store trimmed line content from file2 for O(1) matching
    const file2LinesMap = new Map();
    lines2.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.length >= 3) {
        if (!file2LinesMap.has(trimmed)) {
          file2LinesMap.set(trimmed, []);
        }
        file2LinesMap.get(trimmed).push(index + 1);
      }
    });

    // Find matches in file1
    lines1.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.length >= 3 && file2LinesMap.has(trimmed)) {
        const matchingLinesInFile2 = file2LinesMap.get(trimmed);
        
        // For ditto-same files, we ideally want to match line i with line i
        // Otherwise, match with the first occurrence
        const bestMatch = matchingLinesInFile2.find(l => l === index + 1) || matchingLinesInFile2[0];
        
        matches.push({
          line1: index + 1,
          line2: bestMatch,
          content: line
        });
      }
    });
    
    return matches;
  };

  const matchedLines = findMatchedLines();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--text)'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <FileDiff size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text)' }}>Code Comparison</h2>
          </div>
          <div style={{
            display: 'flex',
            gap: '20px',
            marginTop: '10px',
            fontSize: '0.9rem',
            color: 'var(--text)',
            opacity: 0.8
          }}>
            <span>
              <strong>{file1.name}</strong> ({file1.student})
            </span>
            <span style={{ color: 'var(--primary)' }}>VS</span>
            <span>
              <strong>{file2.name}</strong> ({file2.student})
            </span>
            <span style={{
              padding: '4px 12px',
              background: similarity > 70 ? 'rgba(255, 71, 87, 0.2)' : 
                         similarity > 40 ? 'rgba(255, 165, 2, 0.2)' : 'rgba(46, 213, 115, 0.2)',
              borderRadius: '20px',
              border: `1px solid ${similarity > 70 ? '#ff4757' : 
                       similarity > 40 ? '#ffa502' : '#2ed573'}`,
              color: similarity > 70 ? '#ff4757' : 
                     similarity > 40 ? '#ffa502' : '#2ed573'
            }}>
              {similarity.toFixed(3)}% SIMILAR
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'var(--card-bg)',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            {similarity > 70 ? (
              <>
                <AlertTriangle size={16} color="#ff4757" />
                <span style={{ color: '#ff4757' }}>High Risk</span>
              </>
            ) : similarity > 40 ? (
              <>
                <AlertTriangle size={16} color="#ffa502" />
                <span style={{ color: '#ffa502' }}>Moderate Risk</span>
              </>
            ) : (
              <>
                <CheckCircle size={16} color="#2ed573" />
                <span style={{ color: '#2ed573' }}>Low Risk</span>
              </>
            )}
          </div>
          
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        padding: '0 30px',
        borderBottom: '1px solid var(--border)',
        gap: '30px'
      }}>
        {['comparison', 'matches', 'details'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '15px 0',
              background: 'none',
              border: 'none',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text)',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: activeTab === tab ? '600' : '400',
              position: 'relative'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <motion.div
                layoutId="underline"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'var(--primary)',
                  borderRadius: '3px 3px 0 0'
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '30px',
        overflow: 'auto'
      }}>
        {activeTab === 'comparison' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            height: '100%'
          }}>
            {/* File 1 */}
            <div className="glass" style={{
              borderRadius: '12px',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                padding: '20px',
                background: 'rgba(0, 255, 157, 0.1)',
                borderBottom: '1px solid rgba(0, 255, 157, 0.2)'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {file1.name}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  {file1.student} • {file1.language}
                </div>
              </div>
              <div style={{
                flex: 1,
                padding: '20px',
                fontFamily: "'Courier New', monospace",
                fontSize: '14px',
                lineHeight: '1.8',
                overflow: 'auto',
                background: 'var(--card-bg)',
                color: 'var(--text)'
              }}>
                {file1.content.split('\n').map((line, i) => {
                  const isMatched = matchedLines.some(m => m.line1 === i + 1);
                  return (
                    <div key={i} style={{
                      display: 'flex',
                      marginBottom: '2px',
                      background: isMatched ? 'rgba(0, 255, 157, 0.1)' : 'transparent',
                      borderLeft: isMatched ? '3px solid var(--primary)' : 'none'
                    }}>
                      <div style={{
                        width: '40px',
                        textAlign: 'right',
                        paddingRight: '10px',
                        opacity: 0.5,
                        userSelect: 'none'
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        {line}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* File 2 */}
            <div className="glass" style={{
              borderRadius: '12px',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                padding: '20px',
                background: 'rgba(0, 149, 255, 0.1)',
                borderBottom: '1px solid rgba(0, 149, 255, 0.2)'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {file2.name}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  {file2.student} • {file2.language}
                </div>
              </div>
              <div style={{
                flex: 1,
                padding: '20px',
                fontFamily: "'Courier New', monospace",
                fontSize: '14px',
                lineHeight: '1.8',
                overflow: 'auto',
                background: 'var(--card-bg)',
                color: 'var(--text)'
              }}>
                {file2.content.split('\n').map((line, i) => {
                  const isMatched = matchedLines.some(m => m.line2 === i + 1);
                  return (
                    <div key={i} style={{
                      display: 'flex',
                      marginBottom: '2px',
                      background: isMatched ? 'rgba(0, 255, 157, 0.1)' : 'transparent',
                      borderLeft: isMatched ? '3px solid var(--primary)' : 'none'
                    }}>
                      <div style={{
                        width: '40px',
                        textAlign: 'right',
                        paddingRight: '10px',
                        opacity: 0.5,
                        userSelect: 'none'
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        {line}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="glass" style={{
            padding: '30px',
            borderRadius: '12px',
            height: '100%'
          }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>
              Matched Code Segments ({matchedLines.length})
            </h3>
            
            {matchedLines.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                {matchedLines.map((match, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr 80px 1fr',
                      gap: '20px',
                      padding: '20px',
                      background: 'var(--card-bg)',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      alignItems: 'center',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div style={{ textAlign: 'center', minWidth: '80px' }}>
                      <div style={{ opacity: 0.7, fontSize: '0.8rem', color: 'var(--text)' }}>File 1</div>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text)' }}>
                        Line {match.line1}
                      </div>
                    </div>
                    
                    <div style={{
                      padding: '12px',
                      background: 'rgba(var(--primary-rgb, 0, 255, 157), 0.05)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontFamily: "'Courier New', monospace",
                      fontSize: '0.9rem',
                      overflowX: 'auto',
                      color: 'var(--text)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all'
                    }}>
                      {match.content}
                    </div>
                    
                    <div style={{ textAlign: 'center', minWidth: '80px' }}>
                      <div style={{ opacity: 0.7, fontSize: '0.8rem', color: 'var(--text)' }}>File 2</div>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text)' }}>
                        Line {match.line2}
                      </div>
                    </div>
                    
                    <div style={{
                      padding: '12px',
                      background: 'rgba(var(--secondary-rgb, 0, 149, 255), 0.05)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontFamily: "'Courier New', monospace",
                      fontSize: '0.9rem',
                      overflowX: 'auto',
                      color: 'var(--text)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all'
                    }}>
                      {match.content}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: 'var(--text)',
                opacity: 0.7
              }}>
                No identical lines found in these files.
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '30px'
          }}>
            <div className="glass" style={{ padding: '30px', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>
                Analysis Details
              </h3>
              
              <div style={{
                display: 'grid',
                gap: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: '10px',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <span style={{ opacity: 0.7 }}>Algorithm</span>
                  <span>Winnowing (k=15, window=10)</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: '10px',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <span style={{ opacity: 0.7 }}>Hash Function</span>
                  <span>Rabin-Karp (base 257)</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: '10px',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <span style={{ opacity: 0.7 }}>Similarity Metric</span>
                  <span>Jaccard Index</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: '10px',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <span style={{ opacity: 0.7 }}>Match Threshold</span>
                  <span>25%</span>
                </div>
              </div>
            </div>

            <div className="glass" style={{ padding: '30px', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>
                Risk Assessment
              </h3>
              
              <div style={{
                padding: '20px',
                background: similarity > 70 ? 'rgba(255, 71, 87, 0.1)' : 
                           similarity > 40 ? 'rgba(255, 165, 2, 0.1)' : 'rgba(46, 213, 115, 0.1)',
                borderRadius: '8px',
                border: `1px solid ${similarity > 70 ? '#ff4757' : 
                         similarity > 40 ? '#ffa502' : '#2ed573'}`,
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  {similarity > 70 ? (
                    <AlertTriangle size={24} color="#ff4757" />
                  ) : similarity > 40 ? (
                    <AlertTriangle size={24} color="#ffa502" />
                  ) : (
                    <CheckCircle size={24} color="#2ed573" />
                  )}
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: similarity > 70 ? '#ff4757' : 
                           similarity > 40 ? '#ffa502' : '#2ed573'
                  }}>
                    {similarity > 70 ? 'HIGH RISK' : similarity > 40 ? 'MODERATE RISK' : 'LOW RISK'}
                  </div>
                </div>
                <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
                  {similarity > 70 
                    ? 'Significant code similarity detected. High probability of plagiarism.'
                    : similarity > 40
                    ? 'Moderate code similarity. Review recommended.'
                    : 'Low similarity. Likely coincidental matches.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DiffViewer;