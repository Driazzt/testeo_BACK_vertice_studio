// const bcrypt = require("bcrypt");
// const jwt = require('jsonwebtoken');
// require("dotenv").config();
// const { Pool } = require('pg');
// const replaceTemplateEmail = require('../Templates/replaceTemplateEmail');
// const { emailSignupTemplate } = require('../Templates/template');
// const { sendMail } = require('../Services/services');
// const { emailForgotPasswordTemplate } = require("../Templates/emailForgotPasswordTemplate");

// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL,
//   connectionTimeoutMillis: 5000,
//   idleTimeoutMillis: 1200000,
//   keepAlive: true,
// });

// const updatePasswords = async () => {
//   try {
//     const usersResult = await pool.query('SELECT * FROM users');
//     const users = usersResult.rows;

//     for (const user of users) {
//       if (!user.password.startsWith("$2b$")) { 
//         const hashedPassword = await bcrypt.hash(user.password, 10);
//         await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
//         console.log(`Updated password for user: ${user.email}`);
//       }
//     }

//     console.log("All passwords updated!");
//   } catch (error) {
//     console.error(error);
//   }
// };

// updatePasswords();

// const register = async (req, res) => {
//   const { email, password, username, firstName, lastName } = req.body;

//   try {
//     const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (userExists.rows.length > 0) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     console.log("Inserting new user with email:", email);
//     console.log("Hashed password:", hashedPassword);
//     console.log("Username", username);
//     console.log("First name:", firstName);
//     console.log("Last name:", lastName);

//     const newUser = await pool.query(
//       'INSERT INTO users (email, password, username, first_name, last_name, is_verified, login_attempts) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
//       [email, hashedPassword, username, firstName, lastName, true, 10] // Inicializa login_attempts a 10
//     );

//     const user = newUser.rows[0];

//     const validationToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
//       expiresIn: '1d',
//     });

//     const userTemplate = {
//       name: user.first_name,
//       username: user.username,
//       my_company: 'Grupo Vertice',
//       company_address: 'Montalban, 3 , 29002, Malaga',
//       email: user.email,
//       role: user.role,
//       verification_link: `https://yourdomain.com/verify?token=${validationToken}`
//     };

//     const subject = `Welcome to Grupo Vertice, ${userTemplate.name}`;
//     const html = replaceTemplateEmail(emailSignupTemplate, userTemplate);

//     await sendMail(user.email, subject, html);

//     res.status(201).json({ message: 'User registered', user: newUser.rows[0] });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error registering user' });
//   }
// };

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     const user = userResult.rows[0];

//     if (!user) {
//       return res.status(400).json({ message: 'User not found' });
//     }

//     if (!user.is_verified) {
//       return res.status(400).json({ message: 'Please verify your email before logging in.' });
//     }

//     if (user.lock_until && new Date() < new Date(user.lock_until)) {
//       const remainingTime = Math.ceil((new Date(user.lock_until) - new Date()) / 1000 / 60);
//       return res.status(403).json({ message: `Account locked. Try again in ${remainingTime} minutes` });
//     }

//     if (user.lock_until && new Date() >= new Date(user.lock_until)) {
//       await pool.query('UPDATE users SET login_attempts = 10, lock_until = NULL WHERE id = $1', [user.id]);
//       user.login_attempts = 10;
//       user.lock_until = null;
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       user.login_attempts -= 1;
//       await pool.query('UPDATE users SET login_attempts = $1 WHERE id = $2', [user.login_attempts, user.id]);

//       if (user.login_attempts <= 0) {
//         const lockUntil = new Date(Date.now() + 5 * 60 * 1000); 
//         await pool.query('UPDATE users SET lock_until = $1 WHERE id = $2', [lockUntil, user.id]);
//         return res.status(403).json({ message: 'Account locked due to too many failed login attempts. Try again in 5 minutes.' });
//       }

//       return res.status(400).json({ message: 'Incorrect Password' });
//     }

//     await pool.query('UPDATE users SET login_attempts = 10, lock_until = NULL WHERE id = $1', [user.id]);

//     const token = jwt.sign({ userId: user.id, email: user.email, userRole: user.user_role }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });

//     res.json({ token, user: { id: user.id, email: user.email, role: user.user_role } });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error in server' });
//   }
// };

// const verifyUser = async (req, res) => {
//   const { token } = req.query;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.userId;

//     const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
//     const user = userResult.rows[0];

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid token or user not found' });
//     }

//     await pool.query('UPDATE users SET is_verified = true WHERE id = $1', [userId]);

//     res.status(200).json({ message: 'User verified successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error verifying user' });
//   }
// };

// const generateToken = (user, isRefreshToken = false) => {
//   const payload = {
//     id: user.id,
//     role: user.role,
//   };
//   return jwt.sign(payload, process.env.JWT_SECRET, {
//     expiresIn: isRefreshToken ? '7d' : '1h',
//   });
// };

// const getRefreshToken = async (req, res) => {
//   try {
//     if (!req.payload) {
//       return res.status(400).json({ status: "Failed", message: "Access Denied" });
//     }

//     const userId = req.payload.userId;

//     const query = 'SELECT * FROM users WHERE id = $1';
//     const values = [userId];

//     const { rows } = await pool.query(query, values);

//     if (rows.length === 0) {
//       return res.status(404).json({ status: "Failed", message: "User not found" });
//     }

//     const user = rows[0];

//     // Creamos Payload para los nuevos tokens
//     const payload = {
//       userId: user.id,
//       firstName: user.first_name,
//       lastName: user.last_name,
//       username: user.username,
//       email: user.email,
//       role: user.role,
//       is_verified: user.is_verified,
//     };

//     // Generar un nuevo token de acceso y un token de refresh
//     const token = generateToken(payload, false); // Token de acceso (1 hora)
//     const refreshToken = generateToken(payload, true); // Token de refresh (7 días)

//     res.status(201).json({ status: "Success", token, refreshToken });
//   } catch (error) {
//     console.error('Error in getRefreshToken:', error);
//     return res.status(500).json({ status: "Failed", error: error.message });
//   }
// };

// const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     const user = userResult.rows[0];

//     if (!user) {
//       return res.status(400).json({ message: 'User not found' });
//     }

//     const resetToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });

//     const resetLink = `https://yourdomain.com/reset-password?token=${resetToken}`;

//     const userTemplate = {
//       name: user.first_name,
//       email: user.email,
//       reset_link: resetLink,
//     };

//     const subject = 'Password Reset Request';
//     const html = replaceTemplateEmail(emailForgotPasswordTemplate, userTemplate);

//     await sendMail(user.email, subject, html);

//     res.status(200).json({ message: 'Password reset link sent to your email' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error processing request' });
//   }
// };

// const resetPassword = async (req, res) => {
//   const { token, newPassword, confirmPassword } = req.body;

//   try {
//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: 'Passwords do not match' });
//     }
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.userId;

//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

//     res.status(200).json({ message: 'Password has been reset successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error resetting password' });
//   }
// };

// module.exports = { login, register, getRefreshToken, verifyUser, forgotPassword, resetPassword };

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const { Pool } = require('pg');
const mongoose = require('mongoose');
const replaceTemplateEmail = require('../Templates/replaceTemplateEmail');
const { emailSignupTemplate } = require('../Templates/template');
const { sendMail } = require('../Services/services');
const { emailForgotPasswordTemplate } = require("../Templates/emailForgotPasswordTemplate");
const Course = require('../Models/coursesModel'); // Asegúrate de que tienes un modelo de Mongoose para los cursos

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 1200000,
  keepAlive: true,
});

const url_mongodb = process.env.DATA_URL_MONGO;
mongoose.connect(url_mongodb);

const db = mongoose.connection;

db.on("error", (error) => {
  console.log("Error en la conexión con Mongo");
});

db.on("connected", () => {
  console.log("Success connect");
});

db.on("disconnected", () => {
  console.log("Mongo is disconnected");
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
      'INSERT INTO users (email, password, username, first_name, last_name, is_verified, login_attempts) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [email, hashedPassword, username, firstName, lastName, true, 10] // Inicializa login_attempts a 10
    );

    const user = newUser.rows[0];

    const validationToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    const userTemplate = {
      name: user.first_name,
      username: user.username,
      my_company: 'Grupo Vertice',
      company_address: 'Montalban, 3 , 29002, Malaga',
      email: user.email,
      role: user.role,
      verification_link: `https://yourdomain.com/verify?token=${validationToken}`
    };

    const subject = `Welcome to Grupo Vertice, ${userTemplate.name}`;
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

    if (!user.is_verified) {
      return res.status(400).json({ message: 'Please verify your email before logging in.' });
    }

    if (user.lock_until && new Date() < new Date(user.lock_until)) {
      const remainingTime = Math.ceil((new Date(user.lock_until) - new Date()) / 1000 / 60);
      return res.status(403).json({ message: `Account locked. Try again in ${remainingTime} minutes` });
    }

    if (user.lock_until && new Date() >= new Date(user.lock_until)) {
      await pool.query('UPDATE users SET login_attempts = 10, lock_until = NULL WHERE id = $1', [user.id]);
      user.login_attempts = 10;
      user.lock_until = null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.login_attempts -= 1;
      await pool.query('UPDATE users SET login_attempts = $1 WHERE id = $2', [user.login_attempts, user.id]);

      if (user.login_attempts <= 0) {
        const lockUntil = new Date(Date.now() + 5 * 60 * 1000); 
        await pool.query('UPDATE users SET lock_until = $1 WHERE id = $2', [lockUntil, user.id]);
        return res.status(403).json({ message: 'Account locked due to too many failed login attempts. Try again in 5 minutes.' });
      }

      return res.status(400).json({ message: 'Incorrect Password' });
    }

    await pool.query('UPDATE users SET login_attempts = 10, lock_until = NULL WHERE id = $1', [user.id]);

    const token = jwt.sign({ userId: user.id, email: user.email, userRole: user.user_role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user.id, email: user.email, role: user.user_role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error in server' });
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid token or user not found' });
    }

    await pool.query('UPDATE users SET is_verified = true WHERE id = $1', [userId]);

    res.status(200).json({ message: 'User verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying user' });
  }
};

const generateToken = (user, isRefreshToken = false) => {
  const payload = {
    id: user.id,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: isRefreshToken ? '7d' : '1h',
  });
};

const getRefreshToken = async (req, res) => {
  try {
    if (!req.payload) {
      return res.status(400).json({ status: "Failed", message: "Access Denied" });
    }

    const userId = req.payload.userId;

    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [userId];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ status: "Failed", message: "User not found" });
    }

    const user = rows[0];

    // Creamos Payload para los nuevos tokens
    const payload = {
      userId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
    };

    // Generar un nuevo token de acceso y un token de refresh
    const token = generateToken(payload, false); // Token de acceso (1 hora)
    const refreshToken = generateToken(payload, true); // Token de refresh (7 días)

    res.status(201).json({ status: "Success", token, refreshToken });
  } catch (error) {
    console.error('Error in getRefreshToken:', error);
    return res.status(500).json({ status: "Failed", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const resetLink = `https://yourdomain.com/reset-password?token=${resetToken}`;

    const userTemplate = {
      name: user.first_name,
      email: user.email,
      reset_link: resetLink,
    };

    const subject = 'Password Reset Request';
    const html = replaceTemplateEmail(emailForgotPasswordTemplate, userTemplate);

    await sendMail(user.email, subject, html);

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing request' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  try {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

const getLastVisitedCourseName = async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await pool.query('SELECT last_visited_course FROM users WHERE id = $1', [userId]);
    const lastVisitedCourseId = result.rows[0].last_visited_course;

    if (!lastVisitedCourseId) {
      return res.status(404).json({ message: 'No course visited yet' });
    }

    const course = await Course.findById(lastVisitedCourseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ courseName: course.title });
  } catch (error) {
    console.error('Error fetching last visited course name:', error);
    res.status(500).json({ message: 'Error fetching last visited course name' });
  }
};

module.exports = { login, register, getRefreshToken, verifyUser, forgotPassword, resetPassword, getLastVisitedCourseName };