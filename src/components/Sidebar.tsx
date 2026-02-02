import Link from 'next/link';

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">📊</div>
                <span className="logo-text">Assessment</span>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-group">
                    <p className="nav-label">เมนูหลัก</p>
                    <Link href="/" className="nav-item active">
                        <span className="nav-icon">🏠</span>
                        <span className="nav-text">หน้าหลัก</span>
                    </Link>
                    <Link href="#" className="nav-item">
                        <span className="nav-icon">📝</span>
                        <span className="nav-text">การประเมิน</span>
                        <span className="badge">2</span>
                    </Link>
                    <Link href="#" className="nav-item">
                        <span className="nav-icon">📊</span>
                        <span className="nav-text">ผลลัพธ์</span>
                    </Link>
                </div>

                <div className="nav-group">
                    <p className="nav-label">ส่วนตัว</p>
                    <Link href="#" className="nav-item">
                        <span className="nav-icon">👤</span>
                        <span className="nav-text">โปรไฟล์</span>
                    </Link>
                    <Link href="#" className="nav-item">
                        <span className="nav-icon">⚙️</span>
                        <span className="nav-text">ตั้งค่า</span>
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
