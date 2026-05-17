// src/algorithms/winnowing.js
export class Winnowing {
  constructor(k = 12, windowSize = 8) {
    this.k = k;
    this.windowSize = windowSize;
    this.base = 257; // Prime base for Rabin-Karp
    this.mod = 2 ** 32; // Modulo for hash
  }

  // Normalize code: remove comments, strings, whitespace, punctuation
  normalize(code) {
    if (!code) return '';
    return code
      // Remove single line comments
      .replace(/\/\/.*$/gm, '')
      // Remove multi-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove strings (but keep placeholder to maintain structure)
      .replace(/"[^"]*"/g, '" "')
      .replace(/'[^']*'/g, "' '")
      // Remove all special characters, punctuation, and extra whitespace
      .replace(/[^\w]/g, ' ')
      .replace(/\s+/g, '')
      .trim()
      .toLowerCase();
  }

  // Tokenize normalized code
  tokenize(normalizedCode) {
    // Since we stripped whitespace for "true" structure matching,
    // we generate k-grams by sliding through the string.
    return normalizedCode.split('');
  }

  // Generate k-gram hashes using Rabin-Karp
  generateHashes(tokens) {
    const hashes = [];
    
    for (let i = 0; i <= tokens.length - this.k; i++) {
      let hash = 0;
      // Create hash for k-gram starting at position i
      for (let j = 0; j < this.k; j++) {
        hash = (hash * this.base + tokens[i + j].charCodeAt(0)) % this.mod;
      }
      hashes.push({
        hash: hash,
        position: i,
        kgram: tokens.slice(i, i + this.k).join('')
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

// Calculate direct line-by-line similarity for boilerplate/standard code
export function calculateLineSimilarity(content1, content2) {
  // We use a more relaxed filter for line similarity to catch boilerplate like #include
  const filterLine = (l) => l.trim().length >= 5;
  const lines1 = content1.split('\n').map(l => l.trim()).filter(filterLine);
  const lines2 = content2.split('\n').map(l => l.trim()).filter(filterLine);
  
  if (lines1.length === 0 || lines2.length === 0) return 0;
  
  const set1 = new Set(lines1);
  const set2 = new Set(lines2);
  
  const intersectionSize = [...set1].filter(line => set2.has(line)).length;
  const unionSize = new Set([...set1, ...set2]).size;
  
  return (intersectionSize / unionSize) * 100;
}

// Compare multiple files using a hybrid approach (Structural Winnowing + Textual Line Match)
export function compareFiles(files, k = 12, windowSize = 8) {
  const winnowing = new Winnowing(k, windowSize);
  const results = {
    files: [],
    similarities: []
  };
  
  // 1. Generate fingerprints for all files first
  const fileFingerprints = files.map(file => winnowing.generateFingerprints(file.content));

  // 2. Prepare file metadata
  results.files = files.map((file, i) => ({
    ...file,
    id: i,
    fingerprints: fileFingerprints[i].length
  }));
  
  // 3. Calculate hybrid similarity matrix
  const similarityMatrix = [];
  for (let i = 0; i < files.length; i++) {
    similarityMatrix[i] = [];
    
    for (let j = 0; j < files.length; j++) {
      if (i === j) {
        similarityMatrix[i][j] = 100; // Same file
      } else {
        const structuralSim = jaccardSimilarity(fileFingerprints[i], fileFingerprints[j]);
        const textualSim = calculateLineSimilarity(files[i].content, files[j].content);
        
        // Final Score: Weighted hybrid approach
        // We prioritize structural similarity but ensure textual boilerplate contributes
        let hybridScore = 0;
        if (structuralSim > 0) {
          // If structure matches (logic is similar), use it as base and add small textile bonus
          hybridScore = (structuralSim * 0.7) + (textualSim * 0.3);
        } else {
          // If no structural match (files are too different or too small), use line match
          // This ensures that even if only #includes match, the user sees > 0%
          hybridScore = textualSim;
        }

        // Round to 3 decimal places for consistent display
        similarityMatrix[i][j] = Number(Math.min(100, hybridScore).toFixed(3));
      }
    }
  }
  
  results.similarities = similarityMatrix;
  return results;
}