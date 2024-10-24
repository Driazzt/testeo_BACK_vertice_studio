const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  media: {
    type: String,
  },
  html: { 
    type: String,
  },
  css: { 
    type: String,
  },
}, { _id: true });

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: false,
  },
  media: {
    type: String,
  },
  html: { 
    type: String,
  },
  css: { 
    type: String,
  },
  screens: [screenSchema], 
}, { _id: true });

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
  image: {
    type: String,
    required: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  lessons: {
    type: [lessonSchema],
    required: false,
    min: 1,
  },
  author: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const coursesModel = mongoose.model("Courses", coursesSchema, "courses");

module.exports = coursesModel;