// src/App.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './components/ThemeToggle';
import Hero from './components/Hero/Hero';
import DragDrop from './components/DragDrop/DragDrop';
import Scanner from './components/Scanner/Scanner';
import Dashboard from './components/Dashboard/Dashboard';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';
import './styles/futuristic.css';
import { compareFiles } from './algorithms/winnowing.js';
import * as mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {
  const [theme, setTheme] = useState('dark');
  const [files, setFiles] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [currentView, setCurrentView] = useState('hero');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Helper function to detect language from file extension
  const getLanguageFromExtension = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const languages = {
      'js': 'JavaScript',
      'jsx': 'JavaScript',
      'ts': 'TypeScript',
      'tsx': 'TypeScript',
      'py': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'cs': 'C#',
      'php': 'PHP',
      'rb': 'Ruby',
      'go': 'Go',
      'rs': 'Rust',
      'swift': 'Swift',
      'kt': 'Kotlin',
      'scala': 'Scala',
      'html': 'HTML',
      'css': 'CSS',
      'json': 'JSON',
      'xml': 'XML',
      'txt': 'Text',
      'pdf': 'PDF',
      'docx': 'Word (DOCX)'
    };
    return languages[ext] || 'Unknown';
  };

  // Function to read actual file content and use real algorithm
  const generateResultsFromFiles = (droppedFiles) => {
    const filePromises = droppedFiles.map((file, i) => {
      return new Promise((resolve, reject) => {
        const ext = file.name.split('.').pop().toLowerCase();
        
        if (ext === 'docx') {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
              resolve({
                id: i,
                name: file.name,
                student: `Student ${i + 1}`,
                language: 'Word (DOCX)',
                content: result.value
              });
            } catch (err) {
              reject(err);
            }
          };
          reader.readAsArrayBuffer(file);
        } else if (ext === 'pdf') {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const typedarray = new Uint8Array(e.target.result);
              const pdf = await pdfjs.getDocument(typedarray).promise;
              let content = '';
              for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                content += pageText + '\n';
              }
              resolve({
                id: i,
                name: file.name,
                student: `Student ${i + 1}`,
                language: 'PDF',
                content: content
              });
            } catch (err) {
              reject(err);
            }
          };
          reader.readAsArrayBuffer(file);
        } else {
          // Standard text-based files
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              id: i,
              name: file.name,
              student: `Student ${i + 1}`,
              language: getLanguageFromExtension(file.name),
              content: e.target.result
            });
          };
          reader.onerror = reject;
          reader.readAsText(file);
        }
      });
    });

    return Promise.all(filePromises).then((fileData) => {
      // Use real Winnowing comparison instead of random
      const realResults = compareFiles(fileData.map(f => ({
        name: f.name,
        content: f.content
      })));

      // Merge with fileData (add fingerprints count)
      const mergedFiles = fileData.map((f, i) => ({
        ...f,
        fingerprints: realResults.files[i]?.fingerprints || 0
      }));

      return {
        files: mergedFiles,
        similarities: realResults.similarities
      };
    });
  };

  const handleFileDrop = (droppedFiles) => {
    setFiles(droppedFiles);
  };

  const handleStartAnalysis = () => {
    if (files.length === 0) return;
    
    setCurrentView('scanner');
    setScanning(true);
    
    // 1. Start generation in background
    generateResultsFromFiles(files).then((generatedResults) => {
      setResults(generatedResults);
      // We don't change view here anymore; Scanner will tell us when it's done
    }).catch((error) => {
      console.error('Error processing files:', error);
      setScanning(false);
      setCurrentView('dragdrop');
    });
  };

  const handleScannerComplete = () => {
    setScanning(false);
    setCurrentView('dashboard');
  };

  return (
    <div className="app-container">
      <ThemeToggle theme={theme} setTheme={setTheme} />
      
      <AnimatePresence mode="wait">
        {currentView === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero 
              onStart={() => setCurrentView('dragdrop')} 
              onOpenPolicy={() => setCurrentView('policy')}
            />
          </motion.div>
        )}

        {currentView === 'dragdrop' && (
          <motion.div
            key="dragdrop"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <DragDrop onFilesDrop={handleFileDrop} onStartAnalysis={handleStartAnalysis} />
          </motion.div>
        )}

        {currentView === 'scanner' && (
          <motion.div
            key="scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Scanner files={files} onComplete={handleScannerComplete} />
          </motion.div>
        )}

        {currentView === 'dashboard' && results && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Dashboard results={results} />
          </motion.div>
        )}

        {currentView === 'policy' && (
          <motion.div
            key="policy"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <PrivacyPolicy onBack={() => setCurrentView('hero')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;