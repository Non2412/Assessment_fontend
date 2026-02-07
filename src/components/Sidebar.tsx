"use client";
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter(); // Need to import useRouter
    const [user, setUser] = useState<any>(null);
    const [completedCount, setCompletedCount] = useState(0);

    const checkUser = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);

                // Check completed count for this user
                const userId = userData.id || userData.username;
                const storageKey = `completed_assessments_${userId}`;
                const completedList = JSON.parse(localStorage.getItem(storageKey) || '[]');
                setCompletedCount(completedList.length);

            } catch (e) {
                console.error("Error parsing user data", e);
                setUser(null);
                setCompletedCount(0);
            }
        } else {
            setUser(null);
            setCompletedCount(0);
        }
    };

    useEffect(() => {
        checkUser();
        window.addEventListener('auth-change', checkUser);
        window.addEventListener('storage', checkUser); // Also listen for cross-tab storage changes
        return () => {
            window.removeEventListener('auth-change', checkUser);
            window.removeEventListener('storage', checkUser);
        };
    }, []);

    // Re-check on navigation
    useEffect(() => {
        checkUser();
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.dispatchEvent(new Event('auth-change'));
        router.push('/login');
    };

    const isActive = (path: string) => pathname === path ? 'active' : '';



    return (
        <aside className="sidebar">
            <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <NextImage
                    src="/logo.jpg"
                    alt="Assessment Logo"
                    width={220}
                    height={100}
                    style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
                    priority
                    quality={100}
                />
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

            <div className="sidebar-bottom-profile">
                {user ? (
                    <>
                        {/* User Profile */}
                        <div className="user-profile-card">
                            <div className="avatar-wrapper">
                                <div className="user-avatar-lg">{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</div>
                                <div className="avatar-status"></div>
                            </div>
                            <div className="user-info">
                                <p className="user-name">{user.username || 'User'}</p>
                                <p className="user-role">{user.role || 'Member'}</p>
                            </div>
                        </div>

                        {/* Vertical Stats Links */}
                        <div className="profile-stats">
                            <div className="p-stat-row">
                                <span className="p-icon">🛍️</span>
                                <span className="p-text">ประเมินแล้ว: {completedCount}</span>
                                <span className="status-dot green"></span>
                            </div>
                            <button onClick={handleLogout} className="logout-btn">
                                ออกจากระบบ
                            </button>
                        </div>
                    </>
                ) : (
                    <Link href="/login" className="login-btn-sidebar">
                        <span>🔐</span> เข้าสู่ระบบ
                    </Link>
                )}
            </div>
        </aside>
    );
}
