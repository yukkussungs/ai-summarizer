import React from 'react';
import Hero from './components/Hero';
import Demo from './components/Demo';


function MyApp({ Component, pageProps }) {
  return (
      <div>
        <div className="main">
          <div className="gradient" />
        </div>
        <div className="app">
          <Hero />
          <Demo />
        </div>
      </div>
  );
}

export default MyApp;
