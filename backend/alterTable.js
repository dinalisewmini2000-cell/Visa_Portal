const pool = require('./config/db');

async function migrate() {
  try {
    const connection = await pool.getConnection();
    console.log("Adding email column...");
    try {
      await connection.execute('ALTER TABLE applications ADD COLUMN email VARCHAR(255) NOT NULL DEFAULT "temp@email.com" AFTER partnerFirstName');
    } catch(e) { console.log(e.message); }

    console.log("Removing mobile2 column...");
    try {
      await connection.execute('ALTER TABLE applications DROP COLUMN mobile2');
    } catch(e) { console.log(e.message); }

    connection.release();
    console.log("Done");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
migrate();
