
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
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

app.post('/login', async(req, res)=>{
  const profileDetails = req.body
  const {name, email} = profileDetails
  if (name==='Supriya'){
    if(email==='supriya@gmail.com'){
      const payload = {username:name}
      const token = jwt.sign(payload,'TEXT')
      res.status(200)
      res.send({"jwt_token":token})
    }
    else{
      res.status(400)
      res.send({"error":"Username or password is invalid"})
    }
  }
  else{
    res.status(400)
    res.send({"error":"Username or password is invalid"})
  }
});


app.get('/profile', async(req, res)=>{
  const profileQuery = `
  SELECT * FROM users
  WHERE name='Supriya'
  `
  const profilequeryRes=await db.get(profileQuery)
  res.status(200)
  res.send(profilequeryRes)
})