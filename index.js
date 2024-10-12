
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
  
  const selectUserQuery = `SELECT * FROM users WHERE name = "${name}"`;
  let dbUser;
  try {
    dbUser = await db.get(selectUserQuery);
  } catch (err) {
    console.error("Select user error:", err);
    return res.status(500).send("Error while selecting user");
  }

  if (dbUser) {
    return res.status(400).send('User already exists');
  }

  const createUserQuery = `INSERT INTO users (name, email, password) 
  VALUES (
  '${name}',
  '${email}',
  '${password}')`;
  try {
    await db.run(createUserQuery);
    return res.status(201).send('Created new user');
  } catch (err) {
    console.error("Insert user error:", err);
    return res.status(500).send('Internal Server Error');
  }
});


/// login 
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