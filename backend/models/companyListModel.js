import mongoose from "mongoose";

const companyListSchema = new mongoose.Schema({
  nameOfTheCompany: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const CompanyList = mongoose.model("CompanyList", companyListSchema);

export default CompanyList;
