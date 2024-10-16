const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, getMyProfile } = require('../Controllers/userController');
const { sendMail } = require('../Services/services');
const replaceTemplateEmail = require('../Templates/replaceTemplateEmail');
const { getTestMessageUrl } = require("nodemailer");

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));
jest.mock('../Services/services', () => ({
  sendMail: jest.fn(),
}));
jest.mock('../Templates/replaceTemplateEmail', () => jest.fn());

process.env.JWT_SECRET = 'testsecret';

//! TEST BY JEST createUser

describe('createUser controller', () => {
  let pool;

  beforeEach(() => {
    pool = new Pool();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe registrar un usuario correctamente', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: 'administrator'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Simulamos la respuesta de la base de datos (usuario no existe)
    pool.query.mockResolvedValueOnce({ rows: [] });
    // Simulamos la inserción de un nuevo usuario
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, email: req.body.email, first_name: req.body.firstName, username: req.body.username, role: req.body.role }] });
    // Simulamos bcrypt hash
    bcrypt.hash.mockResolvedValueOnce('hashedpassword');
    // Simulamos jwt
    jwt.sign.mockReturnValueOnce('testtoken');
    // Simulamos el reemplazo de template de email
    replaceTemplateEmail.mockReturnValueOnce('<html>Email content</html>');

    await createUser(req, res);

    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
    expect(jwt.sign).toHaveBeenCalledWith(expect.any(Object), process.env.JWT_SECRET, { expiresIn: '1d' });
    expect(replaceTemplateEmail).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledWith(req.body.email, expect.any(String), expect.any(String));

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User registered',
      user: expect.any(Object),
    });
  });

  it('debe retornar 400 si el usuario ya existe', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: 'administrator'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, email: req.body.email }] });

    await createUser(req, res);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

  it('debe retornar 400 si el rol no es válido', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: 'invalidrole'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid role' });
  });

  it('debe retornar 500 si ocurre un error al registrar el usuario', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: 'administrator'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.query.mockRejectedValueOnce(new Error('Database error'));

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error registering user' });
  });
});

//! TEST BY JEST getAllUsers

describe('getAllUsers controller', () => {
  let pool;

  beforeEach(() => {
    pool = new Pool();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe retornar todos los usuarios correctamente', async () => {
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const mockUsers = [
      { id: 1, email: 'test1@example.com', username: 'testuser1' },
      { id: 2, email: 'test2@example.com', username: 'testuser2' }
    ];
    pool.query.mockResolvedValueOnce({ rows: mockUsers });

    await getAllUsers(req, res);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users');
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  it('debe retornar un error 500 si ocurre un error al obtener los usuarios', async () => {
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    pool.query.mockRejectedValueOnce(new Error('Database error'));

    await getAllUsers(req, res);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching users' });
  });
});

//! TEST BY JEST getUserById

describe('getUserById controller', () => {
    let pool;
  
    beforeEach(() => {
      pool = new Pool();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('debe retornar el usuario correctamente si existe', async () => {
      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockUser = { id: 1, email: 'test@example.com', username: 'testuser' };
      pool.query.mockResolvedValueOnce({ rows: [mockUser] });
  
      await getUserById(req, res);
  
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', ['1']);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  
    it('debe retornar un error 404 si el usuario no existe', async () => {
      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      pool.query.mockResolvedValueOnce({ rows: [] });
  
      await getUserById(req, res);
  
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', ['1']);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  
    it('debe retornar un error 500 si ocurre un error al obtener el usuario', async () => {
      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      pool.query.mockRejectedValueOnce(new Error('Database error'));
  
      await getUserById(req, res);
  
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', ['1']);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching user' });
    });
  });

//! TEST BY JEST updateUser

  describe('updateUser controller', () => {
    let pool;
  
    beforeEach(() => {
      pool = new Pool();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('debe actualizar el usuario correctamente si existe', async () => {
      const req = {
        params: { id: '1' },
        body: {
          email: 'updated@example.com',
          username: 'updateduser',
          firstName: 'Updated',
          lastName: 'User',
          role: 'editor',
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const updatedUser = {
        id: 1,
        email: 'updated@example.com',
        username: 'updateduser',
        first_name: 'Updated',
        last_name: 'User',
        user_role: 'editor',
      };
      pool.query.mockResolvedValueOnce({ rows: [updatedUser] });
  
      await updateUser(req, res);
  
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE users SET email = $1, username = $2, first_name = $3, last_name = $4, user_role = $5 WHERE id = $6 RETURNING *',
        ['updated@example.com', 'updateduser', 'Updated', 'User', 'editor', '1']
      );
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });
  
    it('debe retornar un error 404 si el usuario no existe', async () => {
      const req = {
        params: { id: '1' },
        body: {
          email: 'updated@example.com',
          username: 'updateduser',
          firstName: 'Updated',
          lastName: 'User',
          role: 'editor',
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      pool.query.mockResolvedValueOnce({ rows: [] });
  
      await updateUser(req, res);
  
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE users SET email = $1, username = $2, first_name = $3, last_name = $4, user_role = $5 WHERE id = $6 RETURNING *',
        ['updated@example.com', 'updateduser', 'Updated', 'User', 'editor', '1']
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  
    it('debe retornar un error 400 si el rol es inválido', async () => {
      const req = {
        params: { id: '1' },
        body: {
          email: 'updated@example.com',
          username: 'updateduser',
          firstName: 'Updated',
          lastName: 'User',
          role: 'invalidRole',
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      await updateUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid role' });
    });
  
    it('debe retornar un error 500 si ocurre un error al actualizar el usuario', async () => {
      const req = {
        params: { id: '1' },
        body: {
          email: 'updated@example.com',
          username: 'updateduser',
          firstName: 'Updated',
          lastName: 'User',
          role: 'editor',
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      pool.query.mockRejectedValueOnce(new Error('Database error'));
  
      await updateUser(req, res);
  
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE users SET email = $1, username = $2, first_name = $3, last_name = $4, user_role = $5 WHERE id = $6 RETURNING *',
        ['updated@example.com', 'updateduser', 'Updated', 'User', 'editor', '1']
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating user' });
    });
  });

//! TEST BY JEST deleteUser

describe('deleteUser controller', () => {
    let pool;
  
    beforeEach(() => {
      pool = new Pool();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('debe eliminar el usuario correctamente si existe', async () => {
      const req = {
        params: { id: '1' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const deletedUser = {
        id: 1,
        email: 'deleted@example.com',
        username: 'deleteduser',
        first_name: 'Deleted',
        last_name: 'User',
        user_role: 'editor',
      };
      pool.query.mockResolvedValueOnce({ rows: [deletedUser] });
  
      await deleteUser(req, res);
  
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1 RETURNING *', ['1']);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted', user: deletedUser });
    });
  
    it('debe retornar un error 404 si el usuario no existe', async () => {
      const req = {
        params: { id: '1' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      pool.query.mockResolvedValueOnce({ rows: [] });
  
      await deleteUser(req, res);
  
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1 RETURNING *', ['1']);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  
    it('debe retornar un error 500 si ocurre un error al eliminar el usuario', async () => {
      const req = {
        params: { id: '1' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      pool.query.mockRejectedValueOnce(new Error('Database error'));
  
      await deleteUser(req, res);
  
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1 RETURNING *', ['1']);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting user' });
    });
  });

  //! TEST BY JEST getMyProfile

  describe('getMyProfile controller', () => {
    let pool;
  
    beforeEach(() => {
      pool = new Pool();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('debe retornar el perfil del usuario correctamente si existe', async () => {
      const req = {
        payload: { userId: '1' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const userProfile = {
        id: 1,
        email: 'user@example.com',
        username: 'username',
        first_name: 'First',
        last_name: 'Last',
        user_role: 'editor',
      };
      pool.query.mockResolvedValueOnce({ rows: [userProfile] });
  
      await getMyProfile(req, res);
  
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', ['1']);
      expect(res.json).toHaveBeenCalledWith(userProfile);
    });
  
    it('debe retornar un error 404 si el usuario no existe', async () => {
      const req = {
        payload: { userId: '1' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      pool.query.mockResolvedValueOnce({ rows: [] });
  
      await getMyProfile(req, res);
  
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', ['1']);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  
    it('debe retornar un error 500 si ocurre un error al obtener el perfil', async () => {
      const req = {
        payload: { userId: '1' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      pool.query.mockRejectedValueOnce(new Error('Database error'));
  
      await getMyProfile(req, res);
  
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', ['1']);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching user profile' });
    });
  });