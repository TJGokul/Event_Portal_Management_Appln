import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export const AnimatedModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  role = 'dialog'
}) => {
  const shouldReduceMotion = useReducedMotion();
  const modalRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Trap focus within the modal for accessibility when open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        // Focus the first element (e.g., cancel button or confirm button)
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: shouldReduceMotion ? 1 : 0.95,
      y: shouldReduceMotion ? 0 : 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: 'spring', 
        duration: shouldReduceMotion ? 0.05 : 0.4, 
        bounce: 0.15 
      }
    },
    exit: { 
      opacity: 0, 
      scale: shouldReduceMotion ? 1 : 0.95, 
      y: shouldReduceMotion ? 0 : 15,
      transition: { duration: shouldReduceMotion ? 0.05 : 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            role={role}
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative z-10 w-full max-w-lg overflow-hidden bg-white border border-slate-100 rounded-2xl shadow-2xl dark:bg-slate-900 dark:border-slate-800 focus:outline-none"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 id="modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="text-slate-400 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded p-1 dark:hover:text-slate-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 text-slate-600 dark:text-slate-350">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
