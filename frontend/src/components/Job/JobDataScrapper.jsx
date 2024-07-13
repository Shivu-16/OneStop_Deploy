import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { motion } from "framer-motion";
import styles from "../styles"; 

const JobDataScrapper = () => {
  const [nameOfTheCompany, setNameOfTheCompany] = useState("");
  const [companyCareersURL, setCompanyCareersURL] = useState("");
  const [category, setCategory] = useState("");
  const [titleTag, setTitleTag] = useState("");
  const [datePostedTag, setDatePostedTag] = useState("");
  const [paginationNextTag, setPaginationNextTag] = useState("");
  const [paginationLastTag, setPaginationLastTag] = useState("");

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "Employer")) {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);

  const handleJobDataScrape = async (e) => {
    e.preventDefault();

    await axios
      .post(
        "http://localhost:4000/api/v1/job/jobDataScrapper",
        {
          nameOfTheCompany,
          companyCareersURL,
          category,
          titleTag,
          datePostedTag,
          paginationNextTag,
          paginationLastTag,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          }
        }
      )
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <section className={`${styles.paddings} relative z-10 bg-primary-black overflow-x-hidden`}>
      <motion.div
        initial="hidden"
        animate="show"
        className={`${styles.innerWidth} mx-auto flex lg:flex-row flex-col gap-8`}
      >
        <motion.div
          initial={{ x: "100vw" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 50 }}
          className="flex-[0.75] flex justify-center flex-col bg-transparent p-8 border-[1px] border-gray-400 rounded-lg shadow-2xl backdrop-blur-lg"
        >
          <div className="absolute w-[90%] inset-0 gradient-04" />

          <div className="header mb-4 text-center">
            <h3 className="text-2xl font-bold text-white">
              Scrape Job Data
            </h3>
          </div>
          <form onSubmit={handleJobDataScrape}>
            <div className="wrapper mb-4">
              <input
                type="text"
                value={nameOfTheCompany}
                onChange={(e) => setNameOfTheCompany(e.target.value)}
                placeholder="Name of the Company"
                className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
              />
              <input
                type="text"
                value={companyCareersURL}
                onChange={(e) => setCompanyCareersURL(e.target.value)}
                placeholder="Company Careers URL"
                className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white mt-4"
              />
            </div>
            <div className="wrapper mb-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
              >
                <option value="" className="text-zinc-900">Select Category</option>
                <option value="StartUP" className="text-zinc-900">StartUP</option>
                <option value="MNC-Product Based" className="text-zinc-900">MNC-Product Based</option>
                <option value="MNC-Service Based" className="text-zinc-900">MNC-Service Based</option>
              </select>
            </div>
            <div className="wrapper mb-4">
              <input
                type="text"
                value={titleTag}
                onChange={(e) => setTitleTag(e.target.value)}
                placeholder="Title Tag"
                className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
              />
              <input
                type="text"
                value={datePostedTag}
                onChange={(e) => setDatePostedTag(e.target.value)}
                placeholder="Date Posted Tag"
                className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white mt-4"
              />
            </div>
            <div className="wrapper mb-4">
              <input
                type="text"
                value={paginationNextTag}
                onChange={(e) => setPaginationNextTag(e.target.value)}
                placeholder="Pagination Next Tag"
                className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
              />
              <input
                type="text"
                value={paginationLastTag}
                onChange={(e) => setPaginationLastTag(e.target.value)}
                placeholder="Pagination Last Tag"
                className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white mt-4"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#a509ff] text-white py-2 rounded-md hover:bg-[#2d4898bf]"
            >
              Scrape Job Data
            </button>
          </form>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default JobDataScrapper;
