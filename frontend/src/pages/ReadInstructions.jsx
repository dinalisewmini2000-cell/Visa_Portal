import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ReadInstructions() {
  const [jobsData, setJobsData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/jobs');
        setJobsData(response.data);
      } catch (err) {
        console.error("Failed to fetch jobs data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading vacancies...</div>;
  }

  const maleSectors = Object.keys(jobsData);
  const femaleSectors = Object.keys(jobsData);

  return (
    <main className="main-content" style={{ padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '2rem', color: 'var(--primary)', textAlign: 'center' }}>Available Job Slots & Instructions</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Male Jobs */}
          <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ color: 'var(--text-main)', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Male Vacancies</h3>

            
            <h4 style={{ marginBottom: '1rem' }}>Available slots per job category:</h4>
            {maleSectors.map(sector => (
              <div key={sector} style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ color: 'var(--primary-dark)', marginBottom: '0.5rem', fontSize: '1rem' }}>{sector}</h5>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {jobsData[sector].jobs.map((job, index) => (
                    <li key={index} style={{ color: (job.maleVacancies || 0) > 0 ? '#155724' : '#d32f2f', marginBottom: '0.25rem', fontWeight: '600', fontSize: '0.9rem' }}>
                      • {index + 1}. {job.title} – {(job.maleVacancies || 0) > 0 ? `${job.maleVacancies} Slots` : '0'}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Female Jobs */}
          <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ color: 'var(--text-main)', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Female Vacancies</h3>


            <h4 style={{ marginBottom: '1rem' }}>Available slots per job category:</h4>
            {femaleSectors.map(sector => (
              <div key={sector} style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ color: 'var(--primary-dark)', marginBottom: '0.5rem', fontSize: '1rem' }}>{sector}</h5>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {jobsData[sector].jobs.map((job, index) => (
                    <li key={index} style={{ color: (job.femaleVacancies || 0) > 0 ? '#155724' : '#d32f2f', marginBottom: '0.25rem', fontWeight: '600', fontSize: '0.9rem' }}>
                      • {index + 1}. {job.title} – {(job.femaleVacancies || 0) > 0 ? `${job.femaleVacancies} Slots` : '0'}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ReadInstructions;
