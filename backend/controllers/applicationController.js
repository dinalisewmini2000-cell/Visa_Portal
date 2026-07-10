const pool = require('../config/db');
const crypto = require('crypto');
const { sendReferenceNumberEmail, sendVerificationCodeEmail, sendRemovalConfirmationEmail } = require('../services/emailService');

// Helper to format date for MySQL (YYYY-MM-DD)
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Create a new application
const createApplication = async (req, res) => {
  try {
    const {
      nicNumber, passportNumber, dateOfBirth, gender, surname, firstName, fathersName,
      passportExpireDate, maritalStatus, partnerNic, partnerPassport, partnerDob,
      partnerLastName, partnerFirstName, email, mobile1, addressLine1, addressLine2,
      town, district, jobSector, jobCategory
    } = req.body;
    
    // Generate unique reference number (e.g., REF-8A3B9C)
    const referenceNumber = 'REF-' + crypto.randomBytes(3).toString('hex').toUpperCase();

    const query = `
      INSERT INTO applications (
        referenceNumber, nicNumber, passportNumber, dateOfBirth, gender, surname, firstName, fathersName,
        passportExpireDate, maritalStatus, partnerNic, partnerPassport, partnerDob,
        partnerLastName, partnerFirstName, email, mobile1, addressLine1, addressLine2,
        town, district, jobSector, jobCategory
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      referenceNumber, nicNumber, passportNumber, formatDate(dateOfBirth), gender, surname, firstName, fathersName,
      formatDate(passportExpireDate), maritalStatus, partnerNic || null, partnerPassport || null, formatDate(partnerDob),
      partnerLastName || null, partnerFirstName || null, email, mobile1, addressLine1, addressLine2 || null,
      town, district, jobSector, jobCategory
    ];

    const [result] = await pool.execute(query, values);

    res.status(201).json({ id: result.insertId, referenceNumber, ...req.body });
  } catch (error) {
    console.error('Error saving application:', error);
    res.status(500).json({ message: 'Failed to submit application', error: error.message });
  }
};

// Check eligibility
const checkEligibility = async (req, res) => {
  try {
    const { nicNumber, passportNumber } = req.body;
    
    const [rows] = await pool.execute(
      'SELECT * FROM applications WHERE nicNumber = ? AND passportNumber = ?',
      [nicNumber, passportNumber]
    );
    
    if (rows.length > 0) {
      res.status(200).json({ eligible: true, application: rows[0] });
    } else {
      res.status(404).json({ eligible: false, message: 'No application found with these details.' });
    }
  } catch (error) {
    console.error('Error checking eligibility:', error);
    res.status(500).json({ message: 'Failed to check eligibility', error: error.message });
  }
};


// Remove application (Direct delete with NIC and Email)
const removeApplication = async (req, res) => {
  try {
    const { nicNumber, email } = req.body;
    
    // Check if it exists
    const [rows] = await pool.execute(
      'SELECT * FROM applications WHERE nicNumber = ? AND email = ?',
      [nicNumber, email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No application found with matching NIC and Email.' });
    }

    const application = rows[0];

    // Copy to removed_applications
    await pool.execute(
      `INSERT INTO removed_applications 
       (id, referenceNumber, nicNumber, passportNumber, dateOfBirth, gender, surname, firstName, fathersName, passportExpireDate, maritalStatus, partnerNic, partnerPassport, partnerDob, partnerLastName, partnerFirstName, email, mobile1, addressLine1, addressLine2, town, district, jobSector, jobCategory, verificationCode, verificationCodeExpires, createdAt, updatedAt, removedBy) 
       SELECT *, 'Applicant' FROM applications WHERE id = ?`,
      [application.id]
    );

    // If valid, delete
    const [result] = await pool.execute(
      'DELETE FROM applications WHERE id = ?',
      [application.id]
    );
    
    if (result.affectedRows > 0) {
      // Send confirmation Email (background)
      sendRemovalConfirmationEmail(application.email, application.referenceNumber);
      
      res.status(200).json({ success: true, message: 'Application removed successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Failed to remove application.' });
    }
  } catch (error) {
    console.error('Error removing application:', error);
    res.status(500).json({ message: 'Failed to remove application', error: error.message });
  }
};




// Get all applications
const getAllApplications = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM applications');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve applications', error: error.message });
  }
};

// Remove Application (Admin bypass)
const adminRemoveApplication = async (req, res) => {
  const { id } = req.params;
  try {
    // Copy to removed_applications
    await pool.execute(
      `INSERT INTO removed_applications 
       (id, referenceNumber, nicNumber, passportNumber, dateOfBirth, gender, surname, firstName, fathersName, passportExpireDate, maritalStatus, partnerNic, partnerPassport, partnerDob, partnerLastName, partnerFirstName, email, mobile1, addressLine1, addressLine2, town, district, jobSector, jobCategory, verificationCode, verificationCodeExpires, createdAt, updatedAt, removedBy) 
       SELECT *, 'Admin' FROM applications WHERE id = ?`,
      [id]
    );

    const [result] = await pool.execute('DELETE FROM applications WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Application successfully removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createApplication,
  checkEligibility,
  removeApplication,
  getAllApplications,
  adminRemoveApplication
};
