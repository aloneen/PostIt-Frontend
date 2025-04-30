
import React from 'react';
import { Link } from 'react-router-dom';
import './css/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-text">
          <h1>Welcome to <span>PostIt</span></h1>
          <p>Your creative space to share ideas, connect, and grow.</p>
          <Link to="/posts" className="explore-btn">Browse Posts</Link>
        </div>
      </div>

      <div className="features-section">
        <h2>Why PostIt?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Express</h3>
            <p>Create beautiful posts to share your thoughts with the world.</p>
          </div>
          <div className="feature-card">
            <h3>Engage</h3>
            <p>Start conversations and connect deeply with a like-minded community.</p>
          </div>
          <div className="feature-card">
            <h3>Moderate</h3>
            <p>Empower responsible dialogue through smart moderation tools.</p>
          </div>
          
        </div>
      </div>

      <footer className="footer">
        <p>Crafted by <strong>Seisenbek Dias</strong> & <strong>Suleimenov Dinmukhamed</strong></p>
        <p>© {new Date().getFullYear()} PostIt</p>
      </footer>
    </div>
  );
};

export default Home;