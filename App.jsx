// src/App.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './components/ThemeToggle';
import Hero from './components/Hero/Hero';
import DragDrop from './components/DragDrop/DragDrop';
import Scanner from './components/Scanner/Scanner';
import Dashboard from './components/Dashboard/Dashboard';
import './styles/futuristic.css';

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
      'txt': 'Text'
    };
    return languages[ext] || 'Unknown';
  };

  // Function to read actual file content
  const generateResultsFromFiles = (files) => {
    const filePromises = files.map((file, i) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: i,
            name: file.name,
            student: `Student ${i + 1}`,
            language: getLanguageFromExtension(file.name),
            fingerprints: Math.floor(Math.random() * 1000) + 500,
            content: e.target.result // ACTUAL FILE CONTENT
          });
        };
        reader.readAsText(file);
      });
    });

    return Promise.all(filePromises).then((fileData) => {
      // Calculate similarities (in real app, this would use the algorithms)
      const similarities = Array.from({ length: files.length }, (_, i) =>
        Array.from({ length: files.length }, (_, j) => 
          i === j ? 100 : Math.floor(Math.random() * 80)
        )
      );
      
      return {
        files: fileData,
        similarities
      };
    });
  };

  const handleFileDrop = (droppedFiles) => {
    setFiles(droppedFiles);
    setCurrentView('scanner');
    setScanning(true);
    
    // Read files and generate results
    generateResultsFromFiles(droppedFiles).then((results) => {
      setResults(results);
      setScanning(false);
      setCurrentView('dashboard');
    }).catch((error) => {
      console.error('Error reading files:', error);
      // Fallback to mock data if file reading fails
      setResults(generateMockResults(droppedFiles));
      setScanning(false);
      setCurrentView('dashboard');
    });
  };

  // Fallback function in case file reading fails
  const generateMockResults = (files) => {
    return {
      files: files.map((file, i) => ({
        id: i,
        name: file.name,
        student: `Student ${i + 1}`,
        language: getLanguageFromExtension(file.name),
        fingerprints: Math.floor(Math.random() * 1000) + 500,
        content: `// Actual content of ${file.name}\n// This file contains code that will be analyzed for plagiarism.\n// The real content will be displayed when file reading works properly.\n\nfunction sampleFunction() {\n    return "This is a sample from " + "${file.name}";\n}`
      })),
      similarities: Array.from({ length: files.length }, (_, i) =>
        Array.from({ length: files.length }, (_, j) => 
          i === j ? 100 : Math.floor(Math.random() * 80)
        )
      )
    };
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
            <Hero onStart={() => setCurrentView('dragdrop')} />
          </motion.div>
        )}

        {currentView === 'dragdrop' && (
          <motion.div
            key="dragdrop"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <DragDrop onFilesDrop={handleFileDrop} />
          </motion.div>
        )}

        {currentView === 'scanner' && (
          <motion.div
            key="scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Scanner files={files} scanning={scanning} />
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
      </AnimatePresence>
    </div>
  );
}

export default App;