import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuIteration2.css';

function MenuIteration2() {
  // State to track menu activation
  const [isActive, setIsActive] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState(null);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [showPointer, setShowPointer] = useState(false);
  const menuRef = useRef(null);
  const mainButtonRef = useRef(null);
  const navigate = useNavigate();
  
  // Navigation menu items with gaming-themed icons
  const navItems = [
    { id: 1, label: "", path: "/", icon: "🏠", color: "#00ff88" },
    { id: 2, label: "", path: "/about", icon: "ℹ️", color: "#ff0080" },
    { id: 3, label: "", path: "/contact", icon: "💬", color: "#00d4ff" },
    { id: 4, label: "", path: "/playground", icon: "🎮", color: "#ff6600" }
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
    
    const navButtons = document.querySelectorAll('.nav-button-iteration2');
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

  // Calculate nav item positions in a wider spread for gaming feel
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

  // Calculate points with gaming-optimized spacing
  useEffect(() => {
    const pts = calculateNavItemOriginPoints(0, 0, 110, navItems.length, 90);
    setMenuPoints(pts);
  }, [navItems.length, isActive]);
  
  return (
    <>
      {/* Neon backdrop with cyberpunk vibes */}
      <div 
        className={`menu-backdrop-iteration2 ${isActive ? 'active' : ''}`} 
        onMouseUp={handleLeave}
        onTouchEnd={handleLeave}
      />
      
      <div 
        className="menu-container-iteration2" 
        ref={menuRef}
        onMouseLeave={handleLeave}
        onTouchMove={handleTouchMove}
        onTouchCancel={handleLeave}
        onMouseMove={updatePointerPosition}
      >
        {/* Gaming-style touch pointer */}
        {isIOS && (
          <div 
            className="touch-pointer-iteration2"
            style={{ 
              left: `${pointerPosition.x}px`, 
              top: `${pointerPosition.y}px`,
              display: showPointer ? 'block' : 'none'
            }}
          />
        )}
        
        {/* Main button with neon energy core */}
        <button
          ref={mainButtonRef}
          className={`main-button-iteration2 ${isActive ? 'active' : ''}`}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
        >
          <div className="energy-core">
            <div className="core-ring"></div>
            <div className="core-center">⚡</div>
          </div>
        </button>

        {/* Nav buttons with individual neon colors */}
        {menuPoints && navItems.map((item, i) => (
          <button
            key={item.id}
            className={`nav-button-iteration2${hoveredNavItem?.id === item.id ? ' hovered' : ''}${isActive ? ' active' : ''}`}
            style={{ 
              top: `calc(50% + ${menuPoints[i].y}px)`, 
              left: `calc(50% + ${menuPoints[i].x}px)`,
              '--neon-color': item.color,
              transform: `translate(-50%, -50%) ${hoveredNavItem?.id === item.id ? 'scale(1.25) rotate(5deg)' : 'scale(1)'}`,
              transitionDelay: isActive ? `${i * 0.08}s` : '0s'
            }}
            onMouseEnter={() => handleNavItemEnter(item)}
            onMouseLeave={handleNavItemLeave}
            onTouchStart={() => handleNavItemEnter(item)}
          >
            <div className="button-glow"></div>
            <div className="button-content">
              <span className="nav-icon-neon">{item.icon}</span>
            </div>
            <div className="energy-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

export default MenuIteration2;