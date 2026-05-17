import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../styles/PDFExportButton.css';

const PDFExportButton = ({ reportData, title = "Plagiarism-X Analysis Report" }) => {
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
        
        try {
            const doc = new jsPDF();
            const reportId = generateReportId();
            const date = formatDate();
            const filename = `Plagiarism-Report-${reportId}.pdf`;

            // Theme Colors
            const primary = [0, 255, 157]; // #00ff9d
            const secondary = [0, 149, 255]; // #0095ff
            const bgDark = [10, 10, 15]; // #0a0a0f

            // Background Header
            doc.setFillColor(...bgDark);
            doc.rect(0, 0, 210, 40, 'F');

            // Title
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text("PLAGIARISM-X", 15, 25);

            // Report Info (Right Aligned)
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`ID: ${reportId}`, 195, 20, { align: 'right' });
            doc.text(`DATE: ${date}`, 195, 28, { align: 'right' });

            // Accent Line
            doc.setDrawColor(...primary);
            doc.setLineWidth(1);
            doc.line(0, 40, 210, 40);

            // Summary Section
            doc.setTextColor(50, 50, 50);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text("Analysis Summary", 15, 55);

            const stats = [
                ["Total Files Analyzed", reportData.files.length.toString()],
                ["High Risk Matches", reportData.files.filter((_, i) => 
                    reportData.similarities[i].some((s, j) => i !== j && s > 70)
                ).length.toString()],
                ["Average Similarity", (reportData.similarities.flat().filter((_, i) => i % reportData.files.length !== Math.floor(i / reportData.files.length))
                    .reduce((a, b) => a + b, 0) / (reportData.files.length * (reportData.files.length - 1)) || 0).toFixed(2) + "%"]
            ];

            const tableOptions = {
                startY: 62,
                head: [['Metric', 'Value']],
                body: stats,
                theme: 'striped',
                headStyles: { fillColor: bgDark, textColor: [255, 255, 255] },
                alternateRowStyles: { fillColor: [245, 245, 245] },
                margin: { left: 15, right: 15 }
            };

            if (typeof autoTable === 'function') {
                autoTable(doc, tableOptions);
            } else if (typeof doc.autoTable === 'function') {
                doc.autoTable(tableOptions);
            }

            // Detailed Findings
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            const findingsY = (doc.lastAutoTable?.finalY || 80) + 15;
            doc.text("Detailed Findings", 15, findingsY);

            const tableData = reportData.files.map((file, index) => {
                const maxSim = Math.max(...reportData.similarities[index].filter((_, i) => i !== index));
                const risk = maxSim > 70 ? "HIGH" : maxSim > 40 ? "MEDIUM" : "LOW";
                return [
                    file.name,
                    file.student,
                    file.fingerprints.toString(),
                    `${maxSim.toFixed(3)}%`,
                    risk
                ];
            });

            const findingsOptions = {
                startY: findingsY + 7,
                head: [['File Name', 'Student', 'Fingerprints', 'Max Sim', 'Risk']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: bgDark, textColor: [255, 255, 255] },
                columnStyles: {
                    3: { halign: 'center', fontStyle: 'bold' },
                    4: { halign: 'center', fontStyle: 'bold' }
                },
                didParseCell: (data) => {
                    if (data.section === 'body' && data.column.index === 4) {
                        const val = data.cell.raw;
                        if (val === 'HIGH') data.cell.styles.textColor = [255, 0, 0];
                        if (val === 'MEDIUM') data.cell.styles.textColor = [255, 165, 0];
                        if (val === 'LOW') data.cell.styles.textColor = [0, 128, 0];
                    }
                },
                margin: { left: 15, right: 15 }
            };

            if (typeof autoTable === 'function') {
                autoTable(doc, findingsOptions);
            } else if (typeof doc.autoTable === 'function') {
                doc.autoTable(findingsOptions);
            }

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(
                    `Plagiarism-X Quantum Analysis Engine • Page ${i} of ${pageCount}`,
                    105,
                    285,
                    { align: 'center' }
                );
            }

            // FINAL ROBUST FIX: Use the standard jsPDF save method
            // Now that autoTable is verified to be integrated correctly, this is the most reliable way.
            console.log(`Generating PDF report: ${filename}`);
            
            doc.save(filename);

            // Cleanup and feedback
            setTimeout(() => {
                setIsGenerating(false);
                showNotification('Report exported successfully!', 'success');
            }, 500);

        } catch (error) {
            console.error('CRITICAL PDF ERROR:', error);
            setIsGenerating(false);
            showNotification('Export failed. Please try again.', 'error');
        }
    };
    
    const showNotification = (message, type) => {
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
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    return (
        <button
            onClick={handleExportPDF}
            disabled={isGenerating}
            className="pdf-export-button"
            style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
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
                opacity: isGenerating ? 0.7 : 1,
                boxShadow: '0 4px 15px rgba(0, 255, 157, 0.2)'
            }}
        >
            {isGenerating ? "Generating..." : "Export as PDF"}
        </button>
    );
};

export default PDFExportButton;