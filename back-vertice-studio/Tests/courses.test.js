const request = require('supertest');
const express = require('express');
const { getAllCourses, createCourses, getCoursesById, updateCoursesById, deleteCoursesById } = require("../Controllers/coursesController")
const coursesModel = require("../Models/coursesModel");

const app = express();
app.use(express.json());

app.get('/courses', getAllCourses);
app.post('/courses', createCourses);
app.get('/courses/:_id', getCoursesById);
app.patch('/courses/:_id', updateCoursesById);
app.delete('/courses/:_id', deleteCoursesById);

jest.mock("../Models/coursesModel");

//! TEST BY JEST getAllCourses

describe('GET /courses', () => {
    it('should return all courses', async () => {
      const courses = [
        {
          _id: '60c72b2f9b1e8d3f14d6475c',
          title: 'Curso 1',
          description: 'Descripción del curso 1',
          category: 'Desarrollo',
          duration: 10,
          level: 'Intermedio',
          instructor: 'Instructor 1',
          price: 99.99,
        },
        {
          _id: '60c72b2f9b1e8d3f14d6476c',
          title: 'Curso 2',
          description: 'Descripción del curso 2',
          category: 'Desarrollo',
          duration: 15,
          level: 'Avanzado',
          instructor: 'Instructor 2',
          price: 129.99,
        },
      ];

      coursesModel.find.mockResolvedValue(courses);
  
      const response = await request(app).get('/courses');
  
      expect(response.status).toBe(200);
      expect(response.body.courses).toEqual(courses);
    });
  
    it('should return 500 if there is an error', async () => {
      coursesModel.find.mockRejectedValue(new Error('Error interno'));
  
      const response = await request(app).get('/courses');
  
      expect(response.status).toBe(500);
      expect(response.body.status).toBe('Failed');
      expect(response.body.error).toBe('Error interno');
    });
  });

//! TEST BY JEST createCourses

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

//! TEST BY JEST getCoursesById


describe('GET /courses/:_id', () => {
  it('should return a course by ID', async () => {
    const courseId = '60c72b2f9b1e8d3f14d6475c';
    const course = {
      _id: courseId,
      title: 'Curso de Prueba',
      description: 'Descripción del curso de prueba',
      category: 'Desarrollo',
      duration: 10,
      level: 'Intermedio',
      instructor: 'Instructor de Prueba',
      price: 99.99,
    };

    coursesModel.findById.mockResolvedValue(course);

    const response = await request(app).get(`/courses/${courseId}`);

    expect(response.status).toBe(200);
    expect(response.body.course).toEqual(course);
  });

  it('should return 404 if course is not found', async () => {
    const courseId = '60c72b2f9b1e8d3f14d6475c';

    coursesModel.findById.mockResolvedValue(null);

    const response = await request(app).get(`/courses/${courseId}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe('Failed');
    expect(response.body.message).toBe('Course not found');
  });

  it('should return 500 if there is an error', async () => {
    const courseId = '60c72b2f9b1e8d3f14d6475c';

    coursesModel.findById.mockRejectedValue(new Error('Error interno'));

    const response = await request(app).get(`/courses/${courseId}`);

    expect(response.status).toBe(500);
    expect(response.body.status).toBe('Failed');
    expect(response.body.error).toBe('Error interno');
  });
});

//! TEST BY JEST updateCoursesById

describe('PATCH /courses/:_id', () => {
    it('should update a course by ID', async () => {
      const courseId = '60c72b2f9b1e8d3f14d6475c';
      const updatedCourse = {
        _id: courseId,
        title: 'Curso Actualizado',
        description: 'Descripción actualizada',
        category: 'Desarrollo',
        duration: 15,
        level: 'Avanzado',
        instructor: 'Instructor Actualizado',
        price: 129.99,
      };
  
      coursesModel.findByIdAndUpdate.mockResolvedValue(updatedCourse);
  
      const response = await request(app)
        .patch(`/courses/${courseId}`)
        .send(updatedCourse);
  
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('Success');
      expect(response.body.course).toEqual(updatedCourse);
    });
  
    it('should return 404 if course is not found', async () => {
      const courseId = '60c72b2f9b1e8d3f14d6475c';
  
      coursesModel.findByIdAndUpdate.mockResolvedValue(null);
  
      const response = await request(app)
        .patch(`/courses/${courseId}`)
        .send({});
  
      expect(response.status).toBe(404);
      expect(response.body.status).toBe('Failed');
      expect(response.body.message).toBe('Course not found');
    });
  
    it('should return 500 if there is an error', async () => {
      const courseId = '60c72b2f9b1e8d3f14d6475c';
  
      coursesModel.findByIdAndUpdate.mockRejectedValue(new Error('Error interno'));
  
      const response = await request(app)
        .patch(`/courses/${courseId}`)
        .send({ title: 'Curso de Error' });
  
      expect(response.status).toBe(500);
      expect(response.body.status).toBe('Failed');
      expect(response.body.error).toBe('Error interno');
    });
  });

  //! TEST BY JEST deleteCoursesById

  describe('DELETE /courses/:_id', () => {
    it('should delete a course by ID', async () => {
      const courseId = '60c72b2f9b1e8d3f14d6475c';
      const deletedCourse = {
        _id: courseId,
        title: 'Curso a Eliminar',
        description: 'Descripción del curso a eliminar',
        category: 'Desarrollo',
        duration: 10,
        level: 'Intermedio',
        instructor: 'Instructor 1',
        price: 99.99,
      };

      coursesModel.findByIdAndDelete.mockResolvedValue(deletedCourse);
  
      const response = await request(app).delete(`/courses/${courseId}`);
  
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('Success');
      expect(response.body.message).toBe('Course deleted');
    });
  
    it('should return 404 if course is not found', async () => {
      const courseId = '60c72b2f9b1e8d3f14d6475c';
  
      coursesModel.findByIdAndDelete.mockResolvedValue(null);
  
      const response = await request(app).delete(`/courses/${courseId}`);
  
      expect(response.status).toBe(404);
      expect(response.body.status).toBe('Failed');
      expect(response.body.message).toBe('Course not found');
    });
  
    it('should return 500 if there is an error', async () => {
      const courseId = '60c72b2f9b1e8d3f14d6475c';
  
      coursesModel.findByIdAndDelete.mockRejectedValue(new Error('Error interno'));
  
      const response = await request(app).delete(`/courses/${courseId}`);
  
      expect(response.status).toBe(500);
      expect(response.body.status).toBe('Failed');
      expect(response.body.error).toBe('Error interno');
    });
  });

//! recordatorio -> utilizar npx jest para lanzar el test.