const mongoose = require('mongoose');

async function testConnection() {
  // Testing the ORIGINAL hostname from the codebase
  const uri = "mongodb+srv://indahmariyadi:sandabal123@cluster0.auwna8l.mongodb.net/taskmanager?appName=Cluster0";
  console.log('Testing ORIGINAL host: cluster0.auwna8l.mongodb.net...');
  
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ SUCCESS: Connected to MongoDB!');
    process.exit(0);
  } catch (err) {
    console.error('❌ ERROR: Failed to connect to MongoDB');
    console.error('Error Message:', err.message);
    process.exit(1);
  }
}

testConnection();
