const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, 'website.db');
let db = null;

const initializeServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(process.env.PORT || 3000, () => console.log('Server running!'));
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
  }
};

initializeServer();



app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  console.log(name, email,password)

  const selectUserQuery = `SELECT * FROM users WHERE name = '${name}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser) {
    res.status(400).send('User already exists');
 } else {
    const createUserQuery = `INSERT INTO users (name, email, password) 
    VALUES (
    '${name}',
    '${email}',
    '${hashedPassword}'
    )`
    await db.run(createUserQuery);
    res.status(201).send('Created new user');
   

 }
  
});

app.post('/login', async (req, res) => {
  const { name, password } = req.body;
  const selectUserQuery = `SELECT * FROM users WHERE name = '${name}' `;
  const dbUser = await db.get(selectUserQuery);

  if (!dbUser) {
    res.status(400).send('Invalid user');
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched) {
     
      res.send('123');
    } else {
      res.status(400).send('Invalid Password');
    }
  }
});

app.get('/', (req, res) => {
  res.send('Home Route');
});
