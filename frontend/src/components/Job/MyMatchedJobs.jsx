import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { motion } from "framer-motion";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import styles from "../styles";
import StarsCanvas from "../utils/Stars";

const MyMatchedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/getuser",
          { withCredentials: true }
        );
        setJobs(sortJobs(response.data.user.myJobs));
        console.log(response);
      } catch (error) {
        toast.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!isAuthorized) {
    navigateTo("/login");
  }

  const handleAppliedChange = (jobId, isChecked) => {
    setJobs((prevJobs) =>
      sortJobs(
        prevJobs.map((job) =>
          job._id === jobId
            ? { ...job, applied: isChecked ? "Applied" : "Not-Applied" }
            : job
        )
      )
    );
  };

  const sortJobs = (jobs) => {
    return jobs.sort((a, b) => (a.applied === "Applied" ? 1 : -1));
  };

  return (
    <section
      className={`${styles.paddings} z-10 bg-primary-black overflow-x-hidden`}
    >
      <div className="absolute inset-0 z-0">
        <StarsCanvas />
      </div>
      <motion.div
        initial="hidden"
        animate="show"
        className={`${styles.innerWidth} mx-auto w-[90vw] w flex lg:flex-row flex-col gap-8`}
      >
        <motion.div
          initial={{ x: "100vw" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 50 }}
          className="flex-[0.75] flex justify-center flex-col bg-transparent p-8 border-[1px] border-gray-400 mx-auto w-[90vw] rounded-lg shadow-2xl backdrop-blur-lg"
        >
          <div className="absolute w-[90%] inset-0 gradient-04" />
          <div className="header mb-6 text-center">
            <h1 className="text-4xl font-bold text-white">My Matched Jobs</h1>
          </div>
          {jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="card bg-gray-800 p-4 rounded-lg shadow-md"
                >
                  <div className="content grid gap-4 mb-4">
                    <div className="short_fields grid lg:grid-cols-2 gap-4">
                      <div>
                        <span className="text-white">Title:</span>
                        <h3 className="text-xl font-semibold text-white">
                          {job.jobTitle}
                        </h3>
                      </div>
                      <div>
                        <span className="text-white">Category:</span>
                        <p className="text-secondary-white">{job.category}</p>
                      </div>
                      <div>
                        <span className="text-white">Date Posted:</span>
                        <p className="text-secondary-white">{job.datePosted}</p>
                      </div>
                      <div>
                        <span className="text-white">Date Added:</span>
                        <p className="text-secondary-white">
                          {new Date(
                            job.dateAddedToYourList
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-secondary-white flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={job.applied === "Applied"}
                            onChange={(e) =>
                              handleAppliedChange(job._id, e.target.checked)
                            }
                          />
                          Applied
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white">No matched jobs found!</p>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default MyMatchedJobs;
