const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { login, register, getRefreshToken } = require('../Controllers/loginController');
const { sendMail } = require("../Services/services");

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    connect: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

jest.mock('../Services/services', () => ({
  sendMail: jest.fn(),
}));

process.env.JWT_SECRET = 'testsecret';

describe('Controladores de Autenticación', () => {
  let pool;
  
  beforeEach(() => {
    pool = new Pool();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

//! TEST BY JEST register

  describe('register', () => {
    it('debe registrar un usuario correctamente', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      pool.query.mockResolvedValueOnce({ rows: [] });
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, email: req.body.email }] });
      bcrypt.hash.mockResolvedValueOnce('hashedpassword');
      jwt.sign.mockReturnValueOnce('testtoken');

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'User registered' }));
      expect(sendMail).toHaveBeenCalledTimes(1);
    });

    it('debe retornar 400 si el usuario ya existe', async () => {
      const req = { body: { email: 'test@example.com' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
  });

//! TEST BY JEST login

  describe('login', () => {
    it('debe realizar login correctamente', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, email: req.body.email, password: 'hashedpassword', user_role: 'user' }] });
      bcrypt.compare.mockResolvedValueOnce(true);
      jwt.sign.mockReturnValueOnce('testtoken');

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        token: 'testtoken',
        user: expect.objectContaining({ email: req.body.email })
      });
    });

    it('debe retornar 400 si la contraseña es incorrecta', async () => {
      const req = { body: { email: 'test@example.com', password: 'wrongpassword' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, email: req.body.email, password: 'hashedpassword' }] });
      bcrypt.compare.mockResolvedValueOnce(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Incorrect Password' });
    });
  });

//! TEST BY JEST getRefreshToken

  describe('getRefreshToken', () => {
    it('debe retornar un nuevo token y refreshToken', async () => {
      const req = { payload: { userId: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, first_name: 'Test', last_name: 'User', username: 'testuser', email: 'test@example.com', role: 'user' }] });
      jwt.sign.mockReturnValueOnce('accesstoken');
      jwt.sign.mockReturnValueOnce('refreshtoken');

      await getRefreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        token: 'accesstoken',
        refreshToken: 'refreshtoken'
      });
    });
  });
});