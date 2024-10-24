const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});
const coursesModel = require("../Models/coursesModel");
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATA_URL_MONGO);

//! COURSES

const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const skip = (page - 1) * limit;

    const courses = await coursesModel.find().skip(skip).limit(limit);
    const totalCourses = await coursesModel.countDocuments();

    const totalPages = Math.ceil(totalCourses / limit);

    res.status(200).json({
      courses: courses,
      totalCourses: totalCourses,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

const createCourses = async (req, res) => {
  const { html, css, title, description, category, duration, level, instructor, price, image, lessons, courseId} = req.body;
  const author = req.payload.userId;
  console.log(req.payload);
  try {

    if (courseId) {
      return updateCourseById(req, res);
    } else {
      const newCourse = new coursesModel({ 
        title, 
        description, 
        category, 
        duration, 
        level, 
        instructor, 
        price, 
        image, 
        html, 
        css,
        lessons,
        author,
      });
      const savedCourse = await newCourse.save();
      
      syncCourseMetadata().catch(error => console.error('Error synchronizing course metadata:', error));

      return res.status(201).json({ status: "Success", course: savedCourse });
    }
  } catch (err) {
    return res.status(500).json({ status: "Failed", error: err.message });
  }
};

const getCoursesById = async (req, res) => {
  try {
    const course = await coursesModel.findById(req.params._id);
    if (!course) {
      return res.status(404).json({ status: "Failed", message: "Course not found" });
    }
    res.status(200).json({ course: course });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

const updateCourseById = async (req, res) => {
  try {

    const {
      title,
      description,
      category,
      duration,
      level,
      instructor,
      price,
      image,
      lessons,
      screens,
      html,
      css,
    } = req.body;
    const author = req.payload.userId;
    const course = await coursesModel.findByIdAndUpdate(
      req.params._id,
      {
        title,
        description,
        category,
        duration,
        level,
        instructor,
        price,
        image,
        lessons,
        screens,
        html,
        css,
        author,
      },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ status: "Failed", message: "Course not found" });
    }

    res.status(200).json({ status: "Success", course: course });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

const deleteCoursesById = async (req, res) => {
  try {
    const course = await coursesModel.findByIdAndDelete(req.params._id);
    if (!course) {
      return res.status(404).json({ status: "Failed", message: "Course not found" });
    }
    res.status(200).json({ status: "Success", message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

//! PUBLISHED COURSES

const publishCourse = async (req, res) => {
  try {
    const course = await coursesModel.findByIdAndUpdate(
      req.params.courseId,
      { published: true },
      { new: true }
    );
    if (!course) {
      return res.status(404).send({ message: 'Course not found' });
    }
    if (course.published) {
      return res.status(400).send({ message: 'Course already published' });
    }
    res.send({ status: 'success', courseId: course._id, published: course.published });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//! FAVORITES

const markCourseAsFavorite = async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    const course = await coursesModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const courseFavorite = {
      id: course._id,
      image: course.image,
      title: course.title
    };

    const result = await pool.query(
      'UPDATE users SET favorite_courses = array_append(favorite_courses, $1::jsonb) WHERE id = $2 RETURNING *',
      [courseFavorite, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Course marked as favorite", user: result.rows[0] });
  } catch (error) {
    console.error('Error al marcar el curso como favorito:', error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const removeCourseFromFavorites = async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    const course = await coursesModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const courseFavorite = {
      id: course._id,
      image: course.image,
      title: course.title
    };

    const result = await pool.query(
      'UPDATE users SET favorite_courses = array_remove(favorite_courses, $1::jsonb) WHERE id = $2 RETURNING *',
      [courseFavorite, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Course removed from favorites", user: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar el curso de favoritos:', error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

//! LESSONS

const getAllLessons = async (req, res) => {
  try {
    const course = await coursesModel.findById(req.params._id);
    if (!course) {
      return res.status(404).json({ status: "Failed", message: "Course not found" });
    }

    const lessons = course.lessons;
    res.status(200).json({ status: "Success", lessons: lessons });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

const getLessonById = async (req, res) => {
  try {
    const course = await coursesModel.findById(req.params._id);
    if (!course) {
      return res.status(404).json({ status: "Failed", message: "Course not found" });
    }

    const lesson = course.lessons.id(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ status: "Failed", message: "Lesson not found" });
    }

    res.status(200).json({ status: "Success", lesson: lesson });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

const createLesson = async (req, res) => {
  const { _id } = req.params;
  const { title, content, media, screens, html, css } = req.body;

  try {
    const course = await coursesModel.findById(_id);
    if (!course) {
      return res.status(404).json({ status: "Failed", message: "Course not found" });
    }

    const newLesson = {
      title,
      content,
      media,
      screens,
      html,
      css,
    };

    course.lessons.push(newLesson);
    await course.save();

    res.status(201).json({ status: "Success", lesson: newLesson });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

const updateLessonById = async (req, res) => {
  const { _id, lessonId } = req.params;
  const { title, content, media, screens } = req.body;

  try {
    const course = await coursesModel.findById(_id);
    if (!course) {
      return res.status(404).json({ status: "Failed", message: "Course not found" });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ status: "Failed", message: "Lesson not found" });
    }

    if (title) lesson.title = title;
    if (content) lesson.content = content;
    if (media) lesson.media = media;
    if (screens) lesson.screens = screens;

    await course.save();

    res.status(200).json({ status: "Success", lesson: lesson });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

const deleteLessonById = async (req, res) => {
  const { _id, lessonId } = req.params;

  try {
    const course = await coursesModel.findById(_id);
    if (!course) {
      return res.status(404).json({ status: "Failed", message: "Course not found" });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ status: "Failed", message: "Lesson not found" });
    }

    course.lessons.pull(lessonId);
    await course.save();

    res.status(200).json({ status: "Success", message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

//! SCREENS

const createScreen = async (req, res) => {
  const { _id, lessonId } = req.params;
  const { title, content, media, html, css } = req.body;

  try {
    const course = await coursesModel.findById(_id);
    if (!course) {
      return res.status(404).json({ status: "Failed", message: "Course not found" });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ status: "Failed", message: "Lesson not found" });
    }

    const newScreen = {
      title,
      content: `<div>${content}</div>`,
      media,
      html,
      css,
    };

    lesson.screens.push(newScreen);
    await course.save();

    res.status(201).json({ status: "Success", screen: newScreen });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

const getAllScreens = async (req, res) => {
  const { _id, lessonId } = req.params;

  try {
    const course = await coursesModel.findById(_id);
    if (!course) {
      return res.status(404).json({ status: "Failed", message: "Course not found" });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ status: "Failed", message: "Lesson not found" });
    }

    const screens = lesson.screens;
    res.status(200).json({ status: "Success", screens: screens });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

const getScreenById = async (req, res) => {
  const { _id, lessonId, screenId } = req.params;

  try {
    const course = await coursesModel.findById(_id);
    if (!course) {
      return res.status(404).json({ status: "Failed", message: "Course not found" });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ status: "Failed", message: "Lesson not found" });
    }

    const screen = lesson.screens.id(screenId);
    if (!screen) {
      return res.status(404).json({ status: "Failed", message: "Screen not found" });
    }

    res.status(200).json({ status: "Success", screen: screen });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

const updateScreenById = async (req, res) => {
  const { _id, lessonId, screenId } = req.params;
  const { title, content, media } = req.body;

  try {
    const course = await coursesModel.findById(_id);
    if (!course) {
      return res.status(404).json({ status: "Failed", message: "Course not found" });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ status: "Failed", message: "Lesson not found" });
    }

    const screen = lesson.screens.id(screenId);
    if (!screen) {
      return res.status(404).json({ status: "Failed", message: "Screen not found" });
    }

    if (title) screen.title = title;
    if (content) screen.content = content;
    if (media) screen.media = media;

    await course.save();

    res.status(200).json({ status: "Success", screen: screen });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

const deleteScreenById = async (req, res) => {
  const { _id, lessonId, screenId } = req.params;

  try {
    const course = await coursesModel.findById(_id);
    if (!course) {
      return res.status(404).json({ status: "Failed", message: "Course not found" });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ status: "Failed", message: "Lesson not found" });
    }

    const screen = lesson.screens.id(screenId);
    if (!screen) {
      return res.status(404).json({ status: "Failed", message: "Screen not found" });
    }

    lesson.screens.pull(screenId);
    await course.save();

    res.status(200).json({ status: "Success", message: "Screen deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};


//! Sincronización entre PostgreSQL y MongoDB

const syncCourseMetadata = async () => {
  try {
    const courses = await coursesModel.find();

    for (const course of courses) {
      const { _id, title, author, createdAt } = course;

      const authorResult = await pool.query('SELECT username FROM users WHERE id = $1', [author]);
      const authorName = authorResult.rows.length > 0 ? authorResult.rows[0].username : 'Unknown';

      if (authorName === 'Unknown') {
        //console.error(`Author with ID ${author} not found in PostgreSQL`);
      }

      await pool.query(
        'INSERT INTO course_metadata (course_id, title, author, created_at) VALUES ($1, $2, $3, $4) ON CONFLICT (course_id) DO UPDATE SET title = $2, author = $3, created_at = $4',
        [_id.toString(), title, authorName, createdAt]
      );
    }
    console.log('Course metadata synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing course metadata:', error);
  }
};


module.exports = {
  getAllCourses,
  createCourses,
  getCoursesById, 
  updateCourseById, 
  deleteCoursesById,
  publishCourse,
  markCourseAsFavorite,
  removeCourseFromFavorites,
  getLessonById,
  getAllLessons,
  createLesson,
  updateLessonById,
  deleteLessonById,
  createScreen,
  getAllScreens,
  getScreenById,
  updateScreenById,
  deleteScreenById,
  syncCourseMetadata,
};