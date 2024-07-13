import express from "express";
import {
  companyList,
  deleteJob,
  getAllJobs,
  getMyJobs,
  getSingleJob,
  postJob,
  updateJob,
  jobDataScrapper,
  myMatchedJobs
} from "../controllers/jobController.js";
// import { myMatchedJobs } from "../controllers/jobMatcher.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall", getAllJobs);
router.get("/companyList",companyList);
router.post("/post", isAuthenticated, postJob);
router.post("/jobDataScrapper", isAuthenticated, jobDataScrapper);
router.get("/getmyjobs", isAuthenticated, getMyJobs);
router.put("/update/:id", isAuthenticated, updateJob);
router.delete("/delete/:id", isAuthenticated, deleteJob);
router.get("/:id", isAuthenticated, getSingleJob);
router.get('/myMatchedjobs', isAuthenticated, myMatchedJobs);

export default router;
