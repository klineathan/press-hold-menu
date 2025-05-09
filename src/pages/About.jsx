import Menu from '../components/Menu';

function About() {
  return (
    <div className="page-container">
      <h1>About Page</h1>
      
      <div className="page-content">
        <p>This is the About page of the Press and Hold Menu demonstration.</p>
        
        <div className="content-block">
          <h3>About This Project</h3>
          <p>
            The Press and Hold Menu is a modern navigation technique that provides an intuitive
            way to access different sections of a website or application. By combining touch gestures
            with visual feedback, it creates a seamless experience across devices.
          </p>
        </div>
        
        <div className="content-block">
          <h3>Implementation Details</h3>
          <p>
            This menu is built using React and CSS. It implements advanced touch detection,
            prevents default scrolling behaviors when active, and provides visual feedback for 
            user interactions. The menu is optimized for iOS Safari, which has unique handling
            of touch events.
          </p>
        </div>
        
        <div className="content-block">
          <h3>Navigation</h3>
          <p>
            You're currently on the About page. Use the press and hold menu at the bottom 
            of the screen to navigate to other sections of the application.
          </p>
        </div>
      </div>
      
      <Menu />
    </div>
  );
}

export default About; 