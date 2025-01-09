const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // Or use another service like SendGrid
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            text: message,
        });

        console.log("Email sent successfully.");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Could not send email.");
    }
};
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
};


module.exports = {sendEmail, generateOTP};
