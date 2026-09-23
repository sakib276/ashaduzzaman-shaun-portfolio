import React, { useRef } from 'react';

export default function Footer({ profileName = "Ashaduzzaman Shaun", onToggleView }) {
  const currentYear = new Date().getFullYear();
  const clickCount = useRef(0);
  const clickTimer = useRef(null);

  const handleHiddenAdminClick = () => {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);

    if (clickCount.current >= 3) {
      clickCount.current = 0;
      if (onToggleView) {
        onToggleView('admin');
      } else {
        window.location.hash = '#admin';
      }
    } else {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 1000);
    }
  };

  return (
    <footer>
      <div className="container">
        <p>
          <span
            onClick={handleHiddenAdminClick}
            style={{ cursor: 'pointer', userSelect: 'none' }}
            title=""
          >
            ©
          </span>{' '}
          <span id="current-year">{currentYear}</span> {profileName}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
