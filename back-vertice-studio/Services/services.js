const nodemailer = require('nodemailer');

const transporte = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'curro.rb@gmail.com',
        pass: 'tmzu oiuk ednz gfrt'
    }
})

const sendMail = async (to, subject, html) => {
    try {
        const options = {
            from: "curro.rb@gmail.com",
            to: to,
            subject: subject,
            html: html
        }
        await transporte.sendMail(options);
    } catch (error) {
        console.log(error);
    }
}



module.exports = {sendMail}