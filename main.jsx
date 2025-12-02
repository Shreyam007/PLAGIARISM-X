import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/futuristic.css';

// Remove loading animation when app loads
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    const loading = document.querySelector('.loading');
    if (loading) {
      loading.style.opacity = '0';
      setTimeout(function() {
        if (loading.parentNode) {
          loading.remove();
        }
      }, 300);
    }
  }, 1000);
});

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);