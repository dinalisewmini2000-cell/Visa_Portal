const pool = require('./config/db');

async function migrate() {
  try {
    const [rows] = await pool.execute('SELECT * FROM jobs_data');
    
    for (const row of rows) {
      const parsedJobs = typeof row.jobs === 'string' ? JSON.parse(row.jobs) : row.jobs;
      
      // Check if it needs migration (if the first element is a string)
      if (parsedJobs.length > 0 && typeof parsedJobs[0] === 'string') {
        const migratedJobs = parsedJobs.map(jobTitle => ({
          title: jobTitle,
          vacancies: 0
        }));
        
        await pool.execute(
          'UPDATE jobs_data SET jobs = ? WHERE sector = ?',
          [JSON.stringify(migratedJobs), row.sector]
        );
        console.log(`Migrated sector: ${row.sector}`);
      }
    }
    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
