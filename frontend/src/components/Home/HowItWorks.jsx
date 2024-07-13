import React from "react";
import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, delay: 0.3 } },
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-6 sm:px-16">
        <motion.h3
          className="text-3xl font-extrabold line-clamp-1 text-white text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        >
          How JobZee Works
        </motion.h3>
        <div className="flex flex-wrap justify-center gap-8">
          <motion.div
            className="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
            variants={cardVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <FaUserPlus className="text-4xl text-blue-500 mb-4" />
            <p className="font-bold text-xl text-black mb-2">Create Account</p>
            <p className="text-gray-600">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, culpa.
            </p>
          </motion.div>
          <motion.div
            className="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
            variants={cardVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <MdFindInPage className="text-4xl text-blue-500 mb-4" />
            <p className="font-bold text-xl text-black mb-2">Find a Job/Post a Job</p>
            <p className="text-gray-600">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, culpa.
            </p>
          </motion.div>
          <motion.div
            className="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
            variants={cardVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <IoMdSend className="text-4xl text-blue-500 mb-4" />
            <p className="font-bold text-xl text-black mb-2">Apply For Job/Recruit Suitable Candidates</p>
            <p className="text-gray-600">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, culpa.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
