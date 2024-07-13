import { catchAsyncErrors } from "../middlewares/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import User from "../models/userModel";
import Company from "../models/companyModel";

// Function to match and add jobs to the user's myJobs list
export const myMatchedJobs = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

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

  res.status(200).json({
    success: true,
    message: "Matched jobs added to your list!",
    data: user.myJobs,
  });
});
