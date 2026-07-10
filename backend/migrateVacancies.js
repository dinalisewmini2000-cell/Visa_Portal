const pool = require('./config/db');

async function migrate() {
  try {
    const connection = await pool.getConnection();

    console.log("Fetching existing job data...");
    const [rows] = await connection.execute('SELECT * FROM jobs_data');

    for (let row of rows) {
      let jobs = typeof row.jobs === 'string' ? JSON.parse(row.jobs) : row.jobs;
      
      const newJobs = jobs.map(j => {
        return {
          title: j.title,
          maleVacancies: j.vacancies !== undefined ? j.vacancies : (j.maleVacancies || 0),
          femaleVacancies: j.femaleVacancies || 0
        }
      });

      console.log(`Updating ${row.sector}...`);
      await connection.execute(
        'UPDATE jobs_data SET jobs = ? WHERE sector = ?',
        [JSON.stringify(newJobs), row.sector]
      );
    }
    
    // We don't drop allowedGenders from DB to avoid breaking schema suddenly, just ignore it in code.
    
    connection.release();
    console.log("Migration complete.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
migrate();
