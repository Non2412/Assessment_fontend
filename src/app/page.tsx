"use client";

export default function Home() {


  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();

    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.width = ripple.style.height = '100px';
    // Calculate position relative to the button
    ripple.style.left = e.clientX - rect.left - 50 + 'px';
    ripple.style.top = e.clientY - rect.top - 50 + 'px';
    ripple.style.animation = 'ripple 0.6s ease-out';

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <>
      {/* Animated Background */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Hero Banner Section */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">“การมีคนเข้าใจเป็นอะไรที่รู้สึกดีมากเลย”</h1>
          <p className="hero-subtitle">
            เพียง 10 นาทีในการรู้ถึงคำอธิบายเกี่ยวกับตัวตนของคุณและเหตุผลที่คุณทำสิ่งต่าง ๆ <br />
            “ที่แม่นยำจนคุณต้องแปลกใจ”
          </p>
          <button className="hero-btn" onClick={handleRipple}>
            ทำแบบทดสอบ <span>→</span>
          </button>
        </div>

        {/* Floating Visuals (Right Side) */}
        <div className="hero-visuals">
          <div className="floating-card float-1">
            <span className="float-icon icon-yellow">💡</span>
            <div className="float-text">
              <strong>ค้นหาจุดแข็ง</strong>
              <span>รู้ศักยภาพที่ซ่อนอยู่</span>
            </div>
          </div>
          <div className="floating-card float-2">
            <span className="float-icon icon-red">🎯</span>
            <div className="float-text">
              <strong>เป้าหมายชัดเจน</strong>
              <span>วางแผนอนาคตได้ชัดเจน</span>
            </div>
          </div>
          <div className="floating-card float-3">
            <span className="float-icon icon-pink">🧠</span>
            <div className="float-text">
              <strong>วิเคราะห์ตนเอง</strong>
              <span>เข้าใจตัวเองอย่างถ่องแท้</span>
            </div>
          </div>

          {/* Floating Visuals (Left Side - New) */}
          <div className="floating-card float-left-1">
            <span className="float-icon icon-yellow">📈</span>
            <div className="float-text">
              <strong>พัฒนาตนเอง</strong>
              <span>ปรับปรุงตัวเองได้ชัดเจน</span>
            </div>
          </div>
          <div className="floating-card float-left-2">
            <span className="float-icon icon-red">🏫</span>
            <div className="float-text">
              <strong>พัฒนาหลักสูตร</strong>
              <span>ช่วยปรับปรุงการเรียนการสอน</span>
            </div>
          </div>
          <div className="floating-card float-left-3">
            <span className="float-icon icon-pink">🎁</span>
            <div className="float-text">
              <strong>รับสิทธิพิเศษ</strong>
              <span>แลกของรางวัลมากมาย</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
