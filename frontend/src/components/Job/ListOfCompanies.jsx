import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { motion } from "framer-motion";
import { footerVariants } from "../utils/motion";
import StarsCanvas from "../utils/Stars";
import EarthCanvas from "../utils/Earth";
//isme aise add krna hai ki agar user logged in hai to uski list of companies mein check karo ki ek specific company hai agar hai to uss company card ko  or cards se alag banna do
//agar view details button pr click krenge to saare card niche jaate hue dissolve ho jaayenge or 1 specific card aayega jispe company ki details hongi or or uss company mein available jobs hongi

const ListOfCompanies = () => {
  const [listOfCompanies, setListOfCompanies] = useState([]);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      axios
        .get("http://localhost:4000/api/v1/job/companyList", {
          withCredentials: true,
        })
        .then((res) => {
          setListOfCompanies(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (!isAuthorized) {
    navigateTo("/");
  }

  const cardVariants = {
    hidden: { opacity: 0, y: "50vh" },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
        duration: 2
      }
    }
  };

  return (
    <section className="jobs page py-8 min-h-screen">
      <div className="absolute inset-0 z-0">
        <StarsCanvas />
        {/* <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <EarthCanvas />
        </div> */}
      </div>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-white shine">
          List of Companies on OneStop
        </h1>
        <div className="flex flex-col items-center space-y-8">
          {listOfCompanies.companies &&
            listOfCompanies.companies.map((element) => {
              return (
                <motion.div
                  key={element._id}
                  className="card bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-lg shadow-2xl hover:shadow-3xl transform transition-transform duration-300 hover:scale-105 flex justify-between items-center w-[80vw]"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-2 text-white">
                      {element.nameOfTheCompany}
                    </h2>
                    <Link
                      to={`/job/${element._id}`}
                      className="text-indigo-200 hover:text-indigo-300 font-semibold"
                    >
                      View Details
                    </Link>
                  </div>
                  <div className="flex-shrink-0 text-right text-white">
                    <p className="text-gray-200 mb-2">{element.category}</p>
                    <p className="text-gray-300">
                      Posted on: {new Date(element.jobPostedOn).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default ListOfCompanies;
