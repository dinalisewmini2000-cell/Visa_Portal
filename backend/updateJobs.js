const pool = require('./config/db');

const initialJobsData = {
  "Healthcare & Aged Care": { allowedGenders: ["Male", "Female"], ageLimit: 45, jobs: [{title: "Caregiver / Aged Care Worker", vacancies: 0}, {title: "Personal Care Assistant (PCA)", vacancies: 0}, {title: "Disability Support Worker", vacancies: 0}, {title: "Registered Nurse", vacancies: 0}, {title: "Enrolled Nurse", vacancies: 0}, {title: "Assistant in Nursing (AIN)", vacancies: 0}, {title: "Home Care Worker", vacancies: 0}, {title: "Community Support Worker", vacancies: 0}, {title: "Medical Laboratory Technician", vacancies: 0}, {title: "Physiotherapist", vacancies: 0}, {title: "Occupational Therapist", vacancies: 0}] },
  "Construction & Trades": { allowedGenders: ["Male"], ageLimit: 45, jobs: [{title: "Electrician", vacancies: 0}, {title: "Plumber", vacancies: 0}, {title: "Carpenter", vacancies: 0}, {title: "Bricklayer", vacancies: 0}, {title: "Painter", vacancies: 0}, {title: "Tiler", vacancies: 0}, {title: "Welder", vacancies: 0}, {title: "Boilermaker", vacancies: 0}, {title: "Fitter & Turner", vacancies: 0}, {title: "Cabinet Maker", vacancies: 0}, {title: "Roof Plumber", vacancies: 0}, {title: "Glazier", vacancies: 0}, {title: "Concreter", vacancies: 0}, {title: "Steel Fixer", vacancies: 0}, {title: "Scaffolder", vacancies: 0}] },
  "Engineering": { allowedGenders: ["Male", "Female"], ageLimit: 45, jobs: [{title: "Civil Engineer", vacancies: 0}, {title: "Mechanical Engineer", vacancies: 0}, {title: "Electrical Engineer", vacancies: 0}, {title: "Structural Engineer", vacancies: 0}, {title: "Mining Engineer", vacancies: 0}, {title: "Project Engineer", vacancies: 0}, {title: "Surveyor", vacancies: 0}, {title: "Draftsperson", vacancies: 0}] },
  "Hospitality & Tourism": { allowedGenders: ["Male", "Female"], ageLimit: 45, jobs: [{title: "Chef", vacancies: 0}, {title: "Cook", vacancies: 0}, {title: "Kitchen Hand", vacancies: 0}, {title: "Baker", vacancies: 0}, {title: "Pastry Chef", vacancies: 0}, {title: "Barista", vacancies: 0}, {title: "Waiter / Waitress", vacancies: 0}, {title: "Restaurant Manager", vacancies: 0}, {title: "Hotel Receptionist", vacancies: 0}, {title: "Housekeeper", vacancies: 0}] },
  "Agriculture & Farming": { allowedGenders: ["Male"], ageLimit: 45, jobs: [{title: "Farm Worker", vacancies: 60}, {title: "Fruit Picker", vacancies: 4}, {title: "Vegetable Picker", vacancies: 3}, {title: "Dairy Farm Worker", vacancies: 3}, {title: "Poultry Farm Worker", vacancies: 2}, {title: "Livestock Worker", vacancies: 50}, {title: "Tractor Operator", vacancies: 100}, {title: "Irrigation Technician", vacancies: 23}, {title: "Vineyard Worker", vacancies: 44}] },
  "Manufacturing": { allowedGenders: ["Male", "Female"], ageLimit: 45, jobs: [{title: "Machine Operator", vacancies: 0}, {title: "Production Worker", vacancies: 0}, {title: "Factory Worker", vacancies: 0}, {title: "CNC Machinist", vacancies: 0}, {title: "Assembly Worker", vacancies: 0}, {title: "Quality Control Inspector", vacancies: 0}, {title: "Packaging Operator", vacancies: 0}] },
  "Transport & Logistics": { allowedGenders: ["Male"], ageLimit: 45, jobs: [{title: "Truck Driver", vacancies: 0}, {title: "Delivery Driver", vacancies: 0}, {title: "Forklift Operator", vacancies: 0}, {title: "Warehouse Worker", vacancies: 0}, {title: "Storeperson", vacancies: 0}, {title: "Logistics Coordinator", vacancies: 0}, {title: "Supply Chain Assistant", vacancies: 0}] },
  "Information Technology (IT)": { allowedGenders: ["Male", "Female"], ageLimit: 45, jobs: [{title: "Software Engineer", vacancies: 0}, {title: "Web Developer", vacancies: 0}, {title: "Full Stack Developer", vacancies: 0}, {title: "Frontend Developer", vacancies: 0}, {title: "Backend Developer", vacancies: 0}, {title: "Mobile App Developer", vacancies: 0}, {title: "Cyber Security Analyst", vacancies: 0}, {title: "Network Engineer", vacancies: 0}, {title: "Systems Administrator", vacancies: 0}, {title: "Database Administrator", vacancies: 0}, {title: "Data Analyst", vacancies: 0}, {title: "Cloud Engineer", vacancies: 0}] },
  "Education": { allowedGenders: ["Male", "Female"], ageLimit: 45, jobs: [{title: "Early Childhood Teacher", vacancies: 0}, {title: "Primary School Teacher", vacancies: 0}, {title: "Secondary School Teacher", vacancies: 0}, {title: "Special Education Teacher", vacancies: 0}, {title: "Vocational Trainer", vacancies: 0}, {title: "Teaching Assistant", vacancies: 0}] },
  "Business & Administration": { allowedGenders: ["Male", "Female"], ageLimit: 45, jobs: [{title: "Accountant", vacancies: 0}, {title: "Auditor", vacancies: 0}, {title: "Bookkeeper", vacancies: 0}, {title: "Human Resources Officer", vacancies: 0}, {title: "Administrative Assistant", vacancies: 0}, {title: "Office Manager", vacancies: 0}, {title: "Payroll Officer", vacancies: 0}, {title: "Customer Service Officer", vacancies: 0}, {title: "Receptionist", vacancies: 0}] },
  "Cleaning & Maintenance": { allowedGenders: ["Male", "Female"], ageLimit: 45, jobs: [{title: "Cleaner", vacancies: 0}, {title: "Commercial Cleaner", vacancies: 0}, {title: "Industrial Cleaner", vacancies: 0}, {title: "Window Cleaner", vacancies: 0}, {title: "Laundry Worker", vacancies: 0}, {title: "Groundskeeper", vacancies: 0}, {title: "Maintenance Technician", vacancies: 0}] },
  "Mining & Resources": { allowedGenders: ["Male"], ageLimit: 45, jobs: [{title: "Mining Operator", vacancies: 0}, {title: "Heavy Equipment Operator", vacancies: 0}, {title: "Driller", vacancies: 0}, {title: "Excavator Operator", vacancies: 0}, {title: "Diesel Mechanic", vacancies: 0}, {title: "Safety Officer", vacancies: 0}] },
  "Automotive": { allowedGenders: ["Male"], ageLimit: 45, jobs: [{title: "Motor Mechanic", vacancies: 0}, {title: "Auto Electrician", vacancies: 0}, {title: "Panel Beater", vacancies: 0}, {title: "Spray Painter", vacancies: 0}, {title: "Diesel Mechanic", vacancies: 0}, {title: "Tyre Technician", vacancies: 0}] },
  "Retail": { allowedGenders: ["Male", "Female"], ageLimit: 45, jobs: [{title: "Retail Assistant", vacancies: 0}, {title: "Cashier", vacancies: 0}, {title: "Store Manager", vacancies: 0}, {title: "Sales Assistant", vacancies: 0}, {title: "Merchandiser", vacancies: 0}] },
  "Security": { allowedGenders: ["Male"], ageLimit: 45, jobs: [{title: "Security Guard", vacancies: 0}, {title: "Crowd Controller", vacancies: 0}, {title: "CCTV Operator", vacancies: 0}] },
  "Aviation & Marine": { allowedGenders: ["Male", "Female"], ageLimit: 45, jobs: [{title: "Aircraft Maintenance Engineer", vacancies: 0}, {title: "Aircraft Cleaner", vacancies: 0}, {title: "Marine Engineer", vacancies: 0}, {title: "Deckhand", vacancies: 0}] },
  "Other Skilled Occupations": { allowedGenders: ["Male", "Female"], ageLimit: 45, jobs: [{title: "Hairdresser", vacancies: 0}, {title: "Beauty Therapist", vacancies: 0}, {title: "Barber", vacancies: 0}, {title: "Tailor", vacancies: 0}, {title: "Florist", vacancies: 0}, {title: "Graphic Designer", vacancies: 0}, {title: "Photographer", vacancies: 0}, {title: "Interpreter", vacancies: 0}, {title: "Translator", vacancies: 0}] }
};

async function migrate() {
  try {
    const connection = await pool.getConnection();

    console.log("Adding ageLimit column...");
    try {
      await connection.execute('ALTER TABLE jobs_data ADD COLUMN ageLimit INT DEFAULT 45');
    } catch(e) { console.log(e.message); } // Might fail if it exists

    console.log("Updating all records with new seed data...");
    for (const [sector, data] of Object.entries(initialJobsData)) {
      await connection.execute(
        'UPDATE jobs_data SET allowedGenders = ?, jobs = ?, ageLimit = ? WHERE sector = ?',
        [JSON.stringify(data.allowedGenders), JSON.stringify(data.jobs), data.ageLimit, sector]
      );
    }
    
    connection.release();
    console.log("Done");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
migrate();
