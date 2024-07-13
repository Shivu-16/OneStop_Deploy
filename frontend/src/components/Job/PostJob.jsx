import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { motion } from "framer-motion";
import styles from "../styles"; // Ensure you have this file for shared styles

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "Employer")) {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);

  const handleJobPost = async (e) => {
    e.preventDefault();
    if (salaryType === "Fixed Salary") {
      setSalaryFrom("");
      setSalaryTo("");
    } else if (salaryType === "Ranged Salary") {
      setFixedSalary("");
    } else {
      setSalaryFrom("");
      setSalaryTo("");
      setFixedSalary("");
    }

    await axios
      .post(
        "http://localhost:4000/api/v1/job/post",
        fixedSalary.length >= 4
          ? {
              title,
              description,
              category,
              country,
              city,
              location,
              fixedSalary,
            }
          : {
              title,
              description,
              category,
              country,
              city,
              location,
              salaryFrom,
              salaryTo,
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
              Post a New Job
            </h3>
          </div>
          <form onSubmit={handleJobPost}>
            <div className="wrapper mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Job Title"
                className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white mt-4"
              >
                <option value="" className="text-zinc-900">Select Category</option>
                <option value="Graphics & Design" className="text-zinc-900">Graphics & Design</option>
                <option value="Mobile App Development" className="text-zinc-900">Mobile App Development</option>
                <option value="Frontend Web Development" className="text-zinc-900">Frontend Web Development</option>
                <option value="MERN Stack Development" className="text-zinc-900">MERN Stack Development</option>
                <option value="Account & Finance" className="text-zinc-900">Account & Finance</option>
                <option value="Artificial Intelligence" className="text-zinc-900">Artificial Intelligence</option>
                <option value="Video Animation" className="text-zinc-900">Video Animation</option>
                <option value="MEAN Stack Development" className="text-zinc-900">MEAN Stack Development</option>
                <option value="MEVN Stack Development" className="text-zinc-900">MEVN Stack Development</option>
                <option value="Data Entry Operator" className="text-zinc-900">Data Entry Operator</option>
              </select>
            </div>
            <div className="wrapper flex flex-col lg:flex-row gap-4 mb-4">
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-zinc-900"
              />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-zinc-900"
              />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white mb-4"
            />
            <div className="salary_wrapper mb-4">
              <select
                value={salaryType}
                onChange={(e) => setSalaryType(e.target.value)}
                className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white mb-4"
              >
                <option value="default" className="text-zinc-900">Select Salary Type</option>
                <option value="Fixed Salary" className="text-zinc-900">Fixed Salary</option>
                <option value="Ranged Salary" className="text-zinc-900">Ranged Salary</option>
              </select>
              {salaryType === "default" ? (
                <p className="text-white">Please provide Salary Type *</p>
              ) : salaryType === "Fixed Salary" ? (
                <input
                  type="number"
                  placeholder="Enter Fixed Salary"
                  value={fixedSalary}
                  onChange={(e) => setFixedSalary(e.target.value)}
                  className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                />
              ) : (
                <div className="ranged_salary flex flex-col lg:flex-row gap-4">
                  <input
                    type="number"
                    placeholder="Salary From"
                    value={salaryFrom}
                    onChange={(e) => setSalaryFrom(e.target.value)}
                    className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                  />
                  <input
                    type="number"
                    placeholder="Salary To"
                    value={salaryTo}
                    onChange={(e) => setSalaryTo(e.target.value)}
                    className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                  />
                </div>
              )}
            </div>
            <textarea
              rows="10"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Job Description"
              className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white mb-4"
            />
            <button
              type="submit"
              className="w-full bg-[#a509ff] text-white py-2 rounded-md hover:bg-[#2d4898bf]"
            >
              Create Job
            </button>
          </form>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PostJob;
