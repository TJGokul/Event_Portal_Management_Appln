import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const PageTransition = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants
  const variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 15 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.3,
        ease: 'easeOut',
      }
    },
    exit: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : -15,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.2,
        ease: 'easeIn',
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      className="flex-1 w-full"
    >
      {children}
    </motion.div>
  );
};
