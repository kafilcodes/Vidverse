'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/firebase/config';
import { ref, set, push, get } from 'firebase/database';
import PhoneInput from 'react-phone-number-input';
import DatePicker from 'react-datepicker';
import { Toaster, toast } from 'react-hot-toast';
import 'react-phone-number-input/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import '../app/datepicker-custom.css';

const BookingForm = () => {
  const [animationData, setAnimationData] = useState(null);
  const [step, setStep] = useState(1);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [existingData, setExistingData] = useState(null);
  const [showValidationError, setShowValidationError] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    socialLink: '',
    sellsOnline: '',
    monthlyRevenue: '',
    bottlenecks: [],
    customBottleneck: '',
    agreement: false,
    canInvest: '',
    meetingTime: null,
  });

  useEffect(() => {
    fetch('/lottie/success.json')
      .then((response) => response.json())
      .then((data) => setAnimationData(data));
  }, []);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('bookingFormData');
      const savedStep = localStorage.getItem('bookingFormStep');
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.meetingTime) {
          parsedData.meetingTime = new Date(parsedData.meetingTime);
        }
        setFormData(parsedData);
      }
      
      if (savedStep && parseInt(savedStep, 10) <= 10) {
        setStep(parseInt(savedStep, 10));
      }
    } catch (error) {
      console.error("Failed to load form data from localStorage", error);
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('bookingFormData', JSON.stringify(formData));
      localStorage.setItem('bookingFormStep', step.toString());
    } catch (error) {
      console.error("Failed to save form data to localStorage", error);
    }
  }, [formData, step]);

  // Reset validation error when step changes
  useEffect(() => {
    setShowValidationError(false);
  }, [step]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'bottlenecks') {
      const newBottlenecks = checked
        ? [...formData.bottlenecks, value]
        : formData.bottlenecks.filter((b) => b !== value);
      setFormData({ ...formData, bottlenecks: newBottlenecks });
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
    
    // Reset validation error when user starts filling/changing fields
    if (showValidationError) {
      setShowValidationError(false);
    }
  };// Validation function for each step
  const isStepValid = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.description.trim() !== '';
      case 2:
        return formData.firstName.trim() !== '' && formData.lastName.trim() !== '';
      case 3:
        return formData.email.trim() !== '' && formData.phone && formData.phone.trim() !== '';
      case 4:
        return formData.socialLink.trim() !== '';
      case 5:
        return formData.sellsOnline.trim() !== '';
      case 6:
        return formData.monthlyRevenue.trim() !== '';
      case 7:
        return formData.bottlenecks.length > 0 || formData.customBottleneck.trim() !== '';
      case 8:
        return formData.agreement === true;
      case 9:
        return formData.canInvest.trim() !== '';
      case 10:
        return formData.meetingTime !== null;
      default:
        return true;
    }
  };

  // Get validation message for current step
  const getValidationMessage = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.description.trim() === '' ? 'Please select an option that best describes you' : '';
      case 2:
        if (formData.firstName.trim() === '' && formData.lastName.trim() === '') {
          return 'Please enter both your first and last name';
        } else if (formData.firstName.trim() === '') {
          return 'Please enter your first name';
        } else if (formData.lastName.trim() === '') {
          return 'Please enter your last name';
        }
        return '';
      case 3:
        if (formData.email.trim() === '' && (!formData.phone || formData.phone.trim() === '')) {
          return 'Please enter both your email and phone number';
        } else if (formData.email.trim() === '') {
          return 'Please enter your email address';
        } else if (!formData.phone || formData.phone.trim() === '') {
          return 'Please enter your phone number';
        }
        return '';
      case 4:
        return formData.socialLink.trim() === '' ? 'Please enter your website or social media link' : '';
      case 5:
        return formData.sellsOnline.trim() === '' ? 'Please select an option about your online business' : '';
      case 6:
        return formData.monthlyRevenue.trim() === '' ? 'Please select your current monthly revenue range' : '';
      case 7:
        return (formData.bottlenecks.length === 0 && formData.customBottleneck.trim() === '') ? 'Please select at least one bottleneck or describe your challenges' : '';
      case 8:
        return !formData.agreement ? 'Please confirm your understanding and agreement to proceed' : '';
      case 9:
        return formData.canInvest.trim() === '' ? 'Please select your investment readiness level' : '';
      case 10:
        return !formData.meetingTime ? 'Please select your preferred meeting date and time' : '';
      default:
        return '';
    }
  };
  const nextStep = () => {
    if (step < 10) {
      if (isStepValid(step)) {
        setStep(step + 1);
        setShowValidationError(false); // Reset validation error on successful progression
      } else {
        setShowValidationError(true); // Show validation error only when user tries to proceed
      }
    }
  };
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setShowValidationError(false); // Reset validation error when going back
    }
  };  const handleSubmit = async () => {
    if (!isStepValid(10)) {
      setShowValidationError(true);
      return;
    }
    
    // Check if Firebase is available
    if (!db) {
      toast.error('Booking service is temporarily unavailable. Please try again later.');
      return;
    }
    
    try {
      const emailKey = formData.email.replace(/[^a-zA-Z0-9]/g, '');
      
      // Check if this email already exists
      const existingRef = ref(db, `discoverycalls/${emailKey}`);
      const snapshot = await get(existingRef);
      
      if (snapshot.exists()) {
        setExistingData(snapshot.val());
        setShowDuplicateDialog(true);
        return;
      }
      
      // If no duplicate, proceed with submission
      await submitForm();
    } catch (error) {
      console.error('❌ Error checking for duplicates:', error);
      toast.error('There was an error submitting your form. Please try again.');
    }
  };

  const submitForm = async (forceUpdate = false) => {
    // Check if Firebase is available
    if (!db) {
      console.error('❌ Firebase database not available');
      toast.error('Booking service is temporarily unavailable. Please try again later.');
      return;
    }
    
    try {
      const emailKey = formData.email.replace(/[^a-zA-Z0-9]/g, '');
      
      const submissionData = {
        ...formData,
        submittedAt: new Date().toISOString(),
        meetingTime: formData.meetingTime ? formData.meetingTime.toISOString() : null,
        ...(forceUpdate && { updatedAt: new Date().toISOString() }),
      };

      await set(ref(db, `discoverycalls/${emailKey}`), submissionData);
      
      toast.success(forceUpdate ? 'Information updated successfully!' : 'Form submitted successfully!');
      localStorage.removeItem('bookingFormData');
      localStorage.removeItem('bookingFormStep');
      setShowDuplicateDialog(false);
      setStep(11);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('There was an error submitting your form. Please try again.');
    }
  };

  const handleDuplicateChoice = (shouldUpdate) => {
    if (shouldUpdate) {
      submitForm(true);
    } else {
      setShowDuplicateDialog(false);
      toast.info('Your previous registration remains unchanged.');
      setStep(11);
    }
  };

  const renderStep = () => {
    switch (step) {      case 1:
        return (
          <div className="space-y-6">            <h2 className="text-3xl font-bold text-center mb-8 text-white font-grift">What best describes you?</h2>
            <div className="space-y-4">
              {[
                "I'm a business owner looking to grow online",
                "I run an agency and need better tools",
                "I'm exploring content marketing options",
                "I represent a larger organization"
              ].map((option) => (
                <label key={option} className="flex items-center space-x-4 p-4 border border-neutral-700/60 hover:border-amber-400/60 rounded-xl cursor-pointer hover:bg-neutral-800/40 transition-all duration-300 group bg-gradient-to-r from-neutral-900/40 to-neutral-800/20 backdrop-blur-sm">
                  <input
                    type="radio"
                    name="description"
                    value={option}
                    checked={formData.description === option}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="w-5 h-5 border-2 border-neutral-600 group-hover:border-amber-400 rounded-full flex items-center justify-center transition-all duration-300">
                    {formData.description === option && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2.5 h-2.5 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50"
                      />
                    )}
                  </div>
                  <span className="text-white group-hover:text-amber-400 font-medium transition-colors duration-300 font-grift">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-8 text-white font-grift">What's your name?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3 font-grift">
                  First Name *
                </label>
                <div className="flex items-center space-x-4 p-4 border border-neutral-700/60 hover:border-amber-400/60 rounded-xl cursor-pointer hover:bg-neutral-800/40 transition-all duration-300 group bg-gradient-to-r from-neutral-900/40 to-neutral-800/20 backdrop-blur-sm">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-transparent border-none outline-none text-white placeholder-neutral-500 font-grift flex-1"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3 font-grift">
                  Last Name *
                </label>
                <div className="flex items-center space-x-4 p-4 border border-neutral-700/60 hover:border-amber-400/60 rounded-xl cursor-pointer hover:bg-neutral-800/40 transition-all duration-300 group bg-gradient-to-r from-neutral-900/40 to-neutral-800/20 backdrop-blur-sm">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-transparent border-none outline-none text-white placeholder-neutral-500 font-grift flex-1"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );case 3:
        return (
          <div className="space-y-6">            <h2 className="text-3xl font-bold text-center mb-8 text-white font-grift">Contact Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3 font-grift">
                  Email Address *
                </label>
                <div className="flex items-center space-x-4 p-4 border border-neutral-700/60 hover:border-amber-400/60 rounded-xl cursor-pointer hover:bg-neutral-800/40 transition-all duration-300 group bg-gradient-to-r from-neutral-900/40 to-neutral-800/20 backdrop-blur-sm">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-transparent border-none outline-none text-white placeholder-neutral-500 font-grift flex-1"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3 font-grift">
                  Phone Number *
                </label>
                <div className="flex items-center space-x-4 p-4 border border-neutral-700/60 hover:border-amber-400/60 rounded-xl cursor-pointer hover:bg-neutral-800/40 transition-all duration-300 group bg-gradient-to-r from-neutral-900/40 to-neutral-800/20 backdrop-blur-sm">
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="US"
                    value={formData.phone}
                    onChange={(phone) => {
                      setFormData({ ...formData, phone });
                      if (showValidationError) {
                        setShowValidationError(false);
                      }
                    }}
                    className="phone-input-clean"
                  />
                </div>
              </div>
            </div>
          </div>
        );      case 4:
        return (
          <div className="space-y-6">            <h2 className="text-3xl font-bold text-center mb-8 text-white font-grift">Share your social presence</h2>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3 font-grift">
                Website or Social Media Link *
              </label>
              <div className="flex items-center space-x-4 p-4 border border-neutral-700/60 hover:border-amber-400/60 rounded-xl cursor-pointer hover:bg-neutral-800/40 transition-all duration-300 group bg-gradient-to-r from-neutral-900/40 to-neutral-800/20 backdrop-blur-sm">
                <input
                  type="url"
                  name="socialLink"
                  value={formData.socialLink}
                  onChange={handleChange}
                  className="bg-transparent border-none outline-none text-white placeholder-neutral-500 font-grift flex-1"
                  placeholder="https://your-website.com or https://instagram.com/yourusername"
                  required
                />
              </div>
              <p className="text-sm text-neutral-400 mt-3 font-grift">
                Share your website, Instagram, LinkedIn, or any other social media profile
              </p>
            </div>
          </div>
        );case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-8 text-white font-grift">Do you currently sell products or services online?</h2>
            <div className="space-y-4">
              {[
                "Yes, I have an established online business",
                "Yes, but I'm just getting started",
                "No, but I'm planning to start soon",
                "No, I'm still exploring options"
              ].map((option) => (
                <label key={option} className="flex items-center space-x-4 p-4 border border-neutral-700/60 hover:border-amber-400/60 rounded-xl cursor-pointer hover:bg-neutral-800/40 transition-all duration-300 group bg-gradient-to-r from-neutral-900/40 to-neutral-800/20 backdrop-blur-sm">
                  <input
                    type="radio"
                    name="sellsOnline"
                    value={option}
                    checked={formData.sellsOnline === option}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="w-5 h-5 border-2 border-neutral-600 group-hover:border-amber-400 rounded-full flex items-center justify-center transition-all duration-300">
                    {formData.sellsOnline === option && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2.5 h-2.5 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50"
                      />
                    )}
                  </div>                  <span className="text-white group-hover:text-amber-400 font-medium transition-colors duration-300 font-grift">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-8 text-white font-grift">What's your current monthly revenue?</h2>
            <div className="space-y-4">
              {[
                "Just starting out ($0)",
                "$1 - $1,000",
                "$1,000 - $5,000",
                "$5,000 - $10,000",
                "$10,000 - $25,000",
                "$25,000 - $50,000",
                "$50,000+"
              ].map((option) => (
                <label key={option} className="flex items-center space-x-4 p-4 border border-neutral-700/60 hover:border-amber-400/60 rounded-xl cursor-pointer hover:bg-neutral-800/40 transition-all duration-300 group bg-gradient-to-r from-neutral-900/40 to-neutral-800/20 backdrop-blur-sm">
                  <input
                    type="radio"
                    name="monthlyRevenue"
                    value={option}
                    checked={formData.monthlyRevenue === option}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="w-5 h-5 border-2 border-neutral-600 group-hover:border-amber-400 rounded-full flex items-center justify-center transition-all duration-300">
                    {formData.monthlyRevenue === option && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2.5 h-2.5 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50"
                      />
                    )}
                  </div>                  <span className="text-white group-hover:text-amber-400 font-medium transition-colors duration-300 font-grift">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );      case 7:
        return (
          <div className="space-y-6">            <h2 className="text-3xl font-bold text-center mb-8 text-white font-grift">What are your biggest bottlenecks right now?</h2>
            <div className="space-y-4">              {[
                "Generating consistent leads",
                "Converting leads to customers",
                "Creating engaging content",
                "Managing social media presence",
                "Email marketing and automation",
                "Understanding my target audience",
                "Scaling my business operations",
                "Time management and productivity"
              ].map((option) => (
                <label key={option} className="flex items-center space-x-4 p-4 border border-neutral-700/60 hover:border-amber-400/60 rounded-xl cursor-pointer hover:bg-neutral-800/40 transition-all duration-300 group bg-gradient-to-r from-neutral-900/40 to-neutral-800/20 backdrop-blur-sm">
                  <input
                    type="checkbox"
                    name="bottlenecks"
                    value={option}
                    checked={formData.bottlenecks.includes(option)}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="w-5 h-5 border-2 border-neutral-600 group-hover:border-amber-400 rounded flex items-center justify-center transition-all duration-300">
                    {formData.bottlenecks.includes(option) && (
                      <motion.div
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                        className="text-amber-400"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                  <span className="text-white group-hover:text-amber-400 font-medium transition-colors duration-300 font-grift">{option}</span>
                </label>
              ))}
            </div>            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3 font-grift">
                Other (please specify)
              </label>
              <div className="flex items-start space-x-4 p-4 border border-neutral-700/60 hover:border-amber-400/60 rounded-xl cursor-pointer hover:bg-neutral-800/40 transition-all duration-300 group bg-gradient-to-r from-neutral-900/40 to-neutral-800/20 backdrop-blur-sm">
                <textarea
                  name="customBottleneck"
                  value={formData.customBottleneck}
                  onChange={handleChange}
                  className="bg-transparent border-none outline-none text-white placeholder-neutral-500 font-grift flex-1 resize-none"
                  rows={3}
                  placeholder="Describe any other challenges you're facing..."
                />
              </div>
            </div>
          </div>
        );      case 8:
        return (
          <div className="space-y-6">            <h2 className="text-3xl font-bold text-center mb-8 text-white font-grift">Important Notice</h2>
            <div className="bg-gradient-to-r from-amber-400/20 to-yellow-500/20 border border-amber-400/40 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-amber-400/30 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3 font-grift">
                    Qualification Required
                  </h3>
                  <p className="text-neutral-300 mb-4 leading-relaxed font-grift">
                    Our Discovery Call is designed for serious business owners and entrepreneurs who are committed to growing their online presence. 
                    This consultation is valued at $500 and is provided completely free to qualified applicants.
                  </p>
                  <p className="text-neutral-300 leading-relaxed font-grift">
                    By proceeding, you confirm that you are genuinely interested in exploring how our content marketing and online growth strategies can help scale your business.
                  </p>
                </div>
              </div>
            </div>            <label className="flex items-center space-x-4 p-4 border border-neutral-700/60 hover:border-amber-400/60 rounded-xl cursor-pointer hover:bg-neutral-800/40 transition-all duration-300 group bg-gradient-to-r from-neutral-900/40 to-neutral-800/20 backdrop-blur-sm">
              <input
                type="checkbox"
                name="agreement"
                checked={formData.agreement}
                onChange={handleChange}
                className="hidden"
                required
              />
              <div className="w-5 h-5 border-2 border-neutral-600 group-hover:border-amber-400 rounded flex items-center justify-center transition-all duration-300">
                {formData.agreement && (
                  <motion.div
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                    className="text-amber-400"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </div>
              <span className="text-white group-hover:text-amber-400 font-medium transition-colors duration-300 font-grift">
                I understand this is a professional consultation for serious business owners, and I confirm my genuine interest in learning about growth strategies for my business.
              </span>
            </label>
          </div>
        );      case 9:
        return (
          <div className="space-y-6">            <h2 className="text-3xl font-bold text-center mb-8 text-white font-grift">Investment Readiness</h2>
            <div className="bg-gradient-to-r from-neutral-900/80 to-neutral-800/60 border border-amber-400/30 rounded-xl p-6 mb-6 backdrop-blur-sm">
              <p className="text-neutral-300 leading-relaxed font-grift">
                To ensure this call is valuable for both of us, we want to understand your readiness to invest in growing your business.
              </p>
            </div>
            <h3 className="text-xl font-semibold mb-6 text-white font-grift">
              If our strategies align with your goals, would you be prepared to invest in your business growth?
            </h3>
            <div className="space-y-4">
              {[
                "Yes, I'm ready to invest $1,000 - $5,000 to grow my business",
                "Yes, I'm ready to invest $5,000 - $15,000 for significant growth",
                "Yes, I'm ready to invest $15,000+ for comprehensive business transformation",
                "I'm interested but need to understand the value first",
                "I'm primarily looking for free advice and resources"
              ].map((option) => (
                <label key={option} className="flex items-center space-x-4 p-4 border border-neutral-700/60 hover:border-amber-400/60 rounded-xl cursor-pointer hover:bg-neutral-800/40 transition-all duration-300 group bg-gradient-to-r from-neutral-900/40 to-neutral-800/20 backdrop-blur-sm">
                  <input
                    type="radio"
                    name="canInvest"
                    value={option}
                    checked={formData.canInvest === option}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="w-5 h-5 border-2 border-neutral-600 group-hover:border-amber-400 rounded-full flex items-center justify-center transition-all duration-300">
                    {formData.canInvest === option && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2.5 h-2.5 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50"
                      />
                    )}
                  </div>
                  <span className="text-white group-hover:text-amber-400 font-medium transition-colors duration-300">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );      case 10:
        return (
          <div className="space-y-6">            <h2 className="text-3xl font-bold text-center mb-8 text-white font-grift">Schedule Your Discovery Call</h2>
            <div className="bg-gradient-to-r from-amber-400/20 to-yellow-500/20 border border-amber-400/40 rounded-xl p-6 mb-6 backdrop-blur-sm">
              <h3 className="text-amber-400 font-semibold mb-2 text-lg font-grift">🎉 Congratulations!</h3>
              <p className="text-neutral-300 font-grift">
                You've qualified for our exclusive Discovery Call. Let's schedule a time that works best for you.
              </p>
            </div>
              <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3 font-grift">
                Preferred Meeting Date & Time *
              </label>
              <div className="flex justify-center">
                <DatePicker
                  selected={formData.meetingTime}
                  onChange={(date) => {
                    setFormData({ ...formData, meetingTime: date });
                    if (showValidationError) {
                      setShowValidationError(false);
                    }
                  }}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  dateFormat="MMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  placeholderText="Select date and time"
                  required
                />
              </div>
              <p className="text-sm text-neutral-400 mt-3 font-grift text-center">
                Please select a date and time in the next 2 weeks. We'll confirm availability and send you the meeting details.
              </p>
            </div>

            <div className="bg-gradient-to-r from-neutral-900/80 to-neutral-800/60 border border-amber-400/30 rounded-xl p-6 backdrop-blur-sm">
              <h4 className="font-semibold text-amber-400 mb-3 font-grift">What to expect in your Discovery Call:</h4>
              <ul className="text-neutral-300 text-sm space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="font-grift">Comprehensive analysis of your current online presence</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="font-grift">Personalized growth strategy recommendations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="font-grift">Content marketing opportunities specific to your industry</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="font-grift">Q&A session to address your specific challenges</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="font-grift">Next steps for implementation (if it's a good fit)</span>
                </li>
              </ul>
            </div>
          </div>
        );case 11:
        return (
          <div className="text-center space-y-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto w-48 h-48 rounded-full overflow-hidden bg-gradient-to-r from-amber-400/20 to-yellow-500/20 p-4 backdrop-blur-sm border border-amber-400/30 shadow-2xl shadow-amber-400/20"
            >
              <img 
                src="/images/success.gif" 
                alt="Success Animation" 
                className="w-full h-full object-contain"
              />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-4"
            >              <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent font-grift">
                Discovery Call Scheduled!
              </h2>
              <p className="text-lg text-neutral-300 max-w-md mx-auto leading-relaxed font-grift">
                Your Discovery Call has been successfully scheduled! We'll be in touch within 24 hours to confirm your appointment and provide meeting details.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-gradient-to-r from-neutral-900/80 to-neutral-800/60 border border-amber-400/30 rounded-xl p-6 max-w-md mx-auto backdrop-blur-sm shadow-lg shadow-amber-400/10"
            >              <h4 className="font-semibold text-amber-400 mb-3 text-lg font-grift">Next Steps:</h4>
              <ul className="text-neutral-300 text-sm space-y-2 text-left">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="font-grift">Check your email for confirmation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="font-grift">Add the meeting to your calendar</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="font-grift">Prepare any questions you'd like to discuss</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="bg-gradient-to-r from-amber-400/10 to-yellow-500/10 border border-amber-400/20 rounded-xl p-4 max-w-lg mx-auto backdrop-blur-sm"
            >              <p className="text-amber-300 text-sm font-grift">
                <strong className="text-amber-400 font-grift">What to expect:</strong><br />
                Comprehensive analysis • Personalized strategy • Growth opportunities • Q&A session
              </p>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };  return (
    <div className="bg-black px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', border: '1px solid #fbbf24' } }} />
      
      {/* Duplicate Dialog */}
      {showDuplicateDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-neutral-900/90 backdrop-blur-xl border border-amber-400/30 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-amber-400/10"
          >
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-amber-400/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>              <h3 className="text-xl font-bold text-white font-grift">Call Already Registered</h3>
              <p className="text-neutral-300 font-grift">
                You've already placed a discovery call with us. Would you like to update your information with the latest details?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDuplicateChoice(true)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all duration-300 font-grift"
                >
                  Update Info
                </button>
                <button
                  onClick={() => handleDuplicateChoice(false)}
                  className="flex-1 px-4 py-3 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-all duration-300 border border-neutral-600 font-grift"
                >
                  Keep Previous
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto">
        {step <= 10 && (
          <div className="mb-8">            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-neutral-400 font-grift">
                Step {step} of 10
              </span>
              <span className="text-sm font-medium text-neutral-400 font-grift">
                {Math.round((step / 10) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-neutral-800/50 rounded-full h-3 backdrop-blur-sm">
              <div 
                className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 h-3 rounded-full transition-all duration-500 shadow-lg shadow-amber-400/30"
                style={{ width: `${(step / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        )}        <div className="bg-neutral-900/60 backdrop-blur-xl border border-amber-400/20 rounded-2xl shadow-2xl shadow-amber-400/10 p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="px-4 py-2"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>{step <= 10 && (
            <>
              {/* Validation Message - Only show when user attempts to proceed */}              {showValidationError && !isStepValid(step) && (
                <div className="mt-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm">
                  <p className="text-red-400 text-sm font-medium font-grift">
                    {getValidationMessage(step)}
                  </p>
                </div>
              )}
                <div className="flex justify-between mt-8 pt-6 border-t border-amber-400/20">
                <button
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`px-6 py-3 rounded-lg font-medium transition-all font-grift ${
                    step === 1
                      ? 'bg-neutral-800/50 text-neutral-600 cursor-not-allowed'
                      : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700/80 border border-neutral-600/50 hover:border-amber-400/50'
                  }`}
                >
                  Previous
                </button>                {step === 10 ? (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-lg font-medium hover:from-amber-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg shadow-amber-400/30 font-grift"
                  >
                    Schedule Call
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-lg font-medium hover:from-amber-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg shadow-amber-400/30 font-grift"
                  >
                    Next
                  </button>
                )}
              </div>
            </>
          )}</div>
      </div>
    </div>
  );
};

export default BookingForm;
