const coursesModel = require ("../Models/coursesModel");

// Endpoints de los cursos:

const getAllCourses = async (req, res) => {
    try {
      const courses = await coursesModel.find();
  
      res.status(200).json({ courses: courses });
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

  module.exports = {
    getAllCourses,
    createCourses,
    // getCoursesById,
    // updateCoursesById,
    // deleteCoursesById,
  }