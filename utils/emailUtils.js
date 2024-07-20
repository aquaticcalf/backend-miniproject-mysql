import { createTransport } from 'nodemailer'

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: 'verify@email.com', // need to change this
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: http://url/verify?token=${verificationToken}`,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Verification email sent')
  } catch (error) {
    console.error('Error sending verification email:', error)
  }
}

const sendPasswordResetEmail = async (email, resetToken) => {
  const mailOptions = {
    from: 'verify@email.com', // need to change this
    to: email,
    subject: 'Password Reset',
    text: `You requested a password reset. Click the following link to reset your password: http://url/reset-password?token=${resetToken}`,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Password reset email sent')
  } catch (error) {
    console.error('Error sending password reset email:', error)
  }
}

export default {
  sendVerificationEmail,
  sendPasswordResetEmail,
}
