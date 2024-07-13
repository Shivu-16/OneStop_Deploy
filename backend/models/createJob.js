import puppeteer from "puppeteer";
import mongoose from "mongoose";
import { CreateData } from "./path-to-your-schema-file";
import { JobData } from "./path-to-your-job-data-schema";

async function jobDataScrapper(
  nameOfTheCompany,
  companyCareersURL,
  category,
  titleTag,
  datePostedTag,
  paginationNextTag,
  paginationLastTag
) {
  const browser = await puppeteer.launch({ headless: false }); // Set headless to false for debugging
  const page = await browser.newPage();

  try {
    await page.goto(companyCareersURL, { timeout: 60000 });
    await page.waitForSelector(titleTag, { timeout: 60000 });

    const allJobs = new Set();

    const scrapeTitles = async () => {
      const jobs = await page.evaluate((titleTag, datePostedTag) => {
        const titleElements = Array.from(document.querySelectorAll(titleTag));
        const dateElements = Array.from(document.querySelectorAll(datePostedTag));

        return titleElements.map((title, index) => {
          const datePosted = dateElements[index] ? dateElements[index].innerText.trim() : "No Date Provided";
          const jobTitle = title.innerText.trim();
          return {
            jobTitle,
            datePosted,
          };
        }).filter(job => job.jobTitle.includes("Intern"));
      }, titleTag, datePostedTag);
      jobs.forEach((job) => allJobs.add(job));
    };

    await scrapeTitles();

    // Loop to handle pagination
    let hasNextPage = paginationNextTag ? true : false;

    while (hasNextPage) {
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
          await nextPageLink.click();
          await page.waitForNavigation({ waitUntil: "networkidle2" });
          await scrapeTitles();
        }
      } else {
        hasNextPage = false;
      }
    }

    // Save the unique jobs to the database
    for (const job of allJobs) {
      const jobData = new JobData({
        nameOfTheCompany,
        jobTitle: job.jobTitle,
        datePosted: job.datePosted,
      });
      await jobData.save();
    }

  } catch (error) {
    if (error.name === "TimeoutError") {
      console.error("Navigation timeout exceeded");
    } else {
      console.error("Navigation error:", error);
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  // Connect to MongoDB
  await mongoose.connect("mongodb://localhost:27017/your-database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Fetch data from MongoDB
  const companyData = await CreateData.find();
  for (const data of companyData) {
    await jobDataScrapper(
      data.nameOfTheCompany,
      data.companyCareersURL,
      data.category,
      data.titleTag,
      data.datePostedTag,
      data.paginationNextTag,
      data.paginationLastTag
    );
  }

  // Close MongoDB connection
  await mongoose.disconnect();
}

main().catch((err) => console.error(err));
