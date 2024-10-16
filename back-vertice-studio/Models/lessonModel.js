const mongoose = require('mongoose');


const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
});

const lessonModel = mongoose.model('Lesson', lessonSchema, "lesson");

module.exports = lessonModel;