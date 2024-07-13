// Import necessary modules and middleware
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import Company from "../models/companyModel.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

// Register function
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form!"));
  }

  // Check if the user already exists in our database
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  sendToken(user, 201, res, "User Registered!");
});

// Login function
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email, password, and role."));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }

  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found!`, 404)
    );
  }
  sendToken(user, 201, res, "User Logged In!");
});

// Logout function
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});

// Get User function
export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Profile function with myMatchedJobs integration
export const updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.user; 
  const { name, email, phone, keywords, myCompanies } = req.body;

  const updateFields = {};
  if (name) updateFields.name = name;
  if (email) updateFields.email = email;
  if (phone) updateFields.phone = phone;
  if (keywords) updateFields.keywords = keywords;
  if (myCompanies) updateFields.myCompanies = myCompanies;

  const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
    new: true, 
    runValidators: true, 
    useFindAndModify: false, 
  });

  if (!updatedUser) {
    return next(new ErrorHandler('User not found', 404));
  }

  await myMatchedJobs(updatedUser);

  res.status(200).json({
    success: true,
    message: 'Profile Updated!',
    data: updatedUser, 
  });
});

// My Matched Jobs function
export const myMatchedJobs = catchAsyncErrors(async (user) => {
  const companies = await Company.find({
    nameOfTheCompany: { $in: user.myCompanies },
  });

  const matchedJobs = [];

  companies.forEach((company) => {
    company.jobDetails.forEach((job) => {
      user.keywords.forEach((keyword) => {
        if (job.jobTitle.includes(keyword) || job.category.includes(keyword)) {
          matchedJobs.push(job);
        }
      });
    });
  });

  user.myJobs = matchedJobs;
  await user.save();
});
