import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.USER_MAIL,
        pass: process.env.MAIL_PASS
    }
});

export const sendMail = async ({
    email,
    otp
}) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

    try {
        const mailOptions = {
            from: process.env.USER_MAIL,
            to: process.env.USER_MAIL,   
            subject: "Ripple | OTP Verification",
            html: `
                <h3>Welcome to Ripple</h3>
                <p><b>OTP:</b> ${otp}</p>
                <p><b>OTP expires in 10 minutes</b></p>
            `
        }

        await transporter.sendMail(mailOptions);
    } catch (error) {
        // Log email error but don't fail the request
        // Email delivery failure shouldn't break user signup
        console.warn('Failed to send email:', error.message);
    }
}