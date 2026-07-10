import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CheckEligibility() {
  // Pre-Application Checker State
  const [preCheckData, setPreCheckData] = useState({ gender: '', jobSector: '', jobCategory: '', age: '' });
  const [preCheckResult, setPreCheckResult] = useState(null);

  // Status Checker State
  const [statusData, setStatusData] = useState({ nicNumber: '', passportNumber: '' });
  const [loading, setLoading] = useState(false);
  const [statusResult, setStatusResult] = useState(null);
  const [statusError, setStatusError] = useState('');

  const [jobsData, setJobsData] = useState({});
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/jobs');
        setJobsData(response.data);
      } catch (err) {
        console.error("Failed to fetch jobs data", err);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  // Pre-Application Handlers
  const handlePreCheckChange = (e) => {
    const { name, value } = e.target;
    setPreCheckData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'gender' ? { jobSector: '', jobCategory: '' } : {}),
      ...(name === 'jobSector' ? { jobCategory: '' } : {})
    }));
    setPreCheckResult(null); // reset result on change
  };

  const handlePreCheckSubmit = (e) => {
    e.preventDefault();
    if (!preCheckData.gender || !preCheckData.jobSector || !preCheckData.jobCategory || !preCheckData.age) return;
    
    if (parseInt(preCheckData.age) < 18) {
      setPreCheckResult({ 
        eligible: false, 
        message: `Sorry, you must be at least 18 years old to apply for a work visa.` 
      });
      return;
    }

    const sectorInfo = jobsData[preCheckData.jobSector];
    const minAge = sectorInfo.minAge !== undefined ? sectorInfo.minAge : 18;
    const maxAge = sectorInfo.maxAge !== undefined ? sectorInfo.maxAge : 45;
    const applicantAge = parseInt(preCheckData.age);
    
    if (applicantAge < minAge || applicantAge > maxAge) {
      setPreCheckResult({ 
        eligible: false, 
        message: `Sorry, the age limit for the ${preCheckData.jobSector} sector is strictly between ${minAge} and ${maxAge} years.` 
      });
      return;
    }

    const selectedJob = sectorInfo.jobs.find(j => j.title === preCheckData.jobCategory);
    let jobVacancies = 0;
    if (selectedJob) {
      jobVacancies = preCheckData.gender === 'Male' ? (selectedJob.maleVacancies || 0) : (selectedJob.femaleVacancies || 0);
    }

    if (jobVacancies > 0) {
      setPreCheckResult({ 
        eligible: true, 
        message: `Good news! We currently have ${jobVacancies} vacancies for ${preCheckData.gender}s for the role of ${preCheckData.jobCategory}. You are eligible to apply.` 
      });
    } else {
      setPreCheckResult({ 
        eligible: false, 
        message: `Sorry, we are currently not accepting applications from ${preCheckData.gender}s for the role of ${preCheckData.jobCategory}.` 
      });
    }
  };

  // Status Check Handlers
  const handleStatusChange = (e) => {
    setStatusData({ ...statusData, [e.target.name]: e.target.value });
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusResult(null);
    setStatusError('');
    
    try {
      const response = await axios.post('/api/applications/check-eligibility', statusData);
      setStatusResult(response.data);
    } catch (err) {
      setStatusError(err.response?.data?.message || 'Failed to check status.');
    } finally {
      setLoading(false);
    }
  };

  const availableJobs = preCheckData.jobSector && jobsData[preCheckData.jobSector] 
    ? jobsData[preCheckData.jobSector].jobs
    : [];

  return (
    <main className="main-content" style={{ padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)', textTransform: 'uppercase', textAlign: 'center' }}>Eligibility & Status Portal</h2>
        
        {/* SECTION 1: Pre-Application Checker */}
        <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: 'var(--radius)', marginBottom: '2.5rem', background: '#f8f9fa' }}>
          <h3 style={{ color: '#333', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span>📋</span> Step 1: Pre-Application Vacancy Check</h3>
          <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Before applying, check if there are vacancies available for your gender in your desired job sector.</p>
          
          <form onSubmit={handlePreCheckSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr', alignItems: 'end' }}>
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold' }}>
              Your Age
              <input required type="number" min="1" max="100" name="age" value={preCheckData.age} onChange={handlePreCheckChange} style={inputStyle} placeholder="E.g. 25" />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold' }}>
              Your Gender
              <select required name="gender" value={preCheckData.gender} onChange={handlePreCheckChange} style={inputStyle}>
                <option value="">- Select Gender -</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold' }}>
              Desired Job Sector
              <select required name="jobSector" value={preCheckData.jobSector} onChange={handlePreCheckChange} style={inputStyle}>
                <option value="">- Select Sector -</option>
                {Object.keys(jobsData).map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold' }}>
              Specific Job Role
              <select required name="jobCategory" value={preCheckData.jobCategory} onChange={handlePreCheckChange} style={inputStyle} disabled={!preCheckData.jobSector}>
                <option value="">- Select Role -</option>
                {availableJobs.map(job => (
                  <option key={job.title} value={job.title}>{job.title}</option>
                ))}
              </select>
            </label>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" style={{ ...buttonStyle, width: '100%' }}>Check Vacancies</button>
            </div>
          </form>

          {preCheckResult && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '4px', background: preCheckResult.eligible ? '#d4edda' : '#f8d7da', color: preCheckResult.eligible ? '#155724' : '#721c24', border: `1px solid ${preCheckResult.eligible ? '#c3e6cb' : '#f5c6cb'}` }}>
              <strong>{preCheckResult.eligible ? '✅ Eligible' : '❌ Not Eligible'}:</strong> {preCheckResult.message}
            </div>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '2px dashed #ccc', margin: '2rem 0' }} />

        {/* SECTION 2: Application Status Checker */}
        <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: 'var(--radius)', background: '#fff' }}>
          <h3 style={{ color: '#333', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span>🔍</span> Step 2: Existing Application Status</h3>
          <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem' }}>If you have already submitted an application, enter your details below to check its current status in the system.</p>

          <form onSubmit={handleStatusSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr', alignItems: 'end' }}>
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold' }}>
              NIC Number
              <input required type="text" name="nicNumber" placeholder="Enter NIC number" value={statusData.nicNumber} onChange={handleStatusChange} style={inputStyle} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold' }}>
              Passport Number
              <input required type="text" name="passportNumber" placeholder="Enter Passport number" value={statusData.passportNumber} onChange={handleStatusChange} style={inputStyle} />
            </label>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" disabled={loading} style={{ ...buttonStyle, width: '100%', background: loading ? '#6c757d' : 'var(--primary)', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Checking...' : 'Check Status'}
              </button>
            </div>
          </form>

          {statusError && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
              {statusError}
            </div>
          )}

          {statusResult && (
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#d4edda', color: '#155724', borderRadius: '4px', border: '1px solid #c3e6cb' }}>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>✅ Application Found</h4>
              <p>An active application is registered for <strong>{statusResult.application.firstName} {statusResult.application.surname}</strong>.</p>
              <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                <li><strong>Applied Sector:</strong> {statusResult.application.jobSector}</li>
                <li><strong>Applied Role:</strong> {statusResult.application.jobCategory}</li>
                <li><strong>Primary Mobile:</strong> {statusResult.application.mobile1}</li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

const inputStyle = {
  width: '100%', padding: '0.75rem', marginTop: '0.5rem',
  border: '1px solid #ccc', borderRadius: '4px',
  fontSize: '1rem', background: '#fff'
};

const buttonStyle = {
  background: 'var(--primary)', color: 'white', padding: '0.75rem', 
  border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold', 
  cursor: 'pointer'
};

export default CheckEligibility;
