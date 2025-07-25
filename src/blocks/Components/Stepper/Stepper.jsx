/*
	Custom Subtle Stepper for VidVerse - AMOLED Black Theme
*/

import React, { useState, Children, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => { },
  onFinalStepCompleted = () => { },
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  disableStepIndicators = false,
  renderStepIndicator,
  validateCurrentStep = () => true,
  isCurrentStepValid = false,
  ...rest
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) onFinalStepCompleted();
    else onStepChange(newStep);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep && isCurrentStepValid) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    if (isCurrentStepValid) {
      setDirection(1);
      updateStep(totalSteps + 1);
    }
  };

  return (
    <div className={`w-full ${stepContainerClassName}`} {...rest}>
      <div className={`w-full overflow-hidden ${stepCircleContainerClassName}`}>
        {!disableStepIndicators && (
          <div className="px-3 py-2 border-b border-amber-400/10">
            <div className="flex items-center justify-center relative">
              {/* Ultra-compact stepper indicators */}
              <div className="flex items-center space-x-0.5 overflow-x-auto max-w-full px-1 scrollbar-hide">
                <div className="flex items-center space-x-0.5 min-w-max">
                  {Array.from({ length: totalSteps }, (_, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;
                    const canNavigate = stepNumber <= currentStep;
                    
                    return (
                      <React.Fragment key={stepNumber}>
                        <StepIndicator
                          stepNumber={stepNumber}
                          isActive={isActive}
                          isCompleted={isCompleted}
                          onClick={() => canNavigate ? updateStep(stepNumber) : null}
                        />
                        {stepNumber < totalSteps && (
                          <StepConnector
                            isCompleted={stepNumber < currentStep}
                            isActive={stepNumber === currentStep}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
              
              {/* Minimal progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900">
                <motion.div 
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-500"
                  initial={{ width: '10%' }}
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        )}
        
        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`${contentClassName}`}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>
        
        {!isCompleted && (
          <div className={`${footerClassName}`}>
            <div className={`flex ${currentStep !== 1 ? "justify-between" : "justify-end"} items-center px-3 py-2`}>
              {currentStep !== 1 && (
                <button
                  onClick={handleBack}
                  className={`transition-all duration-300 ${
                    currentStep === 1
                      ? "pointer-events-none opacity-50 text-neutral-400"
                      : "text-neutral-400 hover:text-amber-400"
                  }`}
                  {...backButtonProps}
                >
                  {backButtonText}
                </button>
              )}
              <button
                onClick={isLastStep ? handleComplete : handleNext}
                disabled={!isCurrentStepValid}
                className={`transition-all duration-300 ${!isCurrentStepValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                {...nextButtonProps}
              >
                {isLastStep ? "Schedule Call" : nextButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepContentWrapper({ isCompleted, currentStep, direction, children, className }) {
  const [parentHeight, setParentHeight] = useState(0);

  return (
    <motion.div
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(h) => setParentHeight(h)}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({ children, direction, onHeightReady }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (containerRef.current) onHeightReady(containerRef.current.offsetHeight);
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants = {
  enter: (dir) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir >= 0 ? "50%" : "-50%",
    opacity: 0,
  }),
};

export function Step({ children }) {
  return <div className="px-4 py-2">{children}</div>;
}

function StepIndicator({ stepNumber, isActive, isCompleted, onClick }) {
  const status = isActive ? "active" : isCompleted ? "complete" : "inactive";

  return (
    <motion.div
      onClick={onClick}
      className="relative cursor-pointer outline-none focus:outline-none"
      animate={status}
      initial={false}
      whileHover={!isActive ? { scale: 1.1 } : {}}
    >
      <motion.div
        variants={{
          inactive: { 
            scale: 1, 
            backgroundColor: "#0a0a0a", 
            color: "#404040",
            borderColor: "#262626"
          },
          active: { 
            scale: 1.1, 
            backgroundColor: "#F59E0B", 
            color: "#000000",
            borderColor: "#F59E0B",
            boxShadow: "0 0 20px rgba(245, 158, 11, 0.5)"
          },
          complete: { 
            scale: 1, 
            backgroundColor: "#10B981", 
            color: "#000000",
            borderColor: "#10B981"
          },
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="flex h-6 w-6 items-center justify-center rounded-full font-medium border text-xs"
      >
        {status === "complete" ? (
          <CheckIcon className="h-3 w-3 text-black" />
        ) : (
          <span className="font-bold text-xs">{stepNumber}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ isCompleted, isActive }) {
  return (
    <div className="relative mx-1 h-0.5 w-4 overflow-hidden rounded bg-neutral-900">
      <motion.div
        className="absolute left-0 top-0 h-full rounded bg-gradient-to-r from-amber-400 to-yellow-500"
        initial={{ width: 0 }}
        animate={{ width: isCompleted ? "100%" : "0%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: "tween", ease: "easeOut", duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
