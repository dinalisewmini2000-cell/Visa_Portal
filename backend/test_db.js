const pool = require('./config/db');

async function testInit() {
  try {
    const connection = await pool.getConnection();
    const createRemovedTableQuery = `
      CREATE TABLE IF NOT EXISTS removed_applications (
        id INT PRIMARY KEY,
        referenceNumber VARCHAR(255) NOT NULL,
        nicNumber VARCHAR(255) NOT NULL,
        passportNumber VARCHAR(255) NOT NULL,
        dateOfBirth DATE NOT NULL,
        gender VARCHAR(50) NOT NULL,
        surname VARCHAR(255) NOT NULL,
        firstName VARCHAR(255) NOT NULL,
        fathersName VARCHAR(255) NOT NULL,
        passportExpireDate DATE NOT NULL,
        maritalStatus VARCHAR(50) NOT NULL,
        partnerNic VARCHAR(255),
        partnerPassport VARCHAR(255),
        partnerDob DATE,
        partnerLastName VARCHAR(255),
        partnerFirstName VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        mobile1 VARCHAR(50) NOT NULL,
        addressLine1 TEXT NOT NULL,
        addressLine2 TEXT,
        town VARCHAR(255) NOT NULL,
        district VARCHAR(255) NOT NULL,
        jobSector VARCHAR(255) NOT NULL,
        jobCategory VARCHAR(255) NOT NULL,
        verificationCode VARCHAR(6),
        verificationCodeExpires DATETIME,
        createdAt TIMESTAMP NULL,
        updatedAt TIMESTAMP NULL,
        removedBy VARCHAR(50) NOT NULL,
        removedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.execute(createRemovedTableQuery);
    console.log('"removed_applications" table created.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}
testInit();
