import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuIteration4.css';

function MenuIteration4() {
  // State to track menu activation
  const [isActive, setIsActive] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState(null);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [showPointer, setShowPointer] = useState(false);
  const menuRef = useRef(null);
  const mainButtonRef = useRef(null);
  const navigate = useNavigate();
  
  // Navigation menu items with directional arrows and emojis
  const navItems = [
    { id: 1, label: "", path: "/", icon: "🏠", direction: "up-left" },
    { id: 2, label: "", path: "/about", icon: "ℹ️", direction: "up" },
    { id: 3, label: "", path: "/contact", icon: "💬", direction: "up-right" },
    { id: 4, label: "", path: "/playground", icon: "🎮", direction: "right" }
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
    
    const navButtons = document.querySelectorAll('.nav-button-iteration4');
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

  // Calculate nav item positions with directional placement
  function calculateNavItemOriginPoints(cx, cy, r, items) {
    const points = [];
    const directions = {
      'up-left': { angle: Math.PI * 1.25, distance: r },
      'up': { angle: Math.PI * 1.5, distance: r },
      'up-right': { angle: Math.PI * 1.75, distance: r },
      'right': { angle: 0, distance: r }
    };
    
    items.forEach((item) => {
      const dir = directions[item.direction];
      const x = dir.distance * Math.cos(dir.angle);
      const y = dir.distance * Math.sin(dir.angle);
      points.push({ x, y });
    });
    
    return points;
  }

  // Calculate points with directional positioning
  useEffect(() => {
    const pts = calculateNavItemOriginPoints(0, 0, 120, navItems);
    setMenuPoints(pts);
  }, [navItems.length, isActive]);
  
  return (
    <>
      {/* Directional backdrop with subtle patterns */}
      <div 
        className={`menu-backdrop-iteration4 ${isActive ? 'active' : ''}`} 
        onMouseUp={handleLeave}
        onTouchEnd={handleLeave}
      />
      
      <div 
        className="menu-container-iteration4" 
        ref={menuRef}
        onMouseLeave={handleLeave}
        onTouchMove={handleTouchMove}
        onTouchCancel={handleLeave}
        onMouseMove={updatePointerPosition}
      >
        {/* Directional touch pointer */}
        {isIOS && (
          <div 
            className="touch-pointer-iteration4"
            style={{ 
              left: `${pointerPosition.x}px`, 
              top: `${pointerPosition.y}px`,
              display: showPointer ? 'block' : 'none'
            }}
          />
        )}
        
        {/* Main button with directional compass design */}
        <button
          ref={mainButtonRef}
          className={`main-button-iteration4 ${isActive ? 'active' : ''}`}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
        >
          <div className="compass-ring">
            <div className="compass-needle"></div>
            <div className="compass-center">⚡</div>
          </div>
        </button>

        {/* Directional arrow nav buttons */}
        {menuPoints && navItems.map((item, i) => (
          <button
            key={item.id}
            className={`nav-button-iteration4 direction-${item.direction}${hoveredNavItem?.id === item.id ? ' hovered' : ''}${isActive ? ' active' : ''}`}
            style={{ 
              top: `calc(50% + ${menuPoints[i].y}px)`, 
              left: `calc(50% + ${menuPoints[i].x}px)`,
              transform: `translate(-50%, -50%) ${hoveredNavItem?.id === item.id ? 'scale(1.3)' : 'scale(1)'}`,
              transitionDelay: isActive ? `${i * 0.1}s` : '0s'
            }}
            onMouseEnter={() => handleNavItemEnter(item)}
            onMouseLeave={handleNavItemLeave}
            onTouchStart={() => handleNavItemEnter(item)}
          >
            <div className="arrow-body">
              <div className="arrow-head"></div>
              <div className="arrow-icon">{item.icon}</div>
            </div>
            <div className="direction-trail"></div>
          </button>
        ))}
      </div>
    </>
  );
}

export default MenuIteration4;