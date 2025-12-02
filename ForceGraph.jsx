// src/components/ForceGraph/ForceGraph.jsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Link } from 'lucide-react';

const ForceGraph = ({ nodes, edges, onNodeClick }) => {
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      {/* Simplified visualization for now */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '300px',
            height: '300px',
            border: '2px dashed rgba(0, 255, 157, 0.3)',
            borderRadius: '50%',
            position: 'relative'
          }}
        >
          {nodes.map((node, i) => {
            const angle = (i / nodes.length) * 2 * Math.PI;
            const radius = 150;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            return (
              <motion.div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: node.risk === 'high' 
                    ? 'linear-gradient(45deg, #ff4757, #ff6b81)' 
                    : 'linear-gradient(45deg, var(--primary), var(--secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px currentColor'
                }}
                whileHover={{ scale: 1.2 }}
                onClick={() => onNodeClick(node.id)}
                title={`${node.name} - ${node.student}`}
              >
                <Users size={20} color="white" />
              </motion.div>
            );
          })}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            marginTop: '30px',
            fontSize: '1.2rem',
            color: 'var(--text)',
            opacity: 0.8
          }}
        >
          <Link size={24} style={{ marginBottom: '10px' }} />
          <div>Interactive 3D Graph</div>
          <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>
            {nodes.length} nodes • {edges.length} connections
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForceGraph;