const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const replaceTemplateEmail = require('../Templates/replaceTemplateEmail');
const { emailSignupTemplate } = require('../Templates/template');
const { sendMail } = require('../Services/services');

require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 1200000,
    keepAlive: true,
});

const roles = ['administrator', 'editor', 'designer', 'author'];

const createUser = async (req, res) => {
    const { email, password, username, firstName, lastName, role } = req.body;

    if (!roles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            'INSERT INTO users (email, password, username, first_name, last_name, user_role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [email, hashedPassword, username, firstName, lastName, role]
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

const getAllUsers = async (req, res) => {
    try {
        const usersResult = await pool.query('SELECT * FROM users');
        res.json(usersResult.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(userResult.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, username, firstName, lastName, role } = req.body;

    if (!roles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        const userResult = await pool.query(
            'UPDATE users SET email = $1, username = $2, first_name = $3, last_name = $4, user_role = $5 WHERE id = $6 RETURNING *',
            [email, username, firstName, lastName, role, id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(userResult.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const userResult = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted', user: userResult.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

const getMyProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(userResult.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser, getMyProfile };