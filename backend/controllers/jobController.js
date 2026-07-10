const pool = require('../config/db');

// Get all jobs data, format it back into the frontend structure
const getAllJobs = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM jobs_data');
    
    // Convert array of rows back into the object structure frontend expects
    const jobsDataObj = {};
    rows.forEach(row => {
      let parsedJobs = row.jobs;
      if (typeof parsedJobs === 'string') parsedJobs = JSON.parse(parsedJobs);

      jobsDataObj[row.sector] = {
        jobs: parsedJobs,
        minAge: row.minAge,
        maxAge: row.maxAge
      };
    });

    res.status(200).json(jobsDataObj);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve jobs data', error: error.message });
  }
};

// Update allowed genders for a specific job sector
const updateJobSectorGenders = async (req, res) => {
  const { sector, jobs, minAge, maxAge } = req.body;

  if (!sector) {
    return res.status(400).json({ message: 'Invalid data format' });
  }

  try {
    if (jobs && minAge !== undefined && maxAge !== undefined) {
      await pool.execute(
        'UPDATE jobs_data SET jobs = ?, minAge = ?, maxAge = ? WHERE sector = ?',
        [JSON.stringify(jobs), minAge, maxAge, sector]
      );
    } else if (jobs) {
      await pool.execute(
        'UPDATE jobs_data SET jobs = ? WHERE sector = ?',
        [JSON.stringify(jobs), sector]
      );
    } else if (minAge !== undefined && maxAge !== undefined) {
      await pool.execute(
        'UPDATE jobs_data SET minAge = ?, maxAge = ? WHERE sector = ?',
        [minAge, maxAge, sector]
      );
    }
    res.status(200).json({ message: 'Job sector updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update job sector', error: error.message });
  }
};

module.exports = {
  getAllJobs,
  updateJobSectorGenders
};
