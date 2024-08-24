const User = require('../models/authModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
    });

    await user.save();

    const verificationLink = `http://localhost:5000/api/auth/verify/${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the following link: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res
      .status(200)
      .json({
        message:
          'User registered, please check your email to verify your account',
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    user.isVerified = true;
    user.verificationToken = null;

    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: 'Invalid token or token has expired' });
  }
};

module.exports = {
  registerUser,
  verifyUser,
};
