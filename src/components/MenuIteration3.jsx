import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuIteration3.css';

function MenuIteration3() {
  // State to track menu activation
  const [isActive, setIsActive] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState(null);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [showPointer, setShowPointer] = useState(false);
  const menuRef = useRef(null);
  const mainButtonRef = useRef(null);
  const navigate = useNavigate();
  
  // Navigation menu items with minimal icons
  const navItems = [
    { id: 1, label: "Home", path: "/", icon: "○" },
    { id: 2, label: "About", path: "/about", icon: "◇" },
    { id: 3, label: "Contact", path: "/contact", icon: "△" },
    { id: 4, label: "Playground", path: "/playground", icon: "◯" }
  ];
  
  // Use state for points to ensure they update properly after navigation
  const [menuPoints, setMenuPoints] = useState(null);
  
  // Handle press start (both mouse and touch)
  const handlePressStart = (e) => {
    e.preventDefault();
    setIsActive(true);
    
    const isTouchEvent = e.type.startsWith('touch');
    if (isTouchEvent) {
      if (e.touches && e.touches.length > 0) {
        setPointerPosition({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        });
        setShowPointer(true);
      }
    }
  };
  
  // Handle press end (both mouse and touch)
  const handlePressEnd = (e) => {
    e.preventDefault();
    
    if (hoveredNavItem) {
      console.log(`Navigating to: ${hoveredNavItem.path}`);
      navigate(hoveredNavItem.path);
    }
    
    setIsActive(false);
    setHoveredNavItem(null);
    setShowPointer(false);
  };
  
  // Handle mouse/touch leaving the menu area
  const handleLeave = () => {
    setIsActive(false);
    setHoveredNavItem(null);
    setShowPointer(false);
  };
  
  // Handle pointer entering a nav item
  const handleNavItemEnter = (item) => {
    if (isActive) {
      setHoveredNavItem(item);
    }
  };
  
  // Handle pointer leaving a nav item
  const handleNavItemLeave = () => {
    setHoveredNavItem(null);
  };
  
  // Update pointer position based on event coordinates
  const updatePointerPosition = (e) => {
    const isTouchEvent = e.type.startsWith('touch');
    
    if (isTouchEvent && e.touches && e.touches.length > 0) {
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      
      setPointerPosition({
        x: clientX,
        y: clientY
      });
    } else if (!isTouchEvent) {
      setPointerPosition({
        x: e.clientX,
        y: e.clientY
      });
    }
  };
  
  // Handle touch move to detect when user slides to nav items
  const handleTouchMove = (e) => {
    if (!isActive) return;
    
    e.preventDefault();
    
    if (e.touches && e.touches.length > 0) {
      setPointerPosition({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
      
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS && !showPointer) {
        setShowPointer(true);
      }
    }
    
    const touch = e.touches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    
    const navButtons = document.querySelectorAll('.nav-button-iteration3');
    let foundHovered = null;
    
    navButtons.forEach((button, index) => {
      const rect = button.getBoundingClientRect();
      if (
        touchX >= rect.left && 
        touchX <= rect.right && 
        touchY >= rect.top && 
        touchY <= rect.bottom
      ) {
        foundHovered = navItems[index];
      }
    });
    
    setHoveredNavItem(foundHovered);
  };
  
  // Add global event listeners
  useEffect(() => {
    const handleGlobalEnd = () => {
      setIsActive(false);
      setHoveredNavItem(null);
      setShowPointer(false);
    };
    
    document.addEventListener('mouseup', handleGlobalEnd);
    document.addEventListener('touchend', handleGlobalEnd);
    
    const preventContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', preventContextMenu);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalEnd);
      document.removeEventListener('touchend', handleGlobalEnd);
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);
  
  // Prevent scrolling when menu is active
  useEffect(() => {
    const preventScroll = (e) => {
      if (isActive) {
        e.preventDefault();
      }
    };
    
    if (isActive) {
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('wheel', preventScroll, { passive: false });
    }
    
    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('wheel', preventScroll);
    };
  }, [isActive]);
  
  // Prevent text selection when menu is active
  useEffect(() => {
    if (isActive) {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.msUserSelect = 'none';
      document.body.style.mozUserSelect = 'none';
    } else {
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.msUserSelect = '';
      document.body.style.mozUserSelect = '';
    }
  }, [isActive]);
  
  // Detect iOS Safari
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // Calculate nav item positions with perfect spacing
  function calculateNavItemOriginPoints(cx, cy, r, n, arcLength, startAngle = null) {
    if (startAngle === null) {
      const totalAngleSpan = (n - 1) * (arcLength / r);
      startAngle = Math.PI - totalAngleSpan / 2 + Math.PI/2;
    }
    
    const dTheta = arcLength / r;
    const points = [];
    for (let i = 0; i < n; i++) {
      const theta = startAngle + i * dTheta;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      points.push({ x, y });
    }
    return points;
  }

  // Calculate points with minimalist spacing
  useEffect(() => {
    const pts = calculateNavItemOriginPoints(0, 0, 95, navItems.length, 80);
    setMenuPoints(pts);
  }, [navItems.length, isActive]);
  
  return (
    <>
      {/* Subtle backdrop with minimal styling */}
      <div 
        className={`menu-backdrop-iteration3 ${isActive ? 'active' : ''}`} 
        onMouseUp={handleLeave}
        onTouchEnd={handleLeave}
      />
      
      <div 
        className="menu-container-iteration3" 
        ref={menuRef}
        onMouseLeave={handleLeave}
        onTouchMove={handleTouchMove}
        onTouchCancel={handleLeave}
        onMouseMove={updatePointerPosition}
      >
        {/* Minimal touch pointer */}
        {isIOS && (
          <div 
            className="touch-pointer-iteration3"
            style={{ 
              left: `${pointerPosition.x}px`, 
              top: `${pointerPosition.y}px`,
              display: showPointer ? 'block' : 'none'
            }}
          />
        )}
        
        {/* Main button with floating design */}
        <button
          ref={mainButtonRef}
          className={`main-button-iteration3 ${isActive ? 'active' : ''}`}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
        >
          <div className="button-surface">
            <div className="center-dot"></div>
          </div>
        </button>

        {/* Nav buttons with floating aesthetic */}
        {menuPoints && navItems.map((item, i) => (
          <button
            key={item.id}
            className={`nav-button-iteration3${hoveredNavItem?.id === item.id ? ' hovered' : ''}${isActive ? ' active' : ''}`}
            style={{ 
              top: `calc(50% + ${menuPoints[i].y}px)`, 
              left: `calc(50% + ${menuPoints[i].x}px)`,
              transform: `translate(-50%, -50%) ${hoveredNavItem?.id === item.id ? 'scale(1.1) translateY(-8px)' : 'scale(1)'}`,
              transitionDelay: isActive ? `${i * 0.06}s` : '0s'
            }}
            onMouseEnter={() => handleNavItemEnter(item)}
            onMouseLeave={handleNavItemLeave}
            onTouchStart={() => handleNavItemEnter(item)}
          >
            <div className="button-surface">
              <span className="nav-icon-minimal">{item.icon}</span>
              <span className="nav-label-minimal">{item.label}</span>
            </div>
            <div className="floating-shadow"></div>
          </button>
        ))}
      </div>
    </>
  );
}

export default MenuIteration3;