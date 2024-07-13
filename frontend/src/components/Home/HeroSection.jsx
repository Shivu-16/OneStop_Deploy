import React from "react";
import { FaBuilding, FaSuitcase, FaUsers, FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { slideIn, staggerContainer, textVariant } from "../utils/motion";

const HeroSection = () => {
  const details = [
    {
      id: 1,
      title: "1,23,441",
      subTitle: "Live Job",
      icon: <FaSuitcase />,
    },
    {
      id: 2,
      title: "91220",
      subTitle: "Companies",
      icon: <FaBuilding />,
    },
    {
      id: 3,
      title: "2,34,200",
      subTitle: "Job Seekers",
      icon: <FaUsers />,
    },
    {
      id: 4,
      title: "1,03,761",
      subTitle: "Employers",
      icon: <FaUserPlus />,
    },
  ];

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 py-20"
    >
      <div className="container mx-auto flex flex-col items-center text-center">
        <motion.div variants={textVariant(1.1)} className="mb-12">
          <h1 className="font-extrabold text-4xl sm:text-5xl text-white mb-4">
            Find a job that suits your interests and skills
          </h1>
          <p className="text-lg text-gray-300">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
            voluptate repellat modi quidem aliquid eaque ducimus ipsa et,
            facere mollitia!
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {details.map((element) => (
            <motion.div
              key={element.id}
              className="bg-white text-black rounded-lg shadow-md p-6 text-center"
              whileHover={{ scale: 1.05 }}
              variants={slideIn("right", "tween", 0.2, 1)}
            >
              <div className="text-3xl mb-2">{element.icon}</div>
              <div className="font-bold text-xl mb-1">{element.title}</div>
              <div className="text-gray-500 text-sm">{element.subTitle}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="absolute top-0 left-0 w-[50vw] h-full bg-gradient-to-r from-transparent to-gray-900 rounded-tl-[140px] z-0"
      />
      <img
        src="/heroS.png"
        alt="hero"
        className="absolute top-0 left-0 w-full h-[500px] sm:h-[700px] object-cover rounded-tl-[140px] z-10"
      />
    </motion.section>
  );
};

export default HeroSection;
