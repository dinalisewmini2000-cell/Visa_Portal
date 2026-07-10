import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('applications');

  // Application State
  const [applications, setApplications] = useState([]);
  const [appLoading, setAppLoading] = useState(false);
  const [appError, setAppError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Vacancy State
  const [jobsData, setJobsData] = useState({});
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState('');
  const [savingSector, setSavingSector] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [genderTab, setGenderTab] = useState('Male'); // 'Male' or 'Female'

  const toastStyle = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.status === 200) {
        setIsAuthenticated(true);
        fetchApplications();
        fetchJobsData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed!");
    }
  };

  const fetchApplications = async () => {
    setAppLoading(true);
    try {
      const response = await axios.get('/api/applications');
      setApplications(response.data);
      setAppError('');
    } catch (err) {
      setAppError('Failed to fetch applications.');
    } finally {
      setAppLoading(false);
    }
  };

  const fetchJobsData = async () => {
    setJobsLoading(true);
    try {
      const response = await axios.get('/api/jobs');
      setJobsData(response.data);
      setJobsError('');
    } catch (err) {
      setJobsError('Failed to fetch vacancies settings.');
    } finally {
      setJobsLoading(false);
    }
  };

  const handleDeleteApplication = async (id, refNum) => {
    if (!window.confirm(`Are you sure you want to permanently delete application ${refNum}?`)) return;
    try {
      await axios.delete(`/api/applications/admin/${id}`);
      setApplications(applications.filter(app => app.id !== id));
      alert('Application deleted.');
    } catch (err) {
      alert('Failed to delete application.');
    }
  };

  const handleVacancyChange = (sector, index, newVacancies) => {
    const sectorData = jobsData[sector];
    const newJobs = [...sectorData.jobs];
    
    if (genderTab === 'Male') {
      newJobs[index] = { ...newJobs[index], maleVacancies: parseInt(newVacancies) || 0 };
    } else {
      newJobs[index] = { ...newJobs[index], femaleVacancies: parseInt(newVacancies) || 0 };
    }
    
    
    setJobsData({
      ...jobsData,
      [sector]: { ...sectorData, jobs: newJobs }
    });
  };

  const handleAgeLimitChange = (sector, type, newLimit) => {
    const sectorData = jobsData[sector];
    const parsed = newLimit === '' ? '' : parseInt(newLimit);
    setJobsData({
      ...jobsData,
      [sector]: { ...sectorData, [type]: parsed }
    });
  };

  const handleSaveVacancy = async (sector) => {
    setSavingSector(sector);
    try {
      await axios.put('/api/jobs', {
        sector,
        jobs: jobsData[sector].jobs,
        minAge: jobsData[sector].minAge === '' ? 18 : jobsData[sector].minAge,
        maxAge: jobsData[sector].maxAge === '' ? 45 : jobsData[sector].maxAge
      });
      setToastMessage(`✅ Vacancy settings saved for ${sector}`);
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setToastMessage(`❌ Failed to save ${sector}`);
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setSavingSector(null);
    }
  };

  const filteredApps = applications.filter(app => {
    const term = searchTerm.toLowerCase();
    return (
      (app.nicNumber && app.nicNumber.toLowerCase().includes(term)) ||
      (app.referenceNumber && app.referenceNumber.toLowerCase().includes(term)) ||
      (app.jobSector && app.jobSector.toLowerCase().includes(term)) ||
      (app.jobCategory && app.jobCategory.toLowerCase().includes(term)) ||
      (app.firstName && app.firstName.toLowerCase().includes(term)) ||
      (app.surname && app.surname.toLowerCase().includes(term)) ||
      (app.mobile1 && app.mobile1.toLowerCase().includes(term)) ||
      (app.email && app.email.toLowerCase().includes(term))
    );
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#002b5e' }}>Admin Login</h2>
          <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold' }}>
            Admin Email:
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} 
              placeholder="admin@visaportal.com"
              required
            />
          </label>
          <label style={{ display: 'block', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            Master Password:
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} 
              placeholder="Enter password"
              required
            />
          </label>
          <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#0047ba', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Login to Dashboard
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="main-content" style={{ padding: '2rem' }}>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setActiveTab('applications')} style={{ ...tabStyle, background: activeTab === 'applications' ? '#0047ba' : '#ddd', color: activeTab === 'applications' ? 'white' : 'black' }}>
          👥 Applications Database
        </button>
        <button onClick={() => setActiveTab('vacancies')} style={{ ...tabStyle, background: activeTab === 'vacancies' ? '#0047ba' : '#ddd', color: activeTab === 'vacancies' ? 'white' : 'black' }}>
          ⚙️ Specific Job Vacancies
        </button>
        <button onClick={handleLogout} style={{ ...tabStyle, background: '#dc3545', color: 'white' }}>
          🚪 Logout
        </button>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <style>{toastStyle}</style>
        
        {/* Custom Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: toastMessage.includes('✅') ? '#4caf50' : '#f44336',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '1rem',
            fontWeight: 'bold',
            zIndex: 1000,
            animation: 'fadeInUp 0.3s ease-out'
          }}>
            {toastMessage}
          </div>
        )}

        {activeTab === 'applications' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ color: '#002b5e', margin: 0 }}>Applications Database</h2>
              <button onClick={fetchApplications} style={actionBtnStyle('#28a745')}>🔄 Refresh</button>
            </div>

            <input 
              type="text" 
              placeholder="Search by Name, NIC, Ref No, Mobile, Email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
            />

            {appError && <div style={{ color: 'red', marginBottom: '1rem' }}>{appError}</div>}
            
            {appLoading ? (
              <p>Loading records...</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
                  <thead>
                    <tr style={{ background: '#0047ba', color: 'white' }}>
                      <th style={thStyle}>Ref Number</th>
                      <th style={thStyle}>Full Name</th>
                      <th style={thStyle}>NIC</th>
                      <th style={thStyle}>Gender</th>
                      <th style={thStyle}>Job Sector & Category</th>
                      <th style={thStyle}>Mobile Number</th>
                      <th style={thStyle}>Email Address</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApps.length === 0 ? (
                      <tr><td colSpan="8" style={{ padding: '1rem', textAlign: 'center' }}>No applications found.</td></tr>
                    ) : (
                      filteredApps.map(app => (
                        <tr key={app.id} style={{ borderBottom: '1px solid #ddd' }}>
                          <td style={tdStyle}><strong>{app.referenceNumber}</strong></td>
                          <td style={tdStyle}>{app.firstName} {app.surname}</td>
                          <td style={tdStyle}>{app.nicNumber}</td>
                          <td style={tdStyle}>{app.gender}</td>
                          <td style={tdStyle}>
                            <div style={{ fontWeight: 'bold', color: '#0047ba' }}>{app.jobSector}</div>
                            <div style={{ fontSize: '0.85em', color: '#555' }}>{app.jobCategory}</div>
                          </td>
                          <td style={tdStyle}>{app.mobile1}</td>
                          <td style={tdStyle}>{app.email}</td>
                          <td style={tdStyle}>
                            <button onClick={() => handleDeleteApplication(app.id, app.referenceNumber)} style={actionBtnStyle('#dc3545')}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'vacancies' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ color: '#002b5e', margin: 0 }}>Job Vacancies Manager</h2>
              <button onClick={fetchJobsData} style={actionBtnStyle('#28a745')}>🔄 Refresh Data</button>
            </div>
            <p style={{ marginBottom: '1.5rem', color: '#555' }}>Update the exact number of remaining vacancies for each specific job. Jobs with 0 vacancies will be hidden from applicants.</p>
            
            {jobsError && <div style={{ color: 'red', marginBottom: '1rem' }}>{jobsError}</div>}
            
            {jobsLoading ? (
              <p>Loading jobs data...</p>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <button 
                    onClick={() => setGenderTab('Male')} 
                    style={{ ...tabStyle, background: genderTab === 'Male' ? '#0047ba' : '#fff', color: genderTab === 'Male' ? 'white' : '#0047ba', border: '2px solid #0047ba' }}
                  >
                    👨 Manage Male Vacancies
                  </button>
                  <button 
                    onClick={() => setGenderTab('Female')} 
                    style={{ ...tabStyle, background: genderTab === 'Female' ? '#e83e8c' : '#fff', color: genderTab === 'Female' ? 'white' : '#e83e8c', border: '2px solid #e83e8c' }}
                  >
                    👩 Manage Female Vacancies
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                  {Object.entries(jobsData).map(([sector, data]) => (
                    <div key={sector} style={{ border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', background: '#f8f9fa' }}>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: genderTab === 'Male' ? '#0047ba' : '#e83e8c', borderBottom: '2px solid #ddd', paddingBottom: '0.5rem' }}>
                        {sector}
                      </h3>
                    
                    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', color: '#555', fontWeight: 'bold' }}>Age Limit:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input 
                          type="number" 
                          min="18"
                          max="100"
                          placeholder="Min"
                          value={data.minAge !== undefined ? data.minAge : 18}
                          onChange={(e) => handleAgeLimitChange(sector, 'minAge', e.target.value)}
                          style={{ width: '60px', padding: '0.2rem', textAlign: 'center', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <span>-</span>
                        <input 
                          type="number" 
                          min="18"
                          max="100"
                          placeholder="Max"
                          value={data.maxAge !== undefined ? data.maxAge : 45}
                          onChange={(e) => handleAgeLimitChange(sector, 'maxAge', e.target.value)}
                          style={{ width: '60px', padding: '0.2rem', textAlign: 'center', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.5rem' }}>Specific Vacancies:</h4>
                      {data.jobs.map((job, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                          <span style={{ width: '75%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={job.title}>
                            {job.title}
                          </span>
                          <input 
                            type="number" 
                            min="0"
                            value={genderTab === 'Male' ? (job.maleVacancies || 0) : (job.femaleVacancies || 0)}
                            onChange={(e) => handleVacancyChange(sector, index, e.target.value)}
                            style={{ width: '60px', padding: '0.2rem', textAlign: 'center', border: '1px solid #ccc', borderRadius: '4px' }}
                          />
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => handleSaveVacancy(sector)} 
                      disabled={savingSector === sector}
                      style={{ ...actionBtnStyle('#0047ba'), width: '100%', opacity: savingSector === sector ? 0.7 : 1 }}
                    >
                      {savingSector === sector ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                ))}
              </div>
              </>
            )}
          </>
        )}

      </div>
    </main>
  );
}

const tabStyle = { padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.05rem', fontWeight: 'bold' };
const thStyle = { padding: '1rem', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '1rem' };
const actionBtnStyle = (bg) => ({ padding: '0.4rem 0.8rem', background: bg, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' });

export default AdminDashboard;
