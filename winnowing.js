// src/algorithms/winnowing.js
export class Winnowing {
  constructor(k = 30, windowSize = 25) {
    this.k = k;
    this.windowSize = windowSize;
    this.base = 257; // Prime base for Rabin-Karp
    this.mod = 2 ** 32; // Modulo for hash
  }

  // Normalize code: remove comments, strings, whitespace, punctuation
  normalize(code) {
    return code
      // Remove single line comments
      .replace(/\/\/.*$/gm, '')
      // Remove multi-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove strings
      .replace(/"[^"]*"/g, '')
      .replace(/'[^']*'/g, '')
      // Remove special characters and extra whitespace
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  // Tokenize normalized code
  tokenize(normalizedCode) {
    return normalizedCode.split(' ').filter(token => token.length > 0);
  }

  // Generate k-gram hashes using Rabin-Karp
  generateHashes(tokens) {
    const hashes = [];
    
    for (let i = 0; i <= tokens.length - this.k; i++) {
      let hash = 0;
      // Create hash for k-gram starting at position i
      for (let j = 0; j < this.k; j++) {
        const token = tokens[i + j];
        for (let k = 0; k < token.length; k++) {
          hash = (hash * this.base + token.charCodeAt(k)) % this.mod;
        }
      }
      hashes.push({
        hash: hash,
        position: i,
        kgram: tokens.slice(i, i + this.k).join(' ')
      });
    }
    
    return hashes;
  }

  // Winnowing algorithm to select fingerprints
  winnow(hashes) {
    const fingerprints = [];
    const window = [];
    
    for (let i = 0; i < hashes.length; i++) {
      window.push(hashes[i]);
      
      // When window is full, select minimum hash
      if (window.length === this.windowSize) {
        let minHash = window[0];
        for (let j = 1; j < window.length; j++) {
          if (window[j].hash < minHash.hash) {
            minHash = window[j];
          }
        }
        
        // Add fingerprint if not duplicate
        if (!fingerprints.some(fp => fp.hash === minHash.hash && fp.position === minHash.position)) {
          fingerprints.push({
            hash: minHash.hash,
            position: minHash.position,
            kgram: minHash.kgram
          });
        }
        
        // Remove first element from window
        window.shift();
      }
    }
    
    return fingerprints;
  }

  // Main function: generate fingerprints from code
  generateFingerprints(code) {
    const normalized = this.normalize(code);
    const tokens = this.tokenize(normalized);
    
    if (tokens.length < this.k) {
      return []; // Not enough tokens
    }
    
    const hashes = this.generateHashes(tokens);
    const fingerprints = this.winnow(hashes);
    
    return fingerprints;
  }
}

// Calculate Jaccard similarity between two sets of fingerprints
export function jaccardSimilarity(fingerprints1, fingerprints2) {
  if (fingerprints1.length === 0 || fingerprints2.length === 0) {
    return 0;
  }
  
  const set1 = new Set(fingerprints1.map(fp => fp.hash));
  const set2 = new Set(fingerprints2.map(fp => fp.hash));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return (intersection.size / union.size) * 100;
}

// Compare multiple files
export function compareFiles(files, k = 30, window = 25) {
  const winnowing = new Winnowing(k, window);
  const results = {
    files: [],
    similarities: []
  };
  
  // Generate fingerprints for each file
  files.forEach(file => {
    const fingerprints = winnowing.generateFingerprints(file.content);
    results.files.push({
      ...file,
      fingerprints: fingerprints.length
    });
  });
  
  // Calculate similarity matrix
  const similarityMatrix = [];
  for (let i = 0; i < files.length; i++) {
    similarityMatrix[i] = [];
    const fp1 = winnowing.generateFingerprints(files[i].content);
    
    for (let j = 0; j < files.length; j++) {
      if (i === j) {
        similarityMatrix[i][j] = 100; // Same file
      } else {
        const fp2 = winnowing.generateFingerprints(files[j].content);
        similarityMatrix[i][j] = jaccardSimilarity(fp1, fp2);
      }
    }
  }
  
  results.similarities = similarityMatrix;
  return results;
}