import React from 'react';

// Simple fixed light backdrop — the Hero owns its own parallax imagery.
// All sections render as semi-transparent layers above this.
const Background = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      zIndex: -1,
      background: 'linear-gradient(160deg, #ffffff 0%, #f3f6f4 60%, #ffffff 100%)',
    }}
  />
);

export default Background;
