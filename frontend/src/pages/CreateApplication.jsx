import React, { useState, useEffect } from 'react';
import axios from 'axios';

const districtsOfSriLanka = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", 
  "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", 
  "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Moneragala", 
  "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", 
  "Trincomalee", "Vavuniya"
].sort();

function CreateApplication() {
  const [formData, setFormData] = useState({
    nicNumber: '', passportNumber: '', dateOfBirth: '', gender: '',
    surname: '', firstName: '', fathersName: '', passportExpireDate: '', maritalStatus: '',
    partnerLastName: '', partnerFirstName: '',
    email: '', mobile1: '', addressLine1: '', addressLine2: '', town: '', district: '',
    jobSector: '', jobCategory: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'gender' ? { jobSector: '', jobCategory: '' } : {}),
      ...(name === 'jobSector' ? { jobCategory: '' } : {})
    }));
  };

  const validateForm = () => {
    const nicRegex = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
    if (!nicRegex.test(formData.nicNumber)) return "Invalid NIC Number format.";
    const passportRegex = /^[A-Za-z0-9]{7,9}$/;
    if (!passportRegex.test(formData.passportNumber)) return "Invalid Passport Number format.";

    const dob = new Date(formData.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    if (age < 18) return "You must be at least 18 years old to apply.";

    const expiry = new Date(formData.passportExpireDate);
    if (expiry <= today) return "Passport Expire Date must be in the future.";

    const mobileRegex = /^0[0-9]{9}$/;
    if (!mobileRegex.test(formData.mobile1)) return "Mobile Number must be 10 digits and start with 0.";

    if (formData.maritalStatus === 'Married') {
      if (!nicRegex.test(formData.partnerNic)) return "Invalid Partner NIC Number format.";
      if (!formData.partnerDob) return "Partner Date of Birth is required.";
      if (!formData.partnerLastName) return "Partner Last Name is required.";
      if (!formData.partnerFirstName) return "Partner First Name is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Invalid Email Address format.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setMessage('');
    
    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/applications', formData);
      
      // Artificial delay of 5 seconds to simulate processing
      await new Promise(resolve => setTimeout(resolve, 5000));

      setMessage(`✅ Application submitted successfully! We have safely received your details.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setFormData({
        nicNumber: '', passportNumber: '', dateOfBirth: '', gender: '',
        surname: '', firstName: '', fathersName: '', passportExpireDate: '', maritalStatus: '',
        partnerNic: '', partnerPassport: '', partnerDob: '', partnerLastName: '', partnerFirstName: '',
        email: '', mobile1: '', addressLine1: '', addressLine2: '', town: '', district: '',
        jobSector: '', jobCategory: ''
      });
    } catch (error) {
      setErrorMsg('Failed to submit application. Ensure the backend server is running and credentials are correct.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const availableSectors = Object.keys(jobsData).filter(sector => {
    if (!formData.gender) return false;
    return true;
  });

  const availableJobs = formData.jobSector && jobsData[formData.jobSector] 
    ? jobsData[formData.jobSector].jobs.filter(job => {
        if (formData.gender === 'Male') return (job.maleVacancies || 0) > 0;
        if (formData.gender === 'Female') return (job.femaleVacancies || 0) > 0;
        return false;
      })
    : [];

  return (
    <main className="main-content" style={{ padding: '3rem 1.5rem', background: 'linear-gradient(to bottom, #f8fafc, #eff6ff)', minHeight: '100vh' }}>
      <style>{`
        .create-app-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #cbd5e1;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025);
          padding: 2.5rem;
          margin-bottom: 2.5rem;
          transition: all 0.3s ease;
          border-left: 6px solid #cbd5e1;
        }
        .create-app-card:hover {
          box-shadow: 0 12px 20px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
        }
        
        /* Colorful left border accents */
        .card-personal { border-left-color: #2563eb; }
        .card-partner { border-left-color: #7c3aed; }
        .card-contact { border-left-color: #e11d48; }
        .card-job { border-left-color: #059669; }

        .create-app-section-header {
          font-size: 1.45rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 1rem;
        }
        
        /* Colored badges for header emojis */
        .header-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.35rem;
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .header-icon-personal { background-color: #dbeafe; color: #1e40af; }
        .header-icon-partner { background-color: #f3e8ff; color: #6b21a8; }
        .header-icon-contact { background-color: #ffe4e6; color: #9f1239; }
        .header-icon-job { background-color: #d1fae5; color: #065f46; }

        .create-app-label {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.6rem;
          display: block;
        }
        .create-app-input {
          width: 100%;
          padding: 0.85rem 1.1rem;
          font-size: 1.05rem;
          border: 1px solid #94a3b8;
          border-radius: 10px;
          background-color: #f8fafc;
          color: #0f172a;
          transition: all 0.2s ease-in-out;
          outline: none;
        }
        .create-app-input:focus {
          outline: none;
        }
        .create-app-input:hover:not(:focus) {
          border-color: #64748b;
        }
        
        /* Focused styling customized per section color-theme */
        .card-personal .create-app-input:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15); background-color: #fff; }
        .card-partner .create-app-input:focus { border-color: #7c3aed; box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.15); background-color: #fff; }
        .card-contact .create-app-input:focus { border-color: #e11d48; box-shadow: 0 0 0 4px rgba(225, 29, 72, 0.15); background-color: #fff; }
        .card-job .create-app-input:focus { border-color: #059669; box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.15); background-color: #fff; }

        .create-app-button {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          padding: 0.95rem 2.25rem;
          font-size: 1.1rem;
          font-weight: 700;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
          transition: all 0.2s ease;
        }
        .create-app-button:hover {
          background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
          transform: translateY(-1px);
        }
        .create-app-button:active {
          transform: translateY(0);
        }
        .create-app-button:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-spin-custom {
          animation: spin 1s linear infinite;
        }
        .animate-scale-up {
          animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Success Modal Overlay */}
        {message && (
          <div className="animate-fade-in" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
          }}>
            <div style={{
              background: 'white', padding: '3rem', borderRadius: '24px', textAlign: 'center', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxWidth: '450px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem'
            }} className="animate-scale-up">
              <div style={{
                width: '80px', height: '80px', background: '#ecfdf5',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3rem', color: '#10b981',
                boxShadow: '0 0 0 8px #f0fdf4'
              }}>
                ✓
              </div>
              <div>
                <h2 style={{ color: '#065f46', fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>Submission Successful!</h2>
                <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: '1.6' }}>{message}</p>
              </div>
              <button 
                onClick={() => setMessage('')} 
                className="create-app-button"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                Close Window
              </button>
            </div>
          </div>
        )}

        {/* Global Error Message */}
        {errorMsg && (
          <div className="animate-fade-in" style={{
            position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
            background: '#fef2f2', color: '#991b1b', padding: '1rem 1.5rem', borderRadius: '12px', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            zIndex: 9999, fontWeight: '600', border: '1px solid #fee2e2',
            display: 'flex', alignItems: 'center', gap: '0.75rem'
          }}>
            <span style={{ fontSize: '1.25rem' }}>❌</span>
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} style={{ 
              background: 'none', border: 'none', color: '#991b1b', 
              cursor: 'pointer', marginLeft: '1rem', fontSize: '1.2rem', padding: '0 4px'
            }}>×</button>
          </div>
        )}

        {/* Submitting Loading Overlay */}
        {loading && (
          <div className="animate-fade-in" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 9999
          }}>
            <div style={{
              background: 'white', padding: '3rem', borderRadius: '24px', textAlign: 'center', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxWidth: '400px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem'
            }} className="animate-scale-up">
              <div style={{
                width: '60px', height: '60px',
                border: '4px solid #e2e8f0', borderTop: '4px solid #2563eb',
                borderRadius: '50%'
              }} className="animate-spin-custom"></div>
              <div>
                <h3 style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>Submitting Application</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>We are processing and securing your application details. Please do not close this window.</p>
              </div>
            </div>
          </div>
        )}

        {/* Warning Banner */}
        <div style={{
          background: '#fffbeb',
          borderLeft: '4px solid #f59e0b',
          padding: '1.25rem 1.75rem',
          borderRadius: '10px',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#b45309',
          fontWeight: '600',
          fontSize: '1.1rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div>
            Please fill in <strong style={{ textDecoration: 'underline' }}>English</strong> and <strong style={{ textDecoration: 'underline' }}>Block Letters</strong>. All fields marked with <span style={{ color: '#ef4444' }}>*</span> are mandatory.
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* PERSONAL DETAILS SECTION */}
          <div className="create-app-card card-personal">
            <h2 className="create-app-section-header">
              <span className="header-icon-wrap header-icon-personal">👤</span>
              <span style={{ color: '#1e40af' }}>Personal Details</span>
            </h2>
            
            {/* Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="create-app-label">NIC Number <span style={{ color: '#ef4444' }}>*</span></label>
                <input required type="text" name="nicNumber" value={formData.nicNumber} onChange={handleChange} className="create-app-input" placeholder="e.g. 199912345678" />
              </div>
              <div>
                <label className="create-app-label">Passport Number <span style={{ color: '#ef4444' }}>*</span></label>
                <input required type="text" name="passportNumber" value={formData.passportNumber} onChange={handleChange} className="create-app-input" placeholder="e.g. N1234567" />
              </div>
              <div>
                <label className="create-app-label">Date of Birth <span style={{ color: '#ef4444' }}>*</span></label>
                <input required type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="create-app-input" />
              </div>
              <div>
                <label className="create-app-label">Gender <span style={{ color: '#ef4444' }}>*</span></label>
                <select required name="gender" value={formData.gender} onChange={handleChange} className="create-app-input">
                  <option value="">-Select Gender-</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="create-app-label">Surname (Last Name) <span style={{ color: '#ef4444' }}>*</span></label>
                <input required type="text" name="surname" value={formData.surname} onChange={handleChange} className="create-app-input" placeholder="Enter last name" />
              </div>
              <div>
                <label className="create-app-label">Other Name (First Name) <span style={{ color: '#ef4444' }}>*</span></label>
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="create-app-input" placeholder="Enter first name" />
              </div>
            </div>

            {/* Row 3 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ flex: '2 1 auto' }}>
                <label className="create-app-label">Father's Name (Full Name) <span style={{ color: '#ef4444' }}>*</span></label>
                <input required type="text" name="fathersName" value={formData.fathersName} onChange={handleChange} className="create-app-input" placeholder="Enter father's full name" />
              </div>
              <div>
                <label className="create-app-label">Passport Expire Date <span style={{ color: '#ef4444' }}>*</span></label>
                <input required type="date" name="passportExpireDate" value={formData.passportExpireDate} onChange={handleChange} className="create-app-input" />
              </div>
              <div>
                <label className="create-app-label">Marital Status <span style={{ color: '#ef4444' }}>*</span></label>
                <select required name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="create-app-input">
                  <option value="">-- Select --</option>
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>
          </div>

          {/* PARTNER DETAILS SECTION (Only if Married) */}
          {formData.maritalStatus === 'Married' && (
            <div className="create-app-card card-partner">
              <h2 className="create-app-section-header">
                <span className="header-icon-wrap header-icon-partner">👥</span>
                <span style={{ color: '#6b21a8' }}>Partner Details ( Husband/Wife )</span>
              </h2>
              
              {/* Row 1 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="create-app-label">Partner's NIC Number <span style={{ color: '#ef4444' }}>*</span></label>
                  <input required type="text" name="partnerNic" value={formData.partnerNic || ''} onChange={handleChange} className="create-app-input" placeholder="Partner's NIC" />
                </div>
                <div>
                  <label className="create-app-label">Partner's Passport Number</label>
                  <input type="text" name="partnerPassport" value={formData.partnerPassport || ''} onChange={handleChange} className="create-app-input" placeholder="Partner's passport (optional)" />
                </div>
                <div>
                  <label className="create-app-label">Partner's Date of Birth <span style={{ color: '#ef4444' }}>*</span></label>
                  <input required type="date" name="partnerDob" value={formData.partnerDob || ''} onChange={handleChange} className="create-app-input" />
                </div>
              </div>
              
              {/* Row 2 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label className="create-app-label">Partner's Last Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input required type="text" name="partnerLastName" value={formData.partnerLastName || ''} onChange={handleChange} className="create-app-input" placeholder="Partner's last name" />
                </div>
                <div>
                  <label className="create-app-label">Partner's First Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input required type="text" name="partnerFirstName" value={formData.partnerFirstName || ''} onChange={handleChange} className="create-app-input" placeholder="Partner's first name" />
                </div>
              </div>
            </div>
          )}

          {/* CONTACT DETAILS SECTION */}
          <div className="create-app-card card-contact">
            <h2 className="create-app-section-header">
              <span className="header-icon-wrap header-icon-contact">📞</span>
              <span style={{ color: '#9f1239' }}>Contact Details</span>
            </h2>
            
            <div style={{
              background: '#fef2f2',
              borderLeft: '4px solid #ef4444',
              padding: '1rem 1.5rem',
              borderRadius: '8px',
              color: '#991b1b',
              fontSize: '0.95rem',
              marginBottom: '1.5rem',
              lineHeight: '1.5',
              fontWeight: '600'
            }}>
              ⚠️ All future communication will be sent to the primary mobile number provided. Submission of false information may result in not receiving further updates.
            </div>
            
            {/* Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="create-app-label">Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="create-app-input" placeholder="e.g. name@domain.com" />
              </div>
              <div>
                <label className="create-app-label">Primary Mobile Number <span style={{ color: '#ef4444' }}>*</span></label>
                <input required type="tel" name="mobile1" value={formData.mobile1} onChange={handleChange} className="create-app-input" placeholder="e.g. 0771234567" />
              </div>
            </div>

            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="create-app-label">Address Line 1 <span style={{ color: '#ef4444' }}>*</span></label>
                <input required type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="create-app-input" placeholder="Street name, street number" />
              </div>
              <div>
                <label className="create-app-label">Address Line 2</label>
                <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} className="create-app-input" placeholder="Apartment, unit, suite (optional)" />
              </div>
            </div>

            {/* Row 3 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label className="create-app-label">Town <span style={{ color: '#ef4444' }}>*</span></label>
                <input required type="text" name="town" value={formData.town} onChange={handleChange} className="create-app-input" placeholder="Enter town" />
              </div>
              <div>
                <label className="create-app-label">District <span style={{ color: '#ef4444' }}>*</span></label>
                <select required name="district" value={formData.district} onChange={handleChange} className="create-app-input">
                  <option value="">-Select District-</option>
                  {districtsOfSriLanka.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* APPLIED JOB SECTION */}
          <div className="create-app-card card-job">
            <h2 className="create-app-section-header">
              <span className="header-icon-wrap header-icon-job">💼</span>
              <span style={{ color: '#065f46' }}>Applied Job</span>
            </h2>
            
            {!formData.gender ? (
              <div style={{
                background: '#f8fafc',
                border: '2px dashed #e2e8f0',
                borderRadius: '12px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                color: '#64748b'
              }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>🔒</span>
                Please select your <strong>Gender</strong> in the Personal Details section first to unlock available jobs.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label className="create-app-label">Job Sector <span style={{ color: '#ef4444' }}>*</span></label>
                  <select required name="jobSector" value={formData.jobSector} onChange={handleChange} className="create-app-input">
                    <option value="">-Select Sector-</option>
                    {availableSectors.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="create-app-label">Job Category <span style={{ color: '#ef4444' }}>*</span></label>
                  <select required name="jobCategory" value={formData.jobCategory} onChange={handleChange} className="create-app-input" disabled={!formData.jobSector}>
                    <option value="">-Select Category-</option>
                    {availableJobs.map(job => (
                      <option key={job.title} value={job.title}>{job.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', paddingBottom: '3rem' }}>
            <button type="submit" disabled={loading} className="create-app-button">
              <span>📄</span> Submit Application
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CreateApplication;
