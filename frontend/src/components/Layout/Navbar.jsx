import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [showEmployerOptions, setShowEmployerOptions] = useState(false);

  const toggleNavbar = () => {
    setShow(!show);
  };

  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const navVariants = {
    hidden: {
      opacity: 0,
      y: -50,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 140,
      },
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        delay: 0.5,
      },
    },
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthorized(true);
    }
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      whileInView="show"
      className="sm:px-16 px-6 py-8 relative"
    >
      <div className="absolute w-[90%] inset-0 gradient-01" />
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 border-b-2 border-gray-300">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* <img
                src="/JobZee-logos__white.png"
                alt="logo"
                className="w-[24px] h-[24px] object-contain"
              /> */}
              <h2 className="font-extrabold text-[32px] text-white ml-4">
                ONESTOP
              </h2>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="ml-4 flex items-center space-x-4">
              {isAuthorized ? (
                <>
                  <Link
                    to={"/"}
                    onClick={() => setShow(false)}
                    className="text-white font-extrabold relative hover:bg-white hover:text-black rounded-lg p-2"
                  >
                    <span className="relative z-10">HOME</span>
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
                  </Link>

                  <Link
                    to={"/job/companyList"}
                    className="text-white font-extrabold relative hover:bg-white hover:text-black rounded-lg p-2"
                  >
                    <span className="relative z-10">LIST OF COMPANIES</span>
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
                  </Link>
                  <Link
                    to={"/job/getall"}
                    className="text-white font-extrabold relative hover:bg-white hover:text-black rounded-lg p-2"
                  >
                    <span className="relative z-10">RECOMMENDS</span>
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
                  </Link>
                  <Link
                    to={"/job/myMatchedjobs"}
                    className="text-white font-extrabold relative hover:bg-white hover:text-black rounded-lg p-2"
                  >
                    <span className="relative z-10">MY JOBS</span>
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
                  </Link>
                  <Link
                    to={"/user/getuser"}
                    className="text-white font-extrabold relative hover:bg-white hover:text-black rounded-lg p-2"
                  >
                    <span className="relative z-10">MY PROFILE</span>
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
                  </Link>

                  {user && user.role === "JOB SEEKER" && (
                    <Link
                      to={"/applications/me"}
                      onClick={() => setShow(false)}
                      className="text-white font-extrabold relative hover:bg-white hover:text-black rounded-lg p-2"
                    >
                      <span className="relative z-10">
                        {user && user.role === "Employer"
                          ? ""
                          : "My Applications"}
                      </span>
                      <div className="absolute font-extrabold inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
                    </Link>
                  )}

                  {user && user.role === "Employer" && (
                    <button
                      onClick={() =>
                        setShowEmployerOptions(!showEmployerOptions)
                      }
                      className="text-white font-extrabold relative hover:bg-white hover:text-black rounded-lg p-2"
                    >
                      <span className="relative z-10">EMPLOYER'S OPTION</span>
                      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg" />
                    </button>
                  )}

                  <Link
                    onClick={handleLogout}
                    className="text-black font-extrabold relative hover:bg-black hover:text-white rounded-lg p-2"
                  >
                    <span className="relative z-10">LOGOUT</span>
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={"/login"}
                    className="text-white font-extrabold relative hover:bg-white hover:text-black rounded-lg p-2"
                  >
                    <span className="relative z-10">LOGIN</span>
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
                  </Link>
                  <Link
                    to={"/register"}
                    className="text-white font-extrabold relative hover:bg-white hover:text-black rounded-lg p-2"
                  >
                    <span className="relative z-10">REGISTER</span>
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="md:hidden flex item center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-white font-extrabold hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setShow(!show)}
            >
              {show ? (
                <IoClose className="h-6 w-6" />
              ) : (
                <GiHamburgerMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        {showEmployerOptions && isAuthorized && user.role === "Employer" && (
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to={"/job/post"}
              onClick={() => setShow(false)}
              className="text-white font-extrabold block relative hover:bg-white hover:text-black rounded-lg p-2"
            >
              <span className="relative z-10">POST NEW JOB</span>
              <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
            </Link>
            <Link
              to={"/job/jobDataScrapper"}
              onClick={() => setShow(false)}
              className="text-white font-extrabold block relative hover:bg-white hover:text-black rounded-lg p-2"
            >
              <span className="relative z-10">CREATE NEW JOB</span>
              <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
            </Link>
            <Link
              to={"/job/me"}
              onClick={() => setShow(false)}
              className="text-white font-extrabold block relative hover:bg-white hover:text-black rounded-lg p-2"
            >
              <span className="relative z-10">YOUR RECOMMENDED JOBS</span>
              <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
            </Link>
            <Link
              to={"/applications/me"}
              onClick={() => setShow(false)}
              className="text-white font-extrabold block relative hover:bg-white hover:text-black rounded-lg p-2"
            >
              <span className="relative z-10">
                {user && user.role === "Employer"
                  ? "APPLICANT'S APPLICATION"
                  : ""}
              </span>
              <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
            </Link>
          </div>
        )}
        {show && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {isAuthorized ? (
                <>
                  <Link
                    to={"/"}
                    onClick={() => setShow(false)}
                    className="text-white font-extrabold block relative hover:bg-white hover:text-black rounded-lg p-2"
                  >
                    <span className="relative z-10">HOME</span>
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
                  </Link>
                  <Link
                    to={"/job/getall"}
                    className="text-white font-extrabold block relative hover:bg-white hover:text-black rounded-lg p-2"
                  >
                    <span className="relative z-10">ALL JOBS</span>
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
                  </Link>
                  <Link
                    to={"/applications/me"}
                    onClick={() => setShow(false)}
                    className="text-white font-extrabold block relative hover:bg-white hover:text-black rounded-lg p-2"
                  >
                    <span className="relative z-10">
                      {user && user.role === "Employer"
                        ? "APPLICANT'S APPLICATIONS"
                        : "MY APPLICATIONS"}
                    </span>
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
                  </Link>
                  {user && user.role === "Employer" && (
                    <>
                      <Link
                        to={"/job/post"}
                        onClick={() => setShow(false)}
                        className="text-white font-extrabold block relative hover:bg-white hover:text-black rounded-lg p-2"
                      >
                        <span className="relative z-10">POST NEW JOB</span>
                        <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
                      </Link>
                      <Link
                        to={"/job/jobDataScrapper"}
                        onClick={() => setShow(false)}
                        className="text-white font-extrabold block relative hover:bg-white hover:text-black rounded-lg p-2"
                      >
                        <span className="relative z-10">CREATE NEW JOB</span>
                        <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
                      </Link>
                      <Link
                        to={"/job/me"}
                        onClick={() => setShow(false)}
                        className="text-white font-extrabold block relative hover:bg-white hover:text-black rounded-lg p-2"
                      >
                        <span className="relative z-10">VIEW YOUR JOBS</span>
                        <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
                      </Link>
                    </>
                  )}
                  <Link
                    onClick={handleLogout}
                    className="text-black font-extrabold block relative hover:bg-black hover:text-white rounded-lg p-2"
                  >
                    <span className="relative z-10">LOGOUT</span>
                    <div className="absolute inset-0 bg-black opacity-0 hover:opacity-100 rounded-lg"></div>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={"/login"}
                    onClick={() => setShow(false)}
                    className="text-white font-extrabold block relative hover:bg-white hover:text-black rounded-lg p-2"
                  >
                    <span className="relative z-10">LOGIN</span>
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
                  </Link>
                  <Link
                    to={"/register"}
                    onClick={() => setShow(false)}
                    className="text-white font-extrabold block relative hover:bg-white hover:text-black rounded-lg p-2"
                  >
                    <span className="relative z-10">REGISTER</span>
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 rounded-lg"></div>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
