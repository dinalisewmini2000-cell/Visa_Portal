import React, { useState } from 'react';
import axios from 'axios';

function RemoveApplication() {
  const [formData, setFormData] = useState({
    nicNumber: '',
    email: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.delete('/api/applications/remove', {
        data: { nicNumber: formData.nicNumber, email: formData.email }
      });
      
      // Show native popup message as requested
      window.alert('✅ ' + (response.data.message || 'Your application has been successfully removed.'));
      
      setFormData({ nicNumber: '', email: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove application. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content" style={{ padding: '2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', background: 'var(--surface)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ background: '#0056b3', color: 'white', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem' }}>⚙️</span>
          <h2 style={{ margin: 0, fontSize: '1.25rem', textTransform: 'uppercase' }}>Deactivate Application</h2>
        </div>

        <div style={{ padding: '2rem' }}>
          
          {/* Instructions Block */}
          <div style={{ background: '#fff3cd', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid #ffeeba' }}>
            <h3 style={{ color: '#856404', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚠️ Important Instructions for Removal
            </h3>
            <p style={{ color: '#666', marginBottom: '1rem', lineHeight: '1.6' }}>
              Removing an application will permanently delete all your submitted data from the system. This action cannot be undone. 
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
              <li>You only need your <strong>NIC Number</strong> and <strong>Email Address</strong>.</li>
              <li>Once you click the removal button, the system will verify your details and delete your record instantly.</li>
              <li>A large popup message will appear confirming that your application has been successfully removed.</li>
            </ul>
          </div>

          {/* Form Block */}
          <div style={{ background: '#eef2f9', padding: '2rem', borderRadius: '0.5rem', border: '1px solid #d4def0' }}>
            <h3 style={{ color: '#0047ba', marginBottom: '1.5rem' }}>Remove Your Web Application</h3>
            
            <form onSubmit={handleRemove} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', color: '#333' }}>
                NIC Number
                <input 
                  required 
                  type="text" 
                  name="nicNumber" 
                  value={formData.nicNumber} 
                  onChange={handleChange} 
                  style={inputStyle} 
                  placeholder="Enter your NIC"
                />
              </label>
              
              <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', color: '#333' }}>
                Email Address
                <input 
                  required 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  style={inputStyle} 
                  placeholder="Enter your Email"
                />
              </label>

              <button 
                type="submit" 
                disabled={loading} 
                style={{ 
                  background: '#d32f2f', 
                  color: 'white', 
                  padding: '1rem', 
                  border: 'none', 
                  borderRadius: '0.25rem', 
                  fontSize: '1rem', 
                  fontWeight: 'bold', 
                  cursor: loading ? 'not-allowed' : 'pointer', 
                  width: '100%', 
                  marginTop: '0.5rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {loading ? 'Processing...' : 'Permanently Remove Application'}
              </button>
            </form>

            {error && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8d7da', color: '#721c24', borderRadius: '0.25rem', border: '1px solid #f5c6cb' }}>
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

const inputStyle = {
  width: '100%', padding: '0.75rem', marginTop: '0.5rem',
  border: '1px solid #ccc', borderRadius: '0.25rem',
  fontSize: '1rem', background: '#fff'
};

export default RemoveApplication;
