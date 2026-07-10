import React from 'react';

function Banner() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#000',
      color: '#fff',
      padding: '0.5rem 1rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      {/* Left Flag (Australia) */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <img src="https://flagcdn.com/w80/au.png" alt="Australia Flag" style={{ height: '40px', objectFit: 'contain' }} />
      </div>

      {/* Title */}
      <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '400', textAlign: 'center', flex: 1 }}>
        Online Application for Australia Work Visa
      </h1>

      {/* Right Flag (Sri Lanka) */}
      <div>
        <img src="https://flagcdn.com/w80/lk.png" alt="Sri Lanka Flag" style={{ height: '40px', objectFit: 'contain' }} />
      </div>
    </div>
  );
}

export default Banner;
