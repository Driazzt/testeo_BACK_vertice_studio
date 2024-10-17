const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});
const coursesModel = require("../Models/coursesModel");

// Endpoints de los cursos:

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
  try {
    const {
      title,
      description,
      category,
      duration,
      level,
      instructor,
      price,
    } = req.body;
    const courses = await coursesModel.create({
      title,
      description,
      category,
      duration,
      level,
      instructor,
      price,
    });

    res.status(200).json({ status: "Success", courses: courses });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
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

const updateCoursesById = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      duration,
      level,
      instructor,
      price,
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

const markCourseAsFavorite = async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    const result = await pool.query(
      'UPDATE users SET favorite_courses = array_append(favorite_courses, $1::text) WHERE id = $2 RETURNING *',
      [courseId, userId]
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

module.exports = {
  getAllCourses,
  createCourses,
  getCoursesById,
  updateCoursesById,
  deleteCoursesById,
  markCourseAsFavorite,
};