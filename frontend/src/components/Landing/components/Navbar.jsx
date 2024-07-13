"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "../styles";
import { navVariants } from "../utils/motion";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      whileInView="show"
      className={`sm:px-16 px-6 py-8 relative`}
    >
      <div className="absolute w-[50%] inset-0 gradient-01" />
      <div className="2xl:max-w-[1280px] w-full mx-auto flex justify-between items-center gap-8">
        <div className="flex items-center">
          <img
            src="src/components/Landing/public/logo.png"
            alt="logo"
            className="w-[24px] h-[24px] object-contain"
          />
          <h2 className="font-extrabold text-[24px] leading-[30.24px] text-white ml-4">
            ONESTOP
          </h2>
        </div>
        <div className="md:flex items-center gap-8">
          <a
            href="/login"
            className="font-extrabold text-[24px] leading-[30.24px] text-white ml-4"
          >
            LOGIN
          </a>
          <a
            href="/register"
            className="font-extrabold text-[24px] leading-[30.24px] text-white ml-4"
          >
            REGISTER
          </a>
        </div>
        <div className="md:hidden">
          <img
            src="src/components/Landing/public/menu.svg"
            alt="menu"
            className="w-[24px] h-[24px] object-contain cursor-pointer"
            onClick={toggleMenu}
          />
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden absolute top-16 right-6 bg-white p-4 rounded-lg shadow-lg z-10">
          <a href="/login" className="block text-black mb-2">
            Login
          </a>
          <a href="/register" className="block text-black">
            Register
          </a>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
