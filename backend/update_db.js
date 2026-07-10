const pool = require('./config/db');

async function updateDb() {
  try {
    const query = `
      ALTER TABLE applications 
      ADD COLUMN verificationCode VARCHAR(6) NULL,
      ADD COLUMN verificationCodeExpires DATETIME NULL;
    `;
    await pool.execute(query);
    console.log("Database updated successfully.");
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log("Columns already exist.");
    } else {
      console.error("Error updating database:", error);
    }
  } finally {
    process.exit(0);
  }
}

updateDb();
