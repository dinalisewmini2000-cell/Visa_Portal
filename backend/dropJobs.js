const pool = require('./config/db');

async function dropAndReseed() {
  try {
    const connection = await pool.getConnection();
    console.log("Dropping existing jobs_data table...");
    await connection.execute('DROP TABLE IF EXISTS jobs_data');
    console.log("Table dropped. The backend will re-create and re-seed it on next startup.");
    connection.release();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
dropAndReseed();
