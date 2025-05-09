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
  const menuRef = useRef(null);
  
  // Navigation menu items
  const navItems = [
    { id: 1, label: "Home", path: "/" },
    { id: 2, label: "About", path: "/about" },
    { id: 3, label: "Contact", path: "/contact" }
  ];
  
  // Handle mouse down on main button
  const handleMouseDown = () => {
    setIsActive(true);
  };
  
  // Handle mouse up anywhere
  const handleMouseUp = () => {
    if (hoveredNavItem) {
      // Navigate to the selected item's path
      console.log(`Navigating to: ${hoveredNavItem.path}`);
      // Implement actual navigation here
      // window.location.href = hoveredNavItem.path;
    }
    
    setIsActive(false);
    setHoveredNavItem(null);
  };
  
  // Handle mouse leaving the menu area
  const handleMouseLeave = () => {
    setIsActive(false);
    setHoveredNavItem(null);
  };
  
  // Handle mouse entering a nav item
  const handleNavItemMouseEnter = (item) => {
    if (isActive) {
      setHoveredNavItem(item);
    }
  };
  
  // Handle mouse leaving a nav item
  const handleNavItemMouseLeave = () => {
    setHoveredNavItem(null);
  };
  
  // Add global mouse up event listener
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsActive(false);
      setHoveredNavItem(null);
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);
  
  return (
    <div className="app-container">
      <h1>Press and Hold Menu</h1>
      
      <div 
        className="menu-container" 
        ref={menuRef}
        onMouseLeave={handleMouseLeave}
      >
        {/* Nav buttons */}
        <div className={`nav-items ${isActive ? 'active' : ''}`}>
          {navItems.map((item, index) => (
            <button
              key={item.id}
              className={`nav-button ${hoveredNavItem?.id === item.id ? 'hovered' : ''}`}
              style={{
                // Position in an arc above the main button
                transform: `rotate(${-90 + (index * 90 / (navItems.length - 1))}deg) translate(100px) rotate(${90 - (index * 90 / (navItems.length - 1))}deg)`
              }}
              onMouseEnter={() => handleNavItemMouseEnter(item)}
              onMouseLeave={handleNavItemMouseLeave}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        {/* Main button */}
        <button
          className={`main-button ${isActive ? 'active' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      </div>
    </div>
  )
}

export default App
