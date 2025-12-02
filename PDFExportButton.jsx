import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import './PDFExportButton.css';

const PDFExportButton = ({ reportData, title = "Plagiarism Analysis Report" }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const generateReportId = () => {
        return 'PLG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    };

    const formatDate = () => {
        const now = new Date();
        return now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleExportPDF = () => {
        setIsGenerating(true);
        
        // Get the element to export
        const element = document.getElementById('plagiarism-report-content');
        
        // If element doesn't exist, create a temporary one
        if (!element) {
            console.error('Report content element not found');
            setIsGenerating(false);
            return;
        }
        
        // PDF options
        const options = {
            margin: [15, 15, 15, 15],
            filename: `plagiarism-x-report-${generateReportId()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#0a0a0f'
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            }
        };
        
        // Generate PDF
        html2pdf()
            .set(options)
            .from(element)
            .save()
            .then(() => {
                setIsGenerating(false);
                showNotification('PDF exported successfully!', 'success');
            })
            .catch((error) => {
                console.error('PDF generation error:', error);
                setIsGenerating(false);
                showNotification('Failed to export PDF. Please try again.', 'error');
            });
    };
    
    const showNotification = (message, type) => {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `pdf-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            background: ${type === 'success' ? '#00ff9d' : '#ff4757'};
            color: #0a0a0f;
            font-weight: 600;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        // Add CSS for animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
                if (style.parentNode) {
                    style.remove();
                }
            }, 300);
        }, 3000);
    };

    return (
        <button
            onClick={handleExportPDF}
            disabled={isGenerating}
            className="pdf-export-button"
            style={{
                background: 'linear-gradient(135deg, #00ff9d 0%, #00b8ff 100%)',
                color: '#0a0a0f',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                opacity: isGenerating ? 0.7 : 1
            }}
        >
            {isGenerating ? (
                <>
                    <div className="spinner"></div>
                    Generating PDF...
                </>
            ) : (
                <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 9H15V3H9V9H5L12 16L19 9Z" fill="currentColor"/>
                        <path d="M5 18V20H19V18H5Z" fill="currentColor"/>
                    </svg>
                    Export as PDF
                </>
            )}
        </button>
    );
};

export default PDFExportButton;