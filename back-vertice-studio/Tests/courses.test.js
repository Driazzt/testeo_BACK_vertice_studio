const request = require('supertest');
const express = require('express');
const { createCourses } = require("../Controllers/coursesController")
const coursesModel = require("../Models/coursesModel");

const app = express();
app.use(express.json());
app.post('/courses', createCourses);

jest.mock("../Models/coursesModel");

describe('POST /courses', () => {
  it('should create a new course and return success', async () => {
    const newCourse = {
      title: 'Curso de Prueba',
      description: 'Descripción del curso de prueba',
      category: 'Desarrollo',
      duration: 10,
      level: 'Intermedio',
      instructor: 'Instructor de Prueba',
      price: 99.99,
    };

    coursesModel.create.mockResolvedValue(newCourse);

    const response = await request(app)
      .post('/courses')
      .send(newCourse);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Success');
    expect(response.body.courses).toEqual(newCourse);
  });

  it('should return 500 if there is an error', async () => {
    coursesModel.create.mockRejectedValue(new Error('Error interno'));

    const response = await request(app)
      .post('/courses')
      .send({});

    expect(response.status).toBe(500);
    expect(response.body.status).toBe('Failed');
    expect(response.body.error).toBe('Error interno');
  });
});


// recordatorio -> utilizar npx jest para lanzar el test.