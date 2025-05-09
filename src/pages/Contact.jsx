import Menu from '../components/Menu';

function Contact() {
  return (
    <div className="page-container">
      <h1>Contact Page</h1>
      
      <div className="page-content">
        <p>This is the Contact page of the Press and Hold Menu demonstration.</p>
        
        <div className="content-block">
          <h3>Get In Touch</h3>
          <p>
            Thank you for exploring the Press and Hold Menu demo. This is where contact
            information would typically be displayed.
          </p>
        </div>
        
        <div className="content-block">
          <h3>Sample Form</h3>
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Your name" />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Your email" />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="4" placeholder="Your message"></textarea>
            </div>
            
            <button type="button" className="submit-button">
              Send Message
            </button>
          </form>
        </div>
        
        <div className="content-block">
          <h3>Navigation</h3>
          <p>
            You're currently on the Contact page. Use the press and hold menu at the bottom 
            of the screen to navigate to other sections of the application.
          </p>
        </div>
      </div>
      
      <Menu />
    </div>
  );
}

export default Contact; 