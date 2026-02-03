"use client";
import styles from './style.module.css';

export default function AssessmentPage() {
    // Mock data for available assessments
    const availableAssessments = [
        { id: 1, title: 'แบบประเมินความพึงพอใจ', description: 'แบบประเมินสำหรับ Web Development Class', status: 'Open' },
        { id: 2, title: 'แบบทดสอบก่อนเรียน', description: 'วัดความรู้พื้นฐาน React', status: 'Closed' }
    ];

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1e293b' }}>
                แบบประเมินที่เปิดให้ทำ
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {availableAssessments.map((assessment) => (
                    <div key={assessment.id} style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{ fontSize: '40px', marginBottom: '16px' }}>📝</div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#0f172a' }}>
                            {assessment.title}
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                            {assessment.description}
                        </p>
                        <button style={{
                            width: '100%',
                            padding: '10px',
                            background: '#059669',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}>
                            ทำแบบประเมิน
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
