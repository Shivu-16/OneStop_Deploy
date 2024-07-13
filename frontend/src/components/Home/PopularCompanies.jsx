import React from "react";
import { FaMicrosoft, FaApple } from "react-icons/fa";
import { SiTesla } from "react-icons/si";
import { motion } from "framer-motion";

const PopularCompanies = () => {
  const companies = [
    {
      id: 1,
      title: "Microsoft",
      location: "Street 10 Karachi, Pakistan",
      openPositions: 10,
      icon: <FaMicrosoft />,
    },
    {
      id: 2,
      title: "Tesla",
      location: "Street 10 Karachi, Pakistan",
      openPositions: 5,
      icon: <SiTesla />,
    },
    {
      id: 3,
      title: "Apple",
      location: "Street 10 Karachi, Pakistan",
      openPositions: 20,
      icon: <FaApple />,
    },
  ];

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
          TOP COMPANIES
        </motion.h3>
        <div className="flex flex-wrap justify-center gap-8">
          {companies.map((element) => (
            <motion.div
              className="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
              key={element.id}
              variants={cardVariant}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="text-4xl text-blue-500 mb-4">{element.icon}</div>
              <div className="text">
                <p className="font-bold text-xl text-black mb-2">{element.title}</p>
                <p className="text-gray-600">{element.location}</p>
              </div>
              <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Open Positions {element.openPositions}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCompanies;
