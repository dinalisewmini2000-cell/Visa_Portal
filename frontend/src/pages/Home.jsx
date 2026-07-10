import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const portalOptions = [
    {
      title: "Check Eligibility",
      icon: "📋",
      path: "/check-eligibility",
      buttonColor: "#b2abb4",
      buttonBorder: "#88828a",
      bgBlob: "#f4f1f5"
    },
    {
      title: "Read Instruction",
      icon: "ℹ️",
      path: "/read-instructions",
      buttonColor: "#829be8",
      buttonBorder: "#5d74b8",
      bgBlob: "#eff2fa"
    },
    {
      title: "Create web Application",
      icon: "📝",
      path: "/create-application",
      buttonColor: "#52c88a",
      buttonBorder: "#34915f",
      bgBlob: "#ebf7f0"
    },
    {
      title: "Remove web Application",
      icon: "🗑️",
      path: "/remove-application",
      buttonColor: "#d73681",
      buttonBorder: "#9a1e58",
      bgBlob: "#fbe4f0"
    }
  ];

  return (
    <main className="main-content">
      {/* Hero Section */}
      <section className="hero" style={{ 
        padding: '0', 
        position: 'relative',
        background: 'none'
      }}>
        <img src="/banner.png" alt="Australia Visa Portal Banner" style={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }} />
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'white', textShadow: '2px 2px 8px rgba(0,0,0,0.9)', marginBottom: '1rem', textAlign: 'center' }}>Australia Work Visa Portal</h1>
          <p style={{ fontSize: '1.25rem', color: '#f8fafc', textShadow: '1px 1px 4px rgba(0,0,0,0.9)', maxWidth: '800px', textAlign: 'center' }}>
            Your streamlined pathway to working abroad. Manage your application process efficiently and securely.
          </p>
        </div>
      </section>

      {/* Portal Options Grid */}
      <section className="portal-section">
        <div className="options-grid">
          {portalOptions.map((option, index) => (
            <div key={index} className="action-card" onClick={() => navigate(option.path)} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem 1.5rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                
                {/* Illustration Blob */}
                <div style={{ 
                  width: '160px', 
                  height: '160px', 
                  backgroundColor: option.bgBlob, 
                  borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  fontSize: '5rem',
                  marginBottom: '1.5rem',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)'
                }}>
                  {option.icon}
                </div>
                
                <h3 style={{ fontSize: '1.1rem', color: '#4b5563', marginBottom: '1.5rem', fontWeight: '500' }}>{option.title}</h3>
              </div>
              
              <button style={{ 
                background: option.buttonColor, 
                color: 'white', 
                border: 'none', 
                borderBottom: `3px solid ${option.buttonBorder}`,
                padding: '0.6rem 1rem', 
                fontSize: '0.9rem', 
                cursor: 'pointer',
                width: '70%',
                margin: '0 auto',
                fontWeight: '500'
              }}>
                Click Here &gt;&gt;
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
