import React from 'react';
import { Link } from 'react-router-dom';
import '../style.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero-banner">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Welcome to PostIt</h1>
            <p>
              Share your thoughts, connect with amazing people, and express yourself.
            </p>
            <Link to="/posts" className="btn btn-primary hero-btn">
              Explore Posts
            </Link>
          </div>
        </div>
      </div>


      <div className="info-section container">
        <h2>What is PostIt?</h2>
        <p>
          PostIt is a simple and modern social platform designed to let you share ideas,
          create posts, and engage with a community of like-minded individuals.
        </p>
        <h3>Features</h3>
        <ul>
          <li>Create and edit your own posts</li>
          <li>Comment and discuss with others</li>
          <li>Community moderation tools</li>
          <li>User-friendly and responsive design</li>
        </ul>
      </div>

      <div className="credits container">
        <p>Developed by <strong>Seisenbek Dias</strong> and <strong>Suleimenov Dinmukhamed</strong></p>
      </div>
    </div>
  );
};

export default Home;
