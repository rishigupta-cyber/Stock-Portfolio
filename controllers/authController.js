const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTP = async (email, otp, subject) => {
  await mailer.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;padding:30px;max-width:400px;margin:auto;border:1px solid #eee;border-radius:10px;">
        <h2 style="color:#e94560;">StockPortfolio</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing:10px;color:#333;">${otp}</h1>
        <p style="color:#888;">Valid for <strong>10 minutes</strong> only.</p>
      </div>
    `
  });
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const otpExpiry = () => new Date(Date.now() + 10 * 60 * 1000);

exports.getSignup = (req, res) => {
  res.render('auth/signup', { error: null, step: 'form' });
};

exports.postSignup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.render('auth/signup', { error: 'Please enter a valid email address!', step: 'form' });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.render('auth/signup', { error: 'This email is already registered!', step: 'form' });
    }

    const otp = generateOTP();
    req.session.signupData = { name, email, password, otp, otpExpiry: otpExpiry() };
    try {
      await sendOTP(email, otp, 'Verify Your Email — StockPortfolio');
    } catch (mailErr) {
      console.log('OTP email error:', mailErr.message);
      return res.render('auth/signup', { error: 'Could not send OTP. Please use a real email!', step: 'form' });
    }

    res.render('auth/signup', { error: null, step: 'otp', email });

  } catch (err) {
    console.log('Signup error:', err.message);
    res.render('auth/signup', { error: 'Something went wrong. Try again.', step: 'form' });
  }
};

exports.verifySignupOTP = async (req, res) => {
  const { otp } = req.body;
  const data = req.session.signupData;
  if (!data) {
    return res.render('auth/signup', { error: 'Session expired. Please try again.', step: 'form' });
  }
  if (otp !== data.otp || new Date() > new Date(data.otpExpiry)) {
    return res.render('auth/signup', { error: 'Invalid or expired OTP!', step: 'otp', email: data.email });
  }

  try {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await User.create({ name: data.name, email: data.email, password: hashed });

    req.session.signupData = null;
    req.session.userId = user._id;
    res.redirect('/dashboard');

  } catch {
    res.render('auth/signup', { error: 'Account creation failed. Try again.', step: 'form' });
  }
};

exports.getLogin = (req, res) => {
  res.render('auth/login', { error: null });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('auth/login', { error: 'This email is not registered!' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('auth/login', { error: 'Incorrect password!' });
    }

    req.session.userId = user._id;
    res.redirect('/dashboard');

  } catch (err) {
    console.log('Login error:', err.message);
    res.render('auth/login', { error: 'Login failed. Try again.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};

exports.getForgotPassword = (req, res) => {
  res.render('auth/forgot-password', { error: null, success: null });
};

exports.postForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('auth/forgot-password', {
        error: 'This email is not registered!',
        success: null
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = otpExpiry();
    await user.save();

    await sendOTP(email, otp, 'Password Reset OTP — StockPortfolio');

    req.session.resetEmail = email;
    res.render('auth/forgot-password', { error: null, success: `OTP sent to ${email}!` });

  } catch (err) {
    console.log('Email error:', err.message);
    res.render('auth/forgot-password', { error: 'Failed to send OTP. Try again.', success: null });
  }
};

exports.getVerifyOTP = (req, res) => {
  res.render('auth/verify-otp', { error: null });
};

exports.postVerifyOTP = async (req, res) => {
  const { otp, newPassword } = req.body;
  const email = req.session.resetEmail;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.render('auth/verify-otp', { error: 'OTP is wrong or expired!' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    req.session.resetEmail = null;
    res.redirect('/login');

  } catch {
    res.render('auth/verify-otp', { error: 'Something went wrong.' });
  }
};