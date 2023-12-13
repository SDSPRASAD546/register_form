const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connection
const connect = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/Login_data', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
};
connect();

// Model
const RegisterData = mongoose.model(
  'Register_data',
  new mongoose.Schema({
    name: String,
    user_name: String,
    password: String,
  })
);

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.use('/styles', express.static(path.join(__dirname, 'public','login.css')));

app.get('/', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'public', 'Register.html'));
  } catch (err) {
    console.error(err);
  }
});

app.use(express.static('public'));
app.use('/styles', express.static(path.join(__dirname, 'public','login.css')));
app.get('/login', (req, res) => {
    try {
      res.sendFile(path.join(__dirname, 'public', 'login.html'));
    } catch (err) {
      console.error(err);
    }
  });
// Endpoint to handle POST requests
app.post('/setdata', async (req, res) => {
  try {
    const document = {
      name: req.body.name,
      user_name: req.body.user_name,
      password: req.body.password,
    };

    await RegisterData.create(document);
    res.send('<h1>Registration successful</h1>');
  } catch (err) {
    console.error(err);
    res.status(500).send('<h1>Internal Server Error</h1>');
  }
});

//getting the data form login form

app.post('/getdata', async (req, res) => {
    try {
      
        const user_name= req.body.user_name;
        const password=req.body.password;
      
    const user = await RegisterData.findOne({user_name:user_name});
    
    if(user){
        if(user?.password == password)
        res.send(`<h1>Login successful</h1> <br><br> <h2>${user?.name}</h2>`);
        if(user?.password != password)
        res.send(`<h1>Login faild cehck password</h1> `);

    }else{
        res.send('not found create new accout')
    }
          
    } catch (err) {
      console.error(err);
      res.status(500).send('<h1>Internal Server Error</h1>');
    }
  });

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
