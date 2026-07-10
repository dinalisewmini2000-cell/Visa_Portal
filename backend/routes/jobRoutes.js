const express = require('express');
const router = express.Router();
const { getAllJobs, updateJobSectorGenders } = require('../controllers/jobController');

router.get('/', getAllJobs);
router.put('/', updateJobSectorGenders);

module.exports = router;
