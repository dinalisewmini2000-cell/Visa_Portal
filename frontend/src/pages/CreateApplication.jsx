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
    <main className="main-content" style={{ padding: '2rem', background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', background: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        
        {/* Success Modal Overlay */}
        {message && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
          }}>
            <div style={{
              background: 'white', padding: '3rem', borderRadius: '12px', textAlign: 'center', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)', maxWidth: '500px', animation: 'fadeInUp 0.3s ease-out'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ color: '#155724', marginBottom: '1rem' }}>Success!</h2>
              <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '2rem' }}>{message}</p>
              <button 
                onClick={() => setMessage('')} 
                style={{ background: '#0047ba', color: 'white', border: 'none', padding: '0.75rem 2rem', fontSize: '1.1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Global Error Message */}
        {errorMsg && (
          <div style={{
            position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
            background: '#f8d7da', color: '#721c24', padding: '1rem 2rem', borderRadius: '8px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 9999, fontWeight: 'bold', border: '1px solid #f5c6cb'
          }}>
            ❌ {errorMsg}
            <button onClick={() => setErrorMsg('')} style={{ background: 'none', border: 'none', marginLeft: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
          </div>
        )}

        <div style={{ padding: '1rem 2rem' }}>
          <p style={{ color: '#d32f2f', fontWeight: 'bold', margin: '1rem 0' }}>
            Please fill in <span style={{ textDecoration: 'underline' }}>English</span> and <span style={{ textDecoration: 'underline' }}>Block Letters</span>. All ( * ) marked fields are mandatory.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* PERSONAL DETAILS SECTION */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={sectionHeaderStyle}>
              <span>👤</span> PERSONAL DETAILS
            </div>
            <div style={sectionBodyStyle}>
              {/* Row 1 */}
              <div style={rowStyle}>
                <div style={colStyle}>
                  <label style={labelStyle}>NIC Number <span style={starStyle}>*</span></label>
                  <input required type="text" name="nicNumber" value={formData.nicNumber} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={colStyle}>
                  <label style={labelStyle}>Passport Number <span style={starStyle}>*</span></label>
                  <input required type="text" name="passportNumber" value={formData.passportNumber} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={colStyle}>
                  <label style={labelStyle}>Date of Birth <span style={starStyle}>*</span></label>
                  <input required type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={colStyle}>
                  <label style={labelStyle}>Gender <span style={starStyle}>*</span></label>
                  <select required name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                    <option value="">-Select Gender-</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div style={rowStyle}>
                <div style={{ ...colStyle, flex: 1 }}>
                  <label style={labelStyle}>Surname (Last Name)<span style={starStyle}>*</span></label>
                  <input required type="text" name="surname" value={formData.surname} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ ...colStyle, flex: 1 }}>
                  <label style={labelStyle}>Other Name(First Name)<span style={starStyle}>*</span></label>
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              {/* Row 3 */}
              <div style={rowStyle}>
                <div style={{ ...colStyle, flex: 2 }}>
                  <label style={labelStyle}>Father's Name (Full Name)<span style={starStyle}>*</span></label>
                  <input required type="text" name="fathersName" value={formData.fathersName} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ ...colStyle, flex: 1 }}>
                  <label style={labelStyle}>Passport Expire Date <span style={starStyle}>*</span></label>
                  <input required type="date" name="passportExpireDate" value={formData.passportExpireDate} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ ...colStyle, flex: 1 }}>
                  <label style={labelStyle}>Marital Status <span style={starStyle}>*</span></label>
                  <select required name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} style={inputStyle}>
                    <option value="">-- Select --</option>
                    <option value="Married">Married</option>
                    <option value="Single">Single</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* PARTNER DETAILS SECTION (Only if Married) */}
          {formData.maritalStatus === 'Married' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={sectionHeaderStyle}>
                <span>👥</span> PARTNER DETAILS ( Husband/Wife )
              </div>
              <div style={sectionBodyStyle}>
                {/* Row 1 */}
                <div style={rowStyle}>
                  <div style={colStyle}>
                    <label style={labelStyle}>Partner's NIC Number <span style={starStyle}>*</span></label>
                    <input required type="text" name="partnerNic" value={formData.partnerNic} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={colStyle}>
                    <label style={labelStyle}>Partner's Passport Number</label>
                    <input type="text" name="partnerPassport" value={formData.partnerPassport} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={colStyle}>
                    <label style={labelStyle}>Partner's Date of Birth <span style={starStyle}>*</span></label>
                    <input required type="date" name="partnerDob" value={formData.partnerDob} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>
                {/* Row 2 */}
                <div style={rowStyle}>
                  <div style={colStyle}>
                    <label style={labelStyle}>Partner's Last Name <span style={starStyle}>*</span></label>
                    <input required type="text" name="partnerLastName" value={formData.partnerLastName} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={colStyle}>
                    <label style={labelStyle}>Partner's First Name <span style={starStyle}>*</span></label>
                    <input required type="text" name="partnerFirstName" value={formData.partnerFirstName} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTACT DETAILS SECTION */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={sectionHeaderStyle}>
              <span>📞</span> CONTACT DETAILS
            </div>
            <div style={sectionBodyStyle}>
              <p style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                All future communication will be sent to the primary mobile number provided. Submission of false information may result in not receiving further updates, and the visa authority will not be held responsible.
              </p>
              
              {/* Row 1 */}
              <div style={rowStyle}>
                <div style={{ ...colStyle, flex: 1 }}>
                  <label style={labelStyle}>Email Address <span style={starStyle}>*</span></label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ ...colStyle, flex: 1 }}>
                  <label style={labelStyle}>Primary Mobile Number <span style={starStyle}>*</span></label>
                  <input required type="tel" name="mobile1" value={formData.mobile1} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              {/* Row 2 */}
              <div style={rowStyle}>
                <div style={colStyle}>
                  <label style={labelStyle}>Address Line 1 <span style={starStyle}>*</span></label>
                  <input required type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={colStyle}>
                  <label style={labelStyle}>Address Line 2</label>
                  <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              {/* Row 3 */}
              <div style={rowStyle}>
                <div style={colStyle}>
                  <label style={labelStyle}>Town <span style={starStyle}>*</span></label>
                  <input required type="text" name="town" value={formData.town} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={colStyle}>
                  <label style={labelStyle}>District <span style={starStyle}>*</span></label>
                  <select required name="district" value={formData.district} onChange={handleChange} style={inputStyle}>
                    <option value="">-Select District-</option>
                    {districtsOfSriLanka.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* APPLIED JOB SECTION */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={sectionHeaderStyle}>
              <span>💼</span> APPLIED JOB
            </div>
            <div style={sectionBodyStyle}>
              {!formData.gender ? (
                <p style={{ color: '#666', fontStyle: 'italic', padding: '1rem 0' }}>Please select your Gender in the Personal Details section first.</p>
              ) : (
                <div style={rowStyle}>
                  <div style={colStyle}>
                    <label style={labelStyle}>Job Sector <span style={starStyle}>*</span></label>
                    <select required name="jobSector" value={formData.jobSector} onChange={handleChange} style={inputStyle}>
                      <option value="">-Select Sector-</option>
                      {availableSectors.map(sector => (
                        <option key={sector} value={sector}>{sector}</option>
                      ))}
                    </select>
                  </div>
                  <div style={colStyle}>
                    <label style={labelStyle}>Job Category <span style={starStyle}>*</span></label>
                    <select required name="jobCategory" value={formData.jobCategory} onChange={handleChange} style={inputStyle} disabled={!formData.jobSector}>
                      <option value="">-Select Category-</option>
                      {availableJobs.map(job => (
                        <option key={job.title} value={job.title}>{job.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ padding: '1rem 2rem 3rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={loading} style={{ 
              background: '#0047ba', 
              color: 'white', 
              padding: '0.75rem 2rem', 
              border: 'none', 
              borderRadius: '4px', 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {loading ? 'Submitting...' : <><span>📄</span> Submit Details</>}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

// Reusable Styles
const sectionHeaderStyle = {
  background: '#0047ba',
  color: 'white',
  padding: '0.6rem 1.5rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  textTransform: 'uppercase'
};

const sectionBodyStyle = {
  background: '#eef2f9',
  padding: '1.5rem',
  border: '1px solid #d4def0',
  borderTop: 'none'
};

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1.5rem',
  marginBottom: '1.5rem'
};

const colStyle = {
  flex: '1 1 200px',
  display: 'flex',
  flexDirection: 'column'
};

const labelStyle = {
  fontWeight: '600',
  color: '#0047ba',
  marginBottom: '0.3rem',
  fontSize: '0.9rem'
};

const starStyle = {
  color: 'red'
};

const inputStyle = {
  padding: '0.5rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '1rem',
  background: 'white',
  width: '100%'
};

export default CreateApplication;
