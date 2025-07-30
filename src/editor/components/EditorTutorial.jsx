'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EditorTutorial = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Show tutorial on first visit
    const hasSeenTutorial = localStorage.getItem('vidverse-editor-tutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const tutorialSteps = [
    {
      title: "Welcome to VidVerse Visual Editor!",
      content: "This powerful editor lets you add and customize elements on your website in real-time.",
      position: "center"
    },
    {
      title: "Add Elements",
      content: "Use the '+ Icon' and '+ Text' buttons to add new elements to your page.",
      position: "right"
    },
    {
      title: "Drag & Drop",
      content: "Click and drag any element to move it around the page. Elements can be positioned anywhere!",
      position: "center"
    },
    {
      title: "Select & Edit",
      content: "Click on any element with a golden border to select and edit its properties in the sidebar.",
      position: "right"
    },
    {
      title: "Save Your Work",
      content: "Don't forget to save your changes! Your work is automatically stored locally in your browser.",
      position: "right"
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setShowTutorial(false);
    localStorage.setItem('vidverse-editor-tutorial', 'seen');
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!showTutorial) return null;

  const currentStepData = tutorialSteps[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9500] flex items-center justify-center"
        data-editor-ui="true"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-gray-900 border border-amber-500/30 rounded-xl p-6 max-w-md mx-4 shadow-2xl ${
            currentStepData.position === 'right' ? 'mr-96' : ''
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">{currentStep + 1}</span>
              </div>
              <span className="text-xs text-gray-400">
                {currentStep + 1} of {tutorialSteps.length}
              </span>
            </div>
            
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-3">
              {currentStepData.title}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="h-2 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                >
                  Previous
                </button>
              )}
              
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Skip Tutorial
              </button>
            </div>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-semibold rounded-lg transition-all"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </motion.div>

        {/* Pointer for right-positioned steps */}
        {currentStepData.position === 'right' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-amber-400"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default EditorTutorial;
