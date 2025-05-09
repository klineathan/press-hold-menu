import Menu from '../components/Menu';

function Home() {
  return (
    <div className="page-container">
      <h1>Home Page</h1>
      
      <div className="page-content">
        <p>Welcome to the Press and Hold Menu Demo!</p>
        <p>Press and hold the blue button at the bottom of the screen to navigate between pages.</p>
        
        <div className="content-block">
          <h3>How to Use</h3>
          <p>
            1. Press and hold the blue button at the bottom of the screen<br />
            2. While holding, slide up to one of the navigation items<br />
            3. Release to navigate to that page
          </p>
        </div>
        
        <div className="content-block">
          <h3>Features</h3>
          <p>
            • Intuitive press and hold navigation<br />
            • Works on both desktop and mobile devices<br />
            • Special optimizations for iOS Safari<br />
            • Smooth transitions and visual feedback
          </p>
        </div>
      </div>
      
      <Menu />
    </div>
  );
}

export default Home; 