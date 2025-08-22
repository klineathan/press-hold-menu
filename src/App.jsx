import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MenuProvider } from './contexts/MenuContext';
import './App.css'

// Import pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Playground from './pages/Playground';
import MenuDemo from './pages/MenuDemo';

function App() {
  return (
    <MenuProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/menu-demo" element={<MenuDemo />} />
          </Routes>
        </div>
      </Router>
    </MenuProvider>
  );
}

export default App;
