import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  // NOTES
  // If the main button is pressed, it will scale up and three navigation menu buttons will fade in. The navigation menu buttons are located above the main button. All buttons are circles. The navigation menu buttons are positioned along the center of an arc centered on the main button.
  // Once you press the main button and it scales and the nav button fade in, you should be able to slide up to one of the nav buttons. When you stop pressing/hovering the main button, it will scale back down. When you are pressing/hovering a nav button, it will scale up and also scale back down if you are not hovering it. The active state is when all of the nav buttons are visible. You can deactivate the whole menu state by either leaving the area of the div that contains all of this or if you unpress/unclick the screen.
  // To navigate to one of the navigation routes, simply press and hold the main button, then while the menu is activated, continue clicking/pressing down on the page and slide up to the menu item you want to navigate to. Then, while that menu item is scaled up (meaning this item is focused), release your mouse/finger and the page will take you there.

  // State to track menu activation
  const [isActive, setIsActive] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState(null);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [showPointer, setShowPointer] = useState(false);
  const menuRef = useRef(null);
  
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
      // Implement actual navigation here
      // window.location.href = hoveredNavItem.path;
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
    <div className="app-container">
      <h1>Press and Hold Menu</h1>
      
      {/* Main content area */}
      <div className="main-content">
        {/* Dummy content to demonstrate scrolling is prevented */}
        <div className="dummy-content">
          <h2>Scroll Test Content</h2>
          <p>Try to scroll while the menu is active - it should be prevented.</p>
          
          {Array(10).fill().map((_, i) => (
            <div key={i} className="content-block">
              <h3>Section {i + 1}</h3>
              <p>
                This is test content to make the page scrollable. When you press and hold
                the menu button, scrolling should be disabled so you can navigate to 
                menu items without accidentally scrolling the page.
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Floating menu at the bottom center */}
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
    </div>
  )
}

export default App
