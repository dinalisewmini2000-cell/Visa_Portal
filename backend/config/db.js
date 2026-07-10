const mysql = require('mysql2/promise');   



require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'visa',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database table
async function initializeDB() {
  try {
    const connection = await pool.getConnection();
    
    // The applications table will now persist across server restarts
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        referenceNumber VARCHAR(255) NOT NULL UNIQUE,
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
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await connection.execute(createTableQuery);
    console.log('MySQL connected and "applications" table ensured with new schema.');

    // Create removed_applications table for history
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
        createdAt TIMESTAMP,
        updatedAt TIMESTAMP,
        removedBy VARCHAR(50) NOT NULL,
        removedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.execute(createRemovedTableQuery);
    console.log('"removed_applications" table ensured.');

    // Create admins table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);

    // Seed default admin
    const [adminRows] = await connection.execute('SELECT COUNT(*) as count FROM admins');
    if (adminRows[0].count === 0) {
      await connection.execute(
        'INSERT INTO admins (email, password) VALUES (?, ?)',
        ['admin@visaportal.com', 'admin123']
      );
      console.log('Default admin seeded.');
    }

    // Create jobs_data table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS jobs_data (
        sector VARCHAR(255) PRIMARY KEY,
        jobs JSON,
        minAge INT DEFAULT 18,
        maxAge INT DEFAULT 45
      )
    `);

    // Seed jobs data if empty
    const [jobsRows] = await connection.execute('SELECT COUNT(*) as count FROM jobs_data');
    if (jobsRows[0].count === 0) {
      console.log('Seeding initial jobs data...');
      const initialJobsData = {
        "Construction": { minAge: 18, maxAge: 45, jobs: [{title: "Construction Labourer", maleVacancies: 0, femaleVacancies: 0}, {title: "Carpenter", maleVacancies: 0, femaleVacancies: 0}, {title: "Electrician", maleVacancies: 0, femaleVacancies: 0}, {title: "Plumber", maleVacancies: 0, femaleVacancies: 0}] },
        "Automotive": { minAge: 18, maxAge: 45, jobs: [{title: "Motor Mechanic", maleVacancies: 0, femaleVacancies: 0}, {title: "Diesel Mechanic", maleVacancies: 0, femaleVacancies: 0}] },
        "Transport & Logistics": { minAge: 18, maxAge: 45, jobs: [{title: "Truck Driver (HR/HC)", maleVacancies: 0, femaleVacancies: 0}] },
        "Manufacturing": { minAge: 18, maxAge: 45, jobs: [{title: "Welder / Fabricator", maleVacancies: 0, femaleVacancies: 0}] },
        "Agriculture": { minAge: 18, maxAge: 45, jobs: [{title: "Farm Worker", maleVacancies: 0, femaleVacancies: 0}] },
        "Hospitality": { minAge: 18, maxAge: 45, jobs: [{title: "Chef", maleVacancies: 0, femaleVacancies: 0}, {title: "Housekeeper", maleVacancies: 0, femaleVacancies: 0}, {title: "Hotel Receptionist", maleVacancies: 0, femaleVacancies: 0}, {title: "Kitchen Hand", maleVacancies: 0, femaleVacancies: 0}] },
        "Healthcare": { minAge: 18, maxAge: 45, jobs: [{title: "Aged Care Worker", maleVacancies: 0, femaleVacancies: 0}, {title: "Disability Support Worker", maleVacancies: 0, femaleVacancies: 0}, {title: "Personal Care Assistant", maleVacancies: 0, femaleVacancies: 0}] },
        "Nursing": { minAge: 18, maxAge: 45, jobs: [{title: "Registered Nurse", maleVacancies: 0, femaleVacancies: 0}] },
        "Childcare": { minAge: 18, maxAge: 45, jobs: [{title: "Childcare Educator", maleVacancies: 0, femaleVacancies: 0}] },
        "Administration": { minAge: 18, maxAge: 45, jobs: [{title: "Administrative Assistant", maleVacancies: 0, femaleVacancies: 0}] },
        "Retail": { minAge: 18, maxAge: 45, jobs: [{title: "Retail Sales Assistant", maleVacancies: 0, femaleVacancies: 0}] }
      };

      for (const [sector, data] of Object.entries(initialJobsData)) {
        await connection.execute(
          'INSERT INTO jobs_data (sector, jobs, minAge, maxAge) VALUES (?, ?, ?, ?)',
          [sector, JSON.stringify(data.jobs), data.minAge, data.maxAge]
        );
      }
      console.log('Jobs data seeded successfully!');
    }

    connection.release();
  } catch (error) {
    console.error('MySQL connection error:', error);
  }
}

initializeDB();

module.exports = pool;
