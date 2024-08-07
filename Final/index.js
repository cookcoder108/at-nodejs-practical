const express = require('express');
const database = require('./config/database');
const bodyParser = require('body-parser');
const user = require('./routes/user')
var cors = require('cors')
require("dotenv").config();


const app = express();
app.use(cors());
// middleware 
app.use(bodyParser.json());
// MongoDB Connection
database.connect();

// Routes
app.use('/api/v1',user);

const PORT = process.env.PORT || 5000;
app.get('/',(req,res)=>{
    res.status(201).json({message: "Successfully Registered", status: 201})

})
app.listen(PORT, () => {
    
  console.log(`Server running on port ${PORT}`);
        
    
});

