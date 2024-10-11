const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const coursesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
  },
  level: {
    type: String,
    required: true,
    enum: ["Principiante", "Intermedio", "Avanzado"],
  },
  instructor: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
},
{ timestamps: true });

const coursesModel = mongoose.model("Courses", coursesSchema, "courses");

module.exports = coursesModel;