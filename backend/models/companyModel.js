import mongoose from "mongoose";

const jobDetailsSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  datePosted: {
    type: String,
    required: true,
  },
  scrapedOn: {
    type: Date,
    default: Date.now,
  },
});

const companySchema = new mongoose.Schema({
  nameOfTheCompany: {
    type: String,
    required: [true, "Please provide the Name of the Company"],
    minLength: [3, "Title must contain at least 3 Characters!"],
    maxLength: [30, "Title cannot exceed 30 Characters!"],
    unique: true,
  },
  companyCareersURL: {
    type: String,
    required: [true, "Please provide the company careers URL."],
    minLength: [10, "Description must contain at least 10 Characters!"],
    maxLength: [500, "Description cannot exceed 500 Characters!"],
  },
  category: {
    type: String,
    required: [true, "Please provide a category of the Company (StartUP, MNC-Product Based, or MNC-Service Based)."],
  },
  titleTag: {
    type: String,
    required: [true, "Now inspect the tag of a title of any posted opportunity and paste here."],
  },
  paginationNextTag: {
    type: String,
    required: [true, "Now inspect the tag of pagination to next page (if any) and paste here."],
  },
  paginationLastTag: {
    type: String,
    required: [true, "Now inspect the tag of pagination to last page (if any) and paste here."],
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  jobDetails: [jobDetailsSchema],
});

const Company = mongoose.model("Company", companySchema);

export default Company;
