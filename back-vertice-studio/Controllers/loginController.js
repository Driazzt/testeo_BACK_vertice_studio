const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_DATABASE,
});

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

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

module.exports = { login };

//Esto funciona a pincho

// const bcrypt = require("bcrypt");
// const jwt = require('jsonwebtoken');
// const { Pool } = require('pg');

// const pool = new Pool({
//   connectionString: "postgres://default:vZK1N7gJFMpu@ep-nameless-cherry-a2yrl6t6-pooler.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require",
// });

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     const user = userResult.rows[0];

//     if (!user) {
//       return res.status(400).json({ message: 'User not found' });
//     }

//     const isMatch = await pool.query('SELECT * FROM users WHERE password = $1', [password]);

//     if (!isMatch) {
//       return res.status(400).json({ message: 'Incorrect Password' });
//     }

//     const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });

//     res.json({ token, user: { id: user.id, email: user.email, role: user.user_role } });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error in server' });
//   }
// };

// module.exports = { login };