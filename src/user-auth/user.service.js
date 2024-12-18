const UserModel = require('./user.model');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cloudinary = require("cloudinary").v2;
const uploadImage = require('../helper/multer')
const config = require('../../config')
const httpStatus = require('http-status')
require('dotenv').config();



const cloudinaryConfig = config.cloudinary;

cloudinary.config({
  cloud_name: cloudinaryConfig.AUTH_CLOUD_NAME,
  api_key: cloudinaryConfig.AUTH_API_KEY,
  api_secret: cloudinaryConfig.AUTH_API_SECRET,
  secure: true,
});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
  logger: true, // Add this line to log the SMTP connection details
  debug: true, // Include this line for debugging
});

const uploads = uploadImage.single("file");

exports.userSignUp = async (req, res) => {

  try {
    // Handle file upload
    uploads(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Error uploading image. Only supported image files are allowed.",
          success: false,
        });
      }


      if (!req.file) {
        return res.status(400).json({ message: "Please upload a file!" });
      }

      try {

        const data = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
        const cloudinaryUrl = data.secure_url;


        const publicIdRegex = /\/v\d+\/([^/]+)_(\w+)(?:\.\w+)?/;
        const matches = cloudinaryUrl.match(publicIdRegex);

        if (!matches || !matches[1] || !matches[2]) {
          console.error("Public ID not found in the URL.");
          return res.status(500).json({ message: "Error uploading image.", success: false });
        }
        const publicId = `${matches[1]}_${matches[2]}`;

      
        const { username, email, password, gender, address, phonenumber, city, state, country } = req.body;



        const lastUser = await UserModel.findOne().sort({ _id: -1 });
        const id = lastUser ? lastUser.id + 1 : 1;

        const userExists = await UserModel.findOne({ email });
        if (userExists) {
          return res.status(409).send({ message: "User already exists!", success: false });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const newUser = await UserModel.create({
          id,
          username,
          email,
          password: hashedPassword,
          phonenumber,
          gender,
          address,
          city,
          state,
          country,
          image_public_id: publicId,
          cloudinary_url: cloudinaryUrl,
          filePath: req.file.path,
        });

        console.log("User created:", newUser);
        return res.status(201).send({ data: newUser, success: true });

      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return res.status(500).json({ message: "Error uploading image!", success: false });
      }
    });
  } catch (error) {
    console.error("Error during signup:", error);

    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: error.message, success: false });
    }

    if (error.code === 11000) {
      return res.status(409).send({ message: "Email already in use", success: false });
    }

    return res.status(500).send({ message: 'Internal Server Error', success: false });
  }
};






exports.logIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
      return res.status(400).send({ message: "Invalid email!", success: false });
    }

    // Compare password
    const passwordCompared = await bcrypt.compare(password, userExist.password);
    if (!passwordCompared) {
      return res.status(401).send({ message: "Incorrect password!", success: false });
    }

    // Generate JWT token
    const token = JWT.sign({ email: userExist.email }, process.env.SECRET_KEY, {
      expiresIn: "50m",
    });


    await emailSending();

    res.status(200).send({ message: 'Login successfull!', token, email: userExist.email, success: true, user:userExist });
  } catch (error) {
    console.error("Error during login:", error);


    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: "Validation error!", success: false });
    }

    return res.status(500).send({ message: 'Internal server error', success: false });
  }
};

// Function to send email
const emailSending = async () => {
  try {
    console.log("Preparing to send email...");

    setTimeout(async () => {

      await transporter.sendMail({
        from: "smfasihfasih@gmail.com",
        to: "smfasihfasih@gmail.com",
        subject: "Welcome to Fascom Limited",
        text: `Welcome to Fascom Limited! Thank you for your interest.`,
      });
      console.log("Email sent successfully to:");
    }, 10000);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


exports.userGetOne = async (req, res) => {
  try {
    const { id } = req.body;

    // Validate the input
    if (!id) {
      return res.status(400).send({ message: 'User ID is required.', success: false });
    }


    const user = await UserModel.findOne({ _id: id }).exec();

    if (!user) {
      return  res.status(httpStatus.NOT_FOUND).json({
        error: 'User not found'
      });
    }


    return res.status(200).send({ data: user, success: true });

  } catch (error) {
    console.error("Error retrieving user:", error);


    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Invalid user ID format.', success: false });
    }


    return res.status(500).send({ message: 'Internal server error', success: false });
  }
};
