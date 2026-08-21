import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const MotionCandidateCard = ({ children, index = 0, onClick }) => {
  const shouldReduceMotion = useReducedMotion();

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.4,
        delay: shouldReduceMotion ? 0 : index * 0.05,
        ease: 'easeOut',
      }
    }
  };

  const hoverAnimation = shouldReduceMotion ? {} : {
    y: -4,
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeInOut' }
  };

  const tapAnimation = shouldReduceMotion ? {} : {
    scale: 0.98
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      variants={cardVariants}
      onClick={onClick}
      className="flex flex-col bg-white rounded-xl shadow-md border border-slate-100 hover:shadow-lg dark:bg-slate-900 dark:border-slate-800 cursor-pointer overflow-hidden transition-shadow duration-200"
    >
      {children}
    </motion.div>
  );
};
