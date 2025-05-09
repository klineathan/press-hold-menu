import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Menu() {
  // State to track menu activation
  const [isActive, setIsActive] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState(null);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [showPointer, setShowPointer] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  
  // Navigation menu items
  const navItems = [
    { id: 1, label: "Home", path: "/" },
    { id: 2, label: "About", path: "/about" },
    { id: 3, label: "Contact", path: "/contact" }
  ];
  
  // Handle press start (both mouse and touch)
  const handlePressStart = (e) => {
    // Prevent default behavior that causes selection/highlighting
    e.preventDefault();
    setIsActive(true);
    
    // Show pointer for touch devices
    const isTouchEvent = e.type.startsWith('touch');
    if (isTouchEvent) {
      setShowPointer(true);
      updatePointerPosition(e);
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
    if (!isActive) return;
    
    const isTouchEvent = e.type.startsWith('touch');
    const clientX = isTouchEvent ? e.touches[0].clientX : e.clientX;
    const clientY = isTouchEvent ? e.touches[0].clientY : e.clientY;
    
    setPointerPosition({
      x: clientX,
      y: clientY
    });
  };
  
  // Handle touch move to detect when user slides to nav items
  const handleTouchMove = (e) => {
    if (!isActive) return;
    
    // Prevent scrolling while menu is active
    e.preventDefault();
    
    // Update the pointer position
    updatePointerPosition(e);
    
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
  
  // Prevent scrolling when menu is active
  useEffect(() => {
    const preventScroll = (e) => {
      if (isActive) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    // Add event listeners to prevent scrolling when menu is active
    if (isActive) {
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('wheel', preventScroll, { passive: false });
      
      // Lock body scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position when menu is deactivated
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
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
  
  return (
    <div 
      className="menu-container" 
      ref={menuRef}
      onMouseLeave={handleLeave}
      onTouchMove={handleTouchMove}
      onTouchCancel={handleLeave}
      onMouseMove={updatePointerPosition}
    >
      {/* Custom touch pointer indicator */}
      {showPointer && isIOS && (
        <div 
          className="touch-pointer" 
          style={{ 
            left: pointerPosition.x + 'px', 
            top: pointerPosition.y + 'px' 
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.3)" />
            <circle cx="20" cy="20" r="8" fill="rgba(255,255,255,0.5)" />
          </svg>
        </div>
      )}
      
      {/* Nav buttons */}
      <div className={`nav-items ${isActive ? 'active' : ''}`}>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-button ${hoveredNavItem?.id === item.id ? 'hovered' : ''}`}
            onMouseEnter={() => handleNavItemEnter(item)}
            onMouseLeave={handleNavItemLeave}
            onTouchStart={() => handleNavItemEnter(item)}
          >
            {item.label}
          </button>
        ))}
      </div>
      
      {/* Main button */}
      <button
        className={`main-button ${isActive ? 'active' : ''}`}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      />
    </div>
  );
}

export default Menu; 