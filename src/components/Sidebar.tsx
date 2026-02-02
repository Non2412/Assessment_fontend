"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path ? 'active' : '';

    const completedCount = 0; // Mock data for completed assessments

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">📊</div>
                <span className="logo-text">Assessment</span>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-group">
                    <p className="nav-label">เมนูหลัก</p>
                    <Link href="/" className={`nav-item ${isActive('/')}`}>
                        <span className="nav-icon">🏠</span>
                        <span className="nav-text">หน้าหลัก</span>
                    </Link>
                    <Link href="/assessment" className="nav-item">
                        <span className="nav-icon">📝</span>
                        <span className="nav-text">การประเมิน</span>
                    </Link>
                    <Link href="/results" className={`nav-item ${isActive('/results')}`}>
                        <span className="nav-icon">📊</span>
                        <span className="nav-text">ผลลัพธ์</span>
                        {completedCount > 0 && (
                            <span className="badge">{completedCount}</span>
                        )}
                    </Link>
                </div>
            </nav>
            <div className="sidebar-footer">
                <div className="user-card">
                    <div className="user-avatar">น</div>
                    <div className="user-info">
                        <p className="user-name">นักเรียน</p>
                        <p className="user-role">Student</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
