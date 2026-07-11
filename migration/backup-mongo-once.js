// One-off pre-migration safety snapshot: dumps foodCategories and dishes to JSON.
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const envPath = path.join(__dirname, '../server/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/^MONGODB_URI=(.+)$/m);
const MONGODB_URI = match[1].trim();

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const categories = await db.collection('foodCategories').find().toArray();
  const dishes = await db.collection('dishes').find().toArray();

  fs.writeFileSync(path.join(__dirname, 'backup-foodCategories.json'), JSON.stringify(categories, null, 2));
  fs.writeFileSync(path.join(__dirname, 'backup-dishes.json'), JSON.stringify(dishes, null, 2));

  console.log(`Backed up ${categories.length} categories and ${dishes.length} dishes`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
