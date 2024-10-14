const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const { Pool } = require('pg');
const replaceTemplateEmail = require('../Templates/replaceTemplateEmail');
const { emailSignupTemplate } = require('../Templates/template');
const { sendMail } = require('../Services/services');



const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 1200000,
  keepAlive: true,
});


const updatePasswords = async () => {
  try {
    const usersResult = await pool.query('SELECT * FROM users');
    const users = usersResult.rows;

    for (const user of users) {
      if (!user.password.startsWith("$2b$")) { 
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
        console.log(`Updated password for user: ${user.email}`);
      }
    }

    console.log("All passwords updated!");
  } catch (error) {
    console.error(error);
  }
};

updatePasswords();


const register = async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Inserting new user with email:", email);
    console.log("Hashed password:", hashedPassword);
    console.log("Username", username);
    console.log("First name:", firstName);
    console.log("Last name:", lastName);

   const newUser = await pool.query(
      'INSERT INTO users (email, password, username, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, hashedPassword, username, firstName, lastName]
    );

    const user = newUser.rows[0];

    const userTemplate = {
      name: user.first_name,
      username: user.username,
      my_company: 'Grupo Vertice',
      company_address: 'Montalban, 3 , 29002, Malaga',
      email: user.email,
      role: user.role
    };

    const subject = `Many thanks for the support to our community ${userTemplate.name}`;
    const html = replaceTemplateEmail(emailSignupTemplate, userTemplate);

    await sendMail(user.email, subject, html);

    res.status(201).json({ message: 'User registered', user: newUser.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    console.log("Password from request:", password);
    console.log("Hashed password from DB:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Do the passwords match?", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect Password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user.id, email: user.email, role: user.user_role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error in server' });
  }
};

module.exports = { login, register };