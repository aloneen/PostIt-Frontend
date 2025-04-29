import React from 'react';
import { Link } from 'react-router-dom';


import './css/Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="fade-in">🚀 Welcome to <span className="highlight">PostIt</span></h1>
          <p className="fade-in delay-1">
            Share your thoughts. Connect deeply. Create freely.
          </p>
          <Link to="/posts" className="btn hero-btn fade-in delay-2">
            Explore Posts
          </Link>
        </div>
      </section>

      <section className="info-section container fade-in delay-3">
        <h2>✨ What is PostIt?</h2>
        <p>
          PostIt is your digital space to express ideas, interact with a community, and
          grow your voice — all with style and simplicity.
        </p>
        <h3>🌟 Features</h3>
        <ul>
          <li>Create & edit beautiful posts</li>
          <li>Engage in thoughtful discussions</li>
          <li>Moderation for community health</li>
          <li>Responsive, sleek interface</li>
        </ul>
      </section>

      <footer className="credits container fade-in delay-4">
        <p>
          Crafted with ❤️ by <strong>Seisenbek Dias</strong> & <strong>Suleimenov Dinmukhamed</strong>
        </p>
      </footer>
    </div>
  );
};

export default Home;
