const express = require('express');
const router = express.Router();
const { 
  createApplication, 
  checkEligibility, 
  removeApplication, 
  getAllApplications,
  adminRemoveApplication
} = require('../controllers/applicationController');

// Define routes and attach controller functions
router.post('/', createApplication);
router.post('/check-eligibility', checkEligibility);
router.delete('/remove', removeApplication);
router.get('/', getAllApplications);
router.delete('/admin/:id', adminRemoveApplication);

module.exports = router;
