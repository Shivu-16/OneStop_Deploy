'use client';

import { motion } from 'framer-motion';
import { TypingText } from '../components';
import arrowDownImg from "../public/arrow-down.svg"
import styles from '../styles';
import { fadeIn, staggerContainer } from '../utils/motion';

const About = () => (
  <section className={`${styles.paddings} relative z-10`}>
    <div className="gradient-02 z-0" />
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}
    >
      <TypingText title="| About OneStop" textStyles="text-center" />

      <motion.p
        variants={fadeIn('up', 'tween', 0.2, 1)}
        className="mt-[8px] font-normal sm:text-[32px] text-[20px] text-center text-[#c7c7c7]"
      >
        <span className="font-extrabold text-white">OneStop</span> is a new
        thing in the future, where you can keep record of your job search and get job updates from your favourite {' '}
        <span className="font-extrabold text-white">
          Dream Companies
        </span>{' '}
        Everyday on a single Website Dashboard.{' '}
        This Website automates your job search by scrapping the jobs from {' '}<span className="font-extrabold text-white">career website</span> {' '}of your choice of companies
        and list them for you to just apply and {' '}
        <span className="font-extrabold text-white">Save your Time</span> from wasting on daily search of career websites.
      </motion.p>

      <motion.img
        variants={fadeIn('up', 'tween', 0.3, 1)}
        src={arrowDownImg}
        alt="arrow down"
        className="w-[18px] h-[28px] object-contain mt-[28px]"
      />
    </motion.div>
  </section>
);

export default About;
