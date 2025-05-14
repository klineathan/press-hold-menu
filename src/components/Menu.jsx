import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Menu() {
  // State to track menu activation
  const [isActive, setIsActive] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState(null);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [showPointer, setShowPointer] = useState(false);
  const menuRef = useRef(null);
  const mainButtonRef = useRef(null);
  const navigate = useNavigate();
  
  // Navigation menu items
  const navItems = [
    { id: 1, label: "Home", path: "/" },
    { id: 2, label: "About", path: "/about" },
    { id: 3, label: "Contact", path: "/contact" },
    { id: 4, label: "Playground", path: "/playground" }
  ];
  
  // Use state for points to ensure they update properly after navigation
  const [menuPoints, setMenuPoints] = useState(null);
  
  // Handle press start (both mouse and touch)
  const handlePressStart = (e) => {
    // Prevent default behavior that causes selection/highlighting
    e.preventDefault();
    setIsActive(true);
    
    // Show pointer for touch devices
    const isTouchEvent = e.type.startsWith('touch');
    if (isTouchEvent) {
      // Force update position and show pointer
      if (e.touches && e.touches.length > 0) {
        setPointerPosition({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        });
        console.log("Touch start at:", e.touches[0].clientX, e.touches[0].clientY);
        setShowPointer(true);
      }
    }
  };
  
  // Handle press end (both mouse and touch)
  const handlePressEnd = (e) => {
    // Prevent default behavior
    e.preventDefault();
    
    if (hoveredNavItem) {
      // Navigate to the selected item's path
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
  
  // Handle pointer entering a nav item (works for both mouse and touch)
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
    // Always update position, not just when active
    const isTouchEvent = e.type.startsWith('touch');
    
    // Only proceed if it's a touch event with touches
    if (isTouchEvent && e.touches && e.touches.length > 0) {
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      
      setPointerPosition({
        x: clientX,
        y: clientY
      });
    } else if (!isTouchEvent) {
      // For mouse events
      setPointerPosition({
        x: e.clientX,
        y: e.clientY
      });
    }
  };
  
  // Handle touch move to detect when user slides to nav items
  const handleTouchMove = (e) => {
    if (!isActive) return;
    
    // Prevent scrolling while menu is active
    e.preventDefault();
    
    // Ensure touch pointer is showing and update its position
    if (e.touches && e.touches.length > 0) {
      setPointerPosition({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
      
      // Force pointer visibility during touch move
      if (isIOS && !showPointer) {
        console.log("Force showing pointer during touch move");
        setShowPointer(true);
      }
    }
    
    // Get touch position
    const touch = e.touches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    
    // Check if touch is over any nav buttons
    const navButtons = document.querySelectorAll('.nav-button');
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
    
    // Handle both mouse and touch events
    document.addEventListener('mouseup', handleGlobalEnd);
    document.addEventListener('touchend', handleGlobalEnd);
    
    // Prevent long-press context menu on iOS
    const preventContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', preventContextMenu);
    
    // Cleanup
    return () => {
      document.removeEventListener('mouseup', handleGlobalEnd);
      document.removeEventListener('touchend', handleGlobalEnd);
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);
  
  // Prevent scrolling when menu is active - minimal approach
  useEffect(() => {
    const preventScroll = (e) => {
      if (isActive) {
        e.preventDefault();
      }
    };
    
    // Just add event listeners, no DOM manipulation
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

  // Place n nav items around a circle so that the arc length between consecutive points is a distance d starting at angle a
  function calculateNavItemOriginPoints(cx, cy, r, n, arcLength, startAngle = null) {
    // If startAngle is null, calculate the startAngle to center the items along the y-axis
    if (startAngle === null) {
      // For symmetrical placement around y-axis, calculate the total angle span
      const totalAngleSpan = (n - 1) * (arcLength / r);
      // Set startAngle to PI (bottom) minus half the total angle span
      // Then add PI/2 (90 degrees) to rotate clockwise
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

  // Calculate points when component mounts and whenever needed
  useEffect(() => {
    // Since we're using relative positioning, we don't need the main button's position
    // We'll just use a radius and position relative to the center
    const pts = calculateNavItemOriginPoints(0, 0, 100, navItems.length, 85);
    setMenuPoints(pts);
  }, [navItems.length, isActive]);
  
  // Add an effect to log when pointer visibility changes
  useEffect(() => {
    console.log("Touch pointer visibility:", showPointer ? "visible" : "hidden");
    console.log("Current position:", pointerPosition);
  }, [showPointer, pointerPosition]);
  
  return (
    <div 
      className="menu-container" 
      ref={menuRef}
      onMouseLeave={handleLeave}
      onTouchMove={handleTouchMove}
      onTouchCancel={handleLeave}
      onMouseMove={updatePointerPosition}
    >
      {/* Touch pointer (always render for iOS, control visibility with opacity) */}
      {isIOS && (
        <div 
          style={{ 
            position: 'fixed',
            left: `${pointerPosition.x}px`, 
            top: `${pointerPosition.y}px`,
            width: '60px',  // Larger size
            height: '60px',
            margin: '-30px 0 0 -30px', // Center offset instead of transform
            borderRadius: '50%',
            border: '3px solid white',
            backgroundColor: 'rgba(100, 108, 255, 0.5)',
            pointerEvents: 'none',
            zIndex: 9999,
            display: showPointer ? 'block' : 'none',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)'
          }}
        />
      )}
      
      {/* Main button */}
      <button
        ref={mainButtonRef}
        className={`main-button ${isActive ? 'active' : ''}`}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      />

      {/* Nav buttons */}
      {menuPoints && navItems.map((item, i) => (
        <button
          key={item.id}
          className={`nav-button${hoveredNavItem?.id === item.id ? ' hovered' : ''}${isActive ? ' active' : ''}`}
          style={{ 
            top: `calc(50% + ${menuPoints[i].y}px)`, 
            left: `calc(50% + ${menuPoints[i].x}px)`,
            transform: `translate(-50%, -50%) ${hoveredNavItem?.id === item.id ? 'scale(1.2)' : 'scale(1)'}`,
            transition: 'transform 0.2s ease-out'
          }}
          onMouseEnter={() => handleNavItemEnter(item)}
          onMouseLeave={handleNavItemLeave}
          onTouchStart={() => handleNavItemEnter(item)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default Menu; 
