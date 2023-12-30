// index.js (the main application)

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
const dataRoutes = require('./AccessMDBFile');





const app = express();
app.use(cors());
const port = process.env.PORT || 5000;


app.use(bodyParser.json({ limit: '50mb' }));
app.use('/api/employees', employeeRoutes);
app.use('/api/data', dataRoutes); 

// Sync Sequelize models with the database
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
