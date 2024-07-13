import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Job } from "../models/jobSchema.js";
import Company from "../models/companyModel.js";
import CompanyList from "../models/companyListModel.js";
import ErrorHandler from "../middlewares/error.js";
import puppeteer from "puppeteer";

export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const companyList = catchAsyncErrors(async (req, res, next) => {
  const companies = await Company.find();
  res.status(200).json({
    success: true,
    companies,
  });
});

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

export const postJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;

  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler("Please provide full job details.", 400));
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(
      new ErrorHandler(
        "Please either provide fixed salary or ranged salary.",
        400
      )
    );
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    return next(
      new ErrorHandler("Cannot Enter Fixed and Ranged Salary together.", 400)
    );
  }

  const postedBy = req.user._id;

  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });
  res.status(200).json({
    success: true,
    message: "Job Posted Successfully!",
    job,
  });
});

export const jobDataScrapper = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "Employer") {
    return next(
      new ErrorHandler("Only Admins are allowed to access this resource.", 400)
    );
  }

  const {
    nameOfTheCompany,
    companyCareersURL,
    category,
    titleTag,
    datePostedTag,
    paginationNextTag,
    paginationLastTag,
  } = req.body;

  if (
    !nameOfTheCompany ||
    !companyCareersURL ||
    !category ||
    !titleTag ||
    !datePostedTag
  ) {
    return next(new ErrorHandler("Please provide all required details.", 400));
  }
  const postedBy = req.user._id;

  // Check if the company already exists in the CompanyList
  let companyList = await CompanyList.findOne({ nameOfTheCompany });

  if (!companyList) {
    console.log("Adding new company to the list");
    companyList = new CompanyList({
      nameOfTheCompany,
      category,
    });
    await companyList.save();
  } else {
    console.log("Company already exists in the list");
  }

  // Check if the company already exists in the Company schema
  let company = await Company.findOne({ nameOfTheCompany });
  if (company) {
    console.log("Company already exists, adding job data");
  } else {
    console.log("Creating new company schema");
    company = new Company({
      nameOfTheCompany,
      companyCareersURL,
      category,
      titleTag,
      datePostedTag,
      paginationNextTag,
      paginationLastTag,
      postedBy,
      jobDetails: [],
    });
  }

  console.log("Starting the browser...");
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log("Navigating to the careers URL...");
    await page.goto(companyCareersURL, { timeout: 60000 });
    await page.waitForSelector(titleTag, { timeout: 60000 });

    console.log("Scraping job titles on the first page...");
    const allJobs = new Set();

    const scrapeTitles = async () => {
      const jobs = await page.evaluate(
        (titleTag, datePostedTag) => {
          const titleElements = Array.from(document.querySelectorAll(titleTag));
          const dateElements = Array.from(
            document.querySelectorAll(datePostedTag)
          );

          return titleElements
            .map((title, index) => {
              const datePosted = dateElements[index]
                ? dateElements[index].innerText.trim()
                : "No Date Provided";
              const jobTitle = title.innerText.trim();
              return {
                jobTitle,
                datePosted,
              };
            })
            .filter((job) => job.jobTitle.includes("Intern"));
        },
        titleTag,
        datePostedTag
      );

      jobs.forEach((job) => {
        allJobs.add(JSON.stringify(job));
      });

      console.log(`Scraped ${jobs.length} job titles.`);
    };

    await scrapeTitles();

    let hasNextPage = true;
    while (hasNextPage) {
      console.log(paginationNextTag);
      const nextPageLink = await page.$(paginationNextTag);

      if (nextPageLink) {
        const isLastPaginationItem = await page.evaluate(
          (link, paginationLastTag) => {
            return link.classList.contains(paginationLastTag);
          },
          nextPageLink,
          paginationLastTag
        );

        if (isLastPaginationItem) {
          hasNextPage = false;
        } else {
          console.log("Navigating to the next page...");
          await nextPageLink.click();
          await page.waitForNavigation({ waitUntil: "networkidle2" });

          await scrapeTitles();
        }
      } else {
        hasNextPage = false;
      }
    }

    const uniqueJobs = [...allJobs].map((job) => JSON.parse(job));

    console.log("All job titles scraped:");
    uniqueJobs.forEach((job, index) => console.log(`${index + 1}:`, job));

    // Add unique jobs to the company document
    uniqueJobs.forEach((job) => {
      const jobExists = company.jobDetails.some(
        (existingJob) =>
          existingJob.jobTitle === job.jobTitle &&
          existingJob.datePosted === job.datePosted
      );

      if (!jobExists) {
        company.jobDetails.push({ ...job, category });
      }
    });

    await company.save();

    res.status(200).json({
      success: true,
      message: "Jobs scraped and saved successfully!",
    });
  } catch (error) {
    if (error.name === "TimeoutError") {
      return next(new ErrorHandler("Navigation timeout exceeded", 500));
    } else {
      return next(new ErrorHandler(`Navigation error: ${error.message}`, 500));
    }
  } finally {
    console.log("Closing the browser...");
    await browser.close();
  }
});

export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const myJobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    myJobs,
  });
});

export const updateJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }
  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Job Updated!",
  });
});


export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }
  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job Deleted!",
  });
});

export const getSingleJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler("Job not found.", 404));
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(new ErrorHandler(`Invalid ID / CastError`, 404));
  }
});
