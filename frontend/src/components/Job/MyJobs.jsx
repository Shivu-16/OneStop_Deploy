import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "../styles";
import StarsCanvas from "../utils/Stars";
import EarthCanvas from "../utils/Earth";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/job/getmyjobs",
          { withCredentials: true }
        );
        setMyJobs(data.myJobs);
      } catch (error) {
        toast.error(error.response.data.message);
        setMyJobs([]);
      }
    };
    fetchJobs();
  }, []);

  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
  }

  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    await axios
      .put(`http://localhost:4000/api/v1/job/update/${jobId}`, updatedJob, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setEditingMode(null);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleDeleteJob = async (jobId) => {
    await axios
      .delete(`http://localhost:4000/api/v1/job/delete/${jobId}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: value } : job
      )
    );
  };

  return (
    <section
      className={`${styles.paddings} relative z-10 bg-primary-black overflow-x-hidden`}
    >
      <div className="absolute inset-0 z-0">
        <StarsCanvas />
        {/* <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <EarthCanvas />
        </div> */}
      </div>
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
            <h1 className="text-2xl font-bold text-white">Your Posted Jobs</h1>
          </div>
          {myJobs.length > 0 ? (
            <div className="space-y-4">
              {myJobs.map((element) => (
                <div
                  className="card bg-gray-800 p-4 rounded-lg shadow-md"
                  key={element._id}
                >
                  <div className="content grid gap-4 mb-4">
                    <div className="short_fields grid lg:grid-cols-2 gap-4">
                      <div>
                        <span className="text-white">Title:</span>
                        <input
                          type="text"
                          disabled={editingMode !== element._id}
                          value={element.title}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "title",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                        />
                      </div>
                      <div>
                        <span className="text-white">Country:</span>
                        <input
                          type="text"
                          disabled={editingMode !== element._id}
                          value={element.country}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "country",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                        />
                      </div>
                      <div>
                        <span className="text-white">City:</span>
                        <input
                          type="text"
                          disabled={editingMode !== element._id}
                          value={element.city}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "city",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                        />
                      </div>
                      <div>
                        <span className="text-white">Category:</span>
                        <select
                          value={element.category}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "category",
                              e.target.value
                            )
                          }
                          disabled={editingMode !== element._id}
                          className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                        >
                          <option value="Graphics & Design">
                            Graphics & Design
                          </option>
                          <option value="Mobile App Development">
                            Mobile App Development
                          </option>
                          <option value="Frontend Web Development">
                            Frontend Web Development
                          </option>
                          <option value="MERN Stack Development">
                            MERN STACK Development
                          </option>
                          <option value="Account & Finance">
                            Account & Finance
                          </option>
                          <option value="Artificial Intelligence">
                            Artificial Intelligence
                          </option>
                          <option value="Video Animation">
                            Video Animation
                          </option>
                          <option value="MEAN Stack Development">
                            MEAN STACK Development
                          </option>
                          <option value="MEVN Stack Development">
                            MEVN STACK Development
                          </option>
                          <option value="Data Entry Operator">
                            Data Entry Operator
                          </option>
                        </select>
                      </div>
                      <div>
                        <span className="text-white">Salary:</span>
                        {element.fixedSalary ? (
                          <input
                            type="number"
                            disabled={editingMode !== element._id}
                            value={element.fixedSalary}
                            onChange={(e) =>
                              handleInputChange(
                                element._id,
                                "fixedSalary",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                          />
                        ) : (
                          <div className="flex gap-4">
                            <input
                              type="number"
                              disabled={editingMode !== element._id}
                              value={element.salaryFrom}
                              onChange={(e) =>
                                handleInputChange(
                                  element._id,
                                  "salaryFrom",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                            />
                            <input
                              type="number"
                              disabled={editingMode !== element._id}
                              value={element.salaryTo}
                              onChange={(e) =>
                                handleInputChange(
                                  element._id,
                                  "salaryTo",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-white">Expired:</span>
                        <select
                          value={element.expired}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "expired",
                              e.target.value
                            )
                          }
                          disabled={editingMode !== element._id}
                          className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                        >
                          <option value={true}>TRUE</option>
                          <option value={false}>FALSE</option>
                        </select>
                      </div>
                    </div>
                    <div className="long_field grid lg:grid-cols-2 gap-4">
                      <div>
                        <span className="text-white">Description:</span>
                        <textarea
                          rows={5}
                          value={element.description}
                          disabled={editingMode !== element._id}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                        />
                      </div>
                      <div>
                        <span className="text-white">Location:</span>
                        <textarea
                          rows={5}
                          value={element.location}
                          disabled={editingMode !== element._id}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "location",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="button_wrapper flex justify-between items-center mt-4">
                    <div className="edit_btn_wrapper flex gap-2">
                      {editingMode === element._id ? (
                        <>
                          <button
                            onClick={() => handleUpdateJob(element._id)}
                            className="check_btn bg-green-500 text-white p-2 rounded-md"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleDisableEdit()}
                            className="cross_btn bg-red-500 text-white p-2 rounded-md"
                          >
                            <RxCross2 />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEnableEdit(element._id)}
                          className="edit_btn bg-yellow-500 text-white p-2 rounded-md"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteJob(element._id)}
                      className="delete_btn bg-red-500 text-white p-2 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white">
              You've not posted any job or may be you deleted all of your jobs!
            </p>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default MyJobs;
