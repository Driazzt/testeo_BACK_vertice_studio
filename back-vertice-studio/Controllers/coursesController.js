const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});
const coursesModel = require("../Models/coursesModel");
const {verifyUserById} = require("../Controllers/loginController");
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
  const { html, css, title, description, category, duration, level, instructor, price, image, courseId } = req.body;
  
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
        lessons: req.body.lessons // Asegúrate de incluir las lecciones
      });
      const savedCourse = await newCourse.save();
      return res.status(201).json(savedCourse);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
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
    const courseName = course.title;

    const result = await pool.query(
      'UPDATE users SET favorite_courses = array_remove(favorite_courses, $1::text) WHERE id = $2 RETURNING *',
      [courseName, userId]
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
  const { title, content, media, screens } = req.body;

  try {
    const course = await coursesModel.findById(_id);
    if (!course) {
      return res.status(404).json({ status: "Failed", message: "Course not found" });
    }

    const newLesson = {
      title,
      content,
      media,
      screens
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

    const newScreen = {
      title,
      content,
      media,
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
    res.status (500).json({ status: "Failed", error: error.message });
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

module.exports = {
  getAllCourses,
  createCourses,
  getCoursesById, 
  updateCourseById, 
  deleteCoursesById,
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
  verifyUserById
};