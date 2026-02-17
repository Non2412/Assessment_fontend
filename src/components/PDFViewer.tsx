"use client";
import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF worker
if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
}

interface PDFViewerProps {
    fileData: string; // Base64 or Data URL
    title?: string;
}

export default function PDFViewer({ fileData, title }: PDFViewerProps) {
    const [pages, setPages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (!fileData) {
            setError('No PDF data provided');
            setLoading(false);
            return;
        }

        const renderPDF = async () => {
            try {
                setLoading(true);
                setError(null);

                // Convert data URL to Uint8Array
                let pdfData: Uint8Array;

                if (fileData.startsWith('data:')) {
                    // Data URL format
                    const base64 = fileData.split(',')[1];
                    const binary = atob(base64);
                    const length = binary.length;
                    pdfData = new Uint8Array(length);
                    for (let i = 0; i < length; i++) {
                        pdfData[i] = binary.charCodeAt(i);
                    }
                } else {
                    // Plain base64
                    const binary = atob(fileData);
                    const length = binary.length;
                    pdfData = new Uint8Array(length);
                    for (let i = 0; i < length; i++) {
                        pdfData[i] = binary.charCodeAt(i);
                    }
                }

                // Load PDF
                const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
                setTotalPages(pdf.numPages);

                // Render first 5 pages for preview (to avoid memory issues)
                const renderedPages: string[] = [];
                const maxPages = Math.min(5, pdf.numPages);

                for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const viewport = page.getViewport({ scale: 1.5 });

                    // Create canvas
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    if (!context) throw new Error('Could not get canvas context');

                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    // Render page
                    await page.render({
                        canvasContext: context,
                        viewport: viewport,
                    }).promise;

                    // Convert to data URL
                    const imageData = canvas.toDataURL('image/png');
                    renderedPages.push(imageData);
                }

                setPages(renderedPages);
                setCurrentPage(1);
            } catch (err: any) {
                console.error('Error rendering PDF:', err);
                setError(err.message || 'Failed to render PDF');
            } finally {
                setLoading(false);
            }
        };

        renderPDF();
    }, [fileData]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '500px',
                background: '#f0f0f0',
                borderRadius: '8px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>📄</div>
                    <p>กำลังโหลด PDF...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '500px',
                background: '#fee',
                borderRadius: '8px',
                color: '#c33'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
                    <p>ไม่สามารถเปิด PDF ได้</p>
                    <p style={{ fontSize: '12px', marginTop: '10px' }}>{error}</p>
                </div>
            </div>
        );
    }

    if (pages.length === 0) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '500px',
                background: '#f0f0f0',
                borderRadius: '8px'
            }}>
                <p>ไม่มีหน้าใดที่จะแสดง</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* PDF Viewer */}
            <div style={{
                flex: 1,
                overflow: 'auto',
                background: '#e0e0e0',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px'
            }}>
                <img
                    src={pages[currentPage - 1]}
                    alt={`Page ${currentPage}`}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                />
            </div>

            {/* Navigation */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '16px',
                padding: '12px',
                background: '#f5f5f5',
                borderRadius: '8px'
            }}>
                <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    style={{
                        padding: '8px 16px',
                        background: currentPage === 1 ? '#ccc' : '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                >
                    ← ก่อนหน้า
                </button>

                <span style={{ color: '#666', fontSize: '14px' }}>
                    หน้า {currentPage} / {Math.min(totalPages, pages.length)}
                    {totalPages > pages.length && ` (แสดง ${pages.length} หน้าแรก)`}
                </span>

                <button
                    onClick={() => setCurrentPage(prev => Math.min(pages.length, prev + 1))}
                    disabled={currentPage === pages.length}
                    style={{
                        padding: '8px 16px',
                        background: currentPage === pages.length ? '#ccc' : '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: currentPage === pages.length ? 'not-allowed' : 'pointer'
                    }}
                >
                    ถัดไป →
                </button>
            </div>
        </div>
    );
}
