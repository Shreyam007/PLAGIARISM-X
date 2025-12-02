// src/components/Dashboard/Dashboard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, FileCode, AlertTriangle, Download, Filter } from 'lucide-react';
import ForceGraph from '../ForceGraph/ForceGraph';
import DiffViewer from '../DiffViewer/DiffViewer';

const Dashboard = ({ results }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [filter, setFilter] = useState('all');

  const stats = {
    totalFiles: results.files.length,
    totalSimilarities: results.similarities.flat().filter(s => s > 70 && s < 100).length,
    highRisk: results.files.filter((_, i) => 
      results.similarities[i].some((s, j) => i !== j && s > 70)
    ).length,
    avgSimilarity: Math.round(
      results.similarities.flat().filter((_, i) => i % results.files.length !== Math.floor(i / results.files.length))
        .reduce((a, b) => a + b, 0) / (results.files.length * (results.files.length - 1))
    ) || 0
  };

  const graphData = {
    nodes: results.files.map(file => ({
      id: file.id,
      name: file.name,
      student: file.student,
      fingerprints: file.fingerprints,
      risk: results.similarities[file.id].some((s, i) => i !== file.id && s > 70) ? 'high' : 'low'
    })),
    edges: results.similarities.flatMap((row, i) =>
      row.map((similarity, j) => i !== j && similarity > 20 ? {
        from: i,
        to: j,
        similarity
      } : null).filter(Boolean)
    )
  };

  const handleNodeDoubleClick = (node1, node2) => {
    const file1 = results.files.find(f => f.id === node1);
    const file2 = results.files.find(f => f.id === node2);
    const similarity = results.similarities[node1][node2];
    setComparison({ file1, file2, similarity });
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px',
      maxWidth: '1600px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px'
        }}
      >
        <div>
          <h1 style={{
            fontSize: '2.5rem',
            background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            Plagiarism Analysis Dashboard
          </h1>
          <p style={{ opacity: 0.7 }}>
            {stats.totalFiles} files analyzed • {stats.highRisk} high-risk matches detected
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '12px 30px',
            background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <Download size={20} />
          EXPORT REPORT
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass"
          style={{
            padding: '25px',
            borderRadius: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(0, 255, 157, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileCode size={24} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>TOTAL FILES</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalFiles}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass"
          style={{
            padding: '25px',
            borderRadius: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(0, 149, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BarChart3 size={24} color="var(--secondary)" />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>AVG SIMILARITY</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.avgSimilarity}%</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass"
          style={{
            padding: '25px',
            borderRadius: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(255, 0, 230, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={24} color="var(--accent)" />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>HIGH RISK</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff4757' }}>{stats.highRisk}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass"
          style={{
            padding: '25px',
            borderRadius: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={24} color="var(--text)" />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>STUDENTS</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalFiles}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Force Graph */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass"
        style={{
          padding: '30px',
          borderRadius: '24px',
          marginBottom: '40px',
          height: '600px'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '1.8rem' }}>Similarity Network</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px'
            }}>
              <Filter size={16} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text)',
                  outline: 'none'
                }}
              >
                <option value="all">All Files</option>
                <option value="high">High Risk Only</option>
                <option value="similar">Similarity 50%</option>
              </select>
            </div>
          </div>
        </div>
        
        <div style={{ height: '500px' }}>
          <ForceGraph 
            nodes={graphData.nodes}
            edges={graphData.edges}
            onNodeClick={setSelectedFile}
          />
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          marginTop: '20px',
          fontSize: '0.9rem',
          opacity: 0.7
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00ff9d' }} />
            Low Risk
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff4757' }} />
            High Risk
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0095ff' }} />
            Connection Strength
          </div>
        </div>
      </motion.div>

      {/* Files List */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass"
        style={{
          padding: '30px',
          borderRadius: '24px'
        }}
      >
        <h2 style={{ fontSize: '1.8rem', marginBottom: '25px' }}>Detailed Analysis</h2>
        
        <div style={{
          display: 'grid',
          gap: '15px'
        }}>
          {results.files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                gap: '20px',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: '500', fontSize: '1.1rem' }}>{file.name}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '5px' }}>
                  {file.student} • {file.language}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Fingerprints</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{file.fingerprints}</div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Max Similarity</div>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: Math.max(...results.similarities[index].filter((_, i) => i !== index)) > 70 ? '#ff4757' : 
                         Math.max(...results.similarities[index].filter((_, i) => i !== index)) > 40 ? '#ffa502' : '#2ed573'
                }}>
                  {Math.max(...results.similarities[index].filter((_, i) => i !== index))}%
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Risk Level</div>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: results.similarities[index].some((s, i) => i !== index && s > 70) ? '#ff4757' : '#2ed573'
                }}>
                  {results.similarities[index].some((s, i) => i !== index && s > 70) ? 'HIGH' : 'LOW'}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const maxSimilarIndex = results.similarities[index].reduce((maxIdx, val, idx, arr) => 
                      idx !== index && val > arr[maxIdx] ? idx : maxIdx, 0
                    );
                    const otherFile = results.files.find(f => f.id === maxSimilarIndex);
                    setComparison({ file1: file, file2: otherFile, similarity: results.similarities[index][maxSimilarIndex] });
                  }}
                  style={{
                    padding: '8px 20px',
                    background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  COMPARE
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Diff Viewer Modal */}
      {comparison && (
        <DiffViewer 
          file1={comparison.file1}
          file2={comparison.file2}
          similarity={comparison.similarity}
          onClose={() => setComparison(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;