const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://localhost:27017/taskmanager';
mongoose.connect(MONGODB_URI).then(() => {
  console.log('MongoDB connection successful');
  process.exit(0);
}).catch(err => {
  console.error('MongoDB connection failed:', err);
  process.exit(1);
});
