import React from 'react';
import { Link } from 'react-router-dom';
import './css/Home.css';

const Home = () => {
  return (
    <div className="home-page animated-bg">
      <div className="hero animated-hero">
        <div className="hero-text">
          <h1 className="typing">Share. Inspire. Explore.</h1>
          <p className="fade-in">A creative platform to connect ideas and voices.</p>
          <Link to="/posts" className="explore-btn fade-in delay">Explore Posts</Link>
        </div>
        <div className="scroll-indicator">↓</div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Features That Spark</h2>
        <div className="features-grid">
          <div className="feature-card hover-reveal">
            <h3>Thoughtful Writing</h3>
            <p>Compose and publish posts that reflect your ideas clearly.</p>
          </div>
          <div className="feature-card hover-reveal">
            <h3>Focus Mode</h3>
            <p>Minimalist editor keeps distractions away so you can focus.</p>
          </div>
          <div className="feature-card hover-reveal">
            <h3>Community</h3>
            <p>Join conversations that matter with real people and topics.</p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>Crafted with 💡 by <strong>Seisenbek Dias</strong> & <strong>Suleimenov Dinmukhamed</strong></p>
        <p>© {new Date().getFullYear()} PostIt</p>
      </footer>
    </div>
  );
};

export default Home;