import { useState, useEffect } from 'react';
import { useMenu } from '../contexts/MenuContext';
import MenuIteration1 from '../components/MenuIteration1';
import MenuIteration2 from '../components/MenuIteration2';
import MenuIteration3 from '../components/MenuIteration3';
import MenuIteration4 from '../components/MenuIteration4';
import './MenuDemo.css';

function MenuDemo() {
  const [activeIteration, setActiveIteration] = useState(1);
  const [globalNavEnabled, setGlobalNavEnabled] = useState(false);
  const { setActiveMenuIteration } = useMenu();

  // Update global menu when active iteration or global nav setting changes
  useEffect(() => {
    if (globalNavEnabled) {
      setActiveMenuIteration(activeIteration);
    } else {
      setActiveMenuIteration(null); // Reset to default menu
    }
  }, [activeIteration, globalNavEnabled, setActiveMenuIteration]);

  // Cleanup: Reset to default menu when component unmounts
  useEffect(() => {
    return () => {
      setActiveMenuIteration(null);
    };
  }, [setActiveMenuIteration]);

  const iterations = [
    {
      id: 1,
      name: "Glassmorphism",
      description: "Modern glassmorphism design with enhanced backdrop blur, sophisticated transparency effects, and elegant animations. Features premium glass-like surfaces with subtle lighting effects.",
      component: MenuIteration1,
      highlights: ["Enhanced glassmorphism effects", "Sophisticated transparency", "Premium lighting", "Elegant animations"]
    },
    {
      id: 2,
      name: "Neon Gaming",
      description: "Vibrant neon/gaming theme with dynamic colors, energetic effects, and cyberpunk aesthetics. Features individual neon colors per button and animated energy particles.",
      component: MenuIteration2,
      highlights: ["Dynamic neon colors", "Energy particle effects", "Cyberpunk grid background", "Gaming-optimized spacing"]
    },
    {
      id: 3,
      name: "Minimalist Float",
      description: "Clean minimalist floating design with subtle shadows, refined interactions, and perfect spacing. Features floating aesthetic with soft shadows and gentle animations.",
      component: MenuIteration3,
      highlights: ["Clean floating design", "Subtle shadow effects", "Refined interactions", "Perfect spacing"]
    },
    {
      id: 4,
      name: "Directional Arrow",
      description: "Compass-inspired directional navigation with arrow-shaped buttons and emoji-only interface. Features directional positioning, compass animations, and clear navigation intent.",
      component: MenuIteration4,
      highlights: ["Compass-style main button", "Arrow-shaped navigation", "Emoji-only interface", "Directional positioning"]
    }
  ];

  const ActiveComponent = iterations.find(iter => iter.id === activeIteration)?.component;

  return (
    <div className="menu-demo-container">
      <div className="demo-header">
        <h1>Press & Hold Menu Iterations</h1>
        <p>Explore four distinct design approaches for the press and hold navigation menu</p>
        
        <div className="global-nav-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={globalNavEnabled}
              onChange={(e) => setGlobalNavEnabled(e.target.checked)}
              className="toggle-checkbox"
            />
            <span className="toggle-switch"></span>
            <span className="toggle-text">
              {globalNavEnabled ? '🌐 Global Navigation Active' : '📱 Demo Mode Only'}
            </span>
          </label>
          <p className="toggle-description">
            {globalNavEnabled 
              ? 'The selected menu style is now active across the entire site. Navigate to other pages to test real navigation!'
              : 'Menu demos are isolated to this page. Enable global navigation to test across the site.'
            }
          </p>
        </div>
      </div>

      <div className="iteration-selector">
        {iterations.map((iteration) => (
          <button
            key={iteration.id}
            className={`iteration-button ${activeIteration === iteration.id ? 'active' : ''}`}
            onClick={() => setActiveIteration(iteration.id)}
          >
            <h3>{iteration.name}</h3>
            <p>{iteration.description}</p>
            <div className="highlights">
              {iteration.highlights.map((highlight, index) => (
                <span key={index} className="highlight-tag">{highlight}</span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="demo-instructions">
        <h2>How to Test</h2>
        <div className="instruction-grid">
          <div className="instruction-item">
            <div className="instruction-icon">🖱️</div>
            <div>
              <h4>Desktop</h4>
              <p>Press and hold the center button, then hover over navigation options</p>
            </div>
          </div>
          <div className="instruction-item">
            <div className="instruction-icon">👆</div>
            <div>
              <h4>Mobile</h4>
              <p>Press and hold the center button, then slide to navigation options</p>
            </div>
          </div>
          <div className="instruction-item">
            <div className="instruction-icon">✨</div>
            <div>
              <h4>Experience</h4>
              <p>Notice the unique animations, colors, and interaction patterns</p>
            </div>
          </div>
        </div>
      </div>

      <div className="current-iteration">
        <h2>Currently Viewing: {iterations.find(iter => iter.id === activeIteration)?.name}</h2>
      </div>

      {/* Render the active menu iteration only if global navigation is disabled */}
      {!globalNavEnabled && ActiveComponent && <ActiveComponent />}
    </div>
  );
}

export default MenuDemo;