'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { db } from '@/firebase/config';
import { ref, set, push } from 'firebase/database';
import PhoneInput from 'react-phone-number-input';
import DatePicker from 'react-datepicker';
import { Toaster, toast } from 'react-hot-toast';
import { Check, ArrowRight, User, Mail, Link as LinkIcon, DollarSign, Zap, Briefcase, Building, BarChart2, AlertTriangle, Calendar as CalendarIcon, Phone } from 'lucide-react';
import Stepper, { Step } from '../blocks/Components/Stepper/Stepper';
import SectionChip from '@/components/ui/section-chip';
import 'react-phone-number-input/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import '../app/datepicker-custom.css';

const BookingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const [errors, setErrors] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

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
        setCurrentStep(parseInt(savedStep, 10));
      }
    } catch (error) {
      // Failed to load form data from localStorage - continue with defaults
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('bookingFormData', JSON.stringify(formData));
      localStorage.setItem('bookingFormStep', currentStep.toString());
    } catch (error) {
      // Failed to save form data to localStorage - continue silently
    }
  }, [formData, currentStep]);

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
  };

  const validateStep = (step) => {
    let newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

    switch (step) {
      case 1: 
        if (!formData.description) newErrors.description = 'Please select an option.'; 
        break;
      case 2: 
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
        break;
      case 3:
        if (!formData.email || !emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address.';
        if (!formData.phone || formData.phone.length < 10) newErrors.phone = 'Please enter a valid phone number.';
        break;
      case 4: 
        if (!formData.socialLink || !urlRegex.test(formData.socialLink)) newErrors.socialLink = 'Please enter a valid URL.'; 
        break;
      case 5: 
        if (!formData.sellsOnline) newErrors.sellsOnline = 'Please select an option.'; 
        break;
      case 6: 
        if (!formData.monthlyRevenue) newErrors.monthlyRevenue = 'Please select your monthly revenue.'; 
        break;
      case 7: 
        if (formData.bottlenecks.length === 0) newErrors.bottlenecks = 'Please select at least one bottleneck.'; 
        break;
      case 8: 
        if (!formData.agreement) newErrors.agreement = 'You must agree to the terms to proceed.'; 
        break;
      case 9: 
        if (!formData.canInvest) newErrors.canInvest = 'Please select an option.'; 
        break;
      case 10: 
        if (!formData.meetingTime) newErrors.meetingTime = 'Please select a meeting date and time.'; 
        break;
      default: 
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStepChange = (step) => {
    if (validateStep(currentStep)) {
      setCurrentStep(step);
    } else {
      // Show validation errors
      toast.error('Please complete all required fields before proceeding.');
    }
  };

  const handleFinalSubmit = async () => {
    if (!validateStep(10)) {
      toast.error('Please complete all required fields.');
      return;
    }

    // Check if Firebase is available
    if (!db) {
      toast.error('Booking service is temporarily unavailable. Please try again later.');
      return;
    }

    toast.loading('Scheduling your discovery call...');
    try {
      const emailKey = formData.email.replace(/[.#$[\]/]/g, '_');
      const discoveryCallRef = ref(db, `discoverycalls/${emailKey}`);
      
      await set(discoveryCallRef, { 
        ...formData, 
        meetingTime: formData.meetingTime.toISOString(),
        submittedAt: new Date().toISOString() 
      });
      
      toast.dismiss();
      toast.success('Your call is successfully scheduled!');
      
      localStorage.removeItem('bookingFormData');
      localStorage.removeItem('bookingFormStep');
      
      setIsCompleted(true);

      // Reset form state for next time
      setFormData({
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

    } catch (error) {
      toast.dismiss();
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (isCompleted) {
    return (
      <section id="booking-form" className="py-20 md:py-32 bg-black">
        <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-10"
          >
            <div className="text-center flex flex-col items-center justify-center h-full">
              <Image src="/images/success.gif" alt="Success" width={160} height={160} className="mb-4" />
              <h3 className="text-2xl font-bold text-white mt-4">Discovery Call Scheduled!</h3>
              <p className="text-neutral-400 mt-2">We&apos;ll be in touch shortly to confirm the details.</p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking-form" className="py-20 md:py-32 bg-black">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <SectionChip title="Discovery Call" icon={Phone} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-100 leading-tight">
            Let&apos;s Understand Your{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent font-bold">
                Growth Goals
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </h2>
          <p className="text-lg text-neutral-400 mt-4 max-w-2xl mx-auto">This will only take a few minutes.</p>
        </div>

        <Stepper 
          initialStep={currentStep}
          onStepChange={handleStepChange}
          onFinalStepCompleted={handleFinalSubmit}
          backButtonText="Previous"
          nextButtonText="Next"
          stepCircleContainerClassName="bg-gradient-to-br from-neutral-900/90 to-black/90 border border-amber-400/30 backdrop-blur-xl shadow-2xl shadow-amber-400/10"
          contentClassName="text-white min-h-[400px]"
          footerClassName="border-t border-amber-400/20"
          backButtonProps={{
            className: "px-6 py-3 bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-600/50 hover:border-amber-400/50 text-neutral-300 hover:text-amber-400 rounded-lg transition-all duration-300 font-medium tracking-wide"
          }}
          nextButtonProps={{
            className: "px-8 py-3 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-500 hover:via-amber-400 hover:to-yellow-500 text-black font-bold rounded-lg transition-all duration-300 shadow-lg shadow-amber-400/25 hover:shadow-amber-400/40 transform hover:scale-105"
          }}
        >
          {/* Step 1: Role Selection */}
          <Step>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Briefcase className="mr-3 text-amber-400" size={28} />
              Which of these best describes you?
            </h3>
            <div className="space-y-4">
              {['Brand Owner', 'Marketing Manager', 'Agency', 'Other'].map(option => (
                <div key={option}>
                  <input 
                    type="radio" 
                    id={option} 
                    name="description" 
                    value={option} 
                    onChange={handleChange} 
                    checked={formData.description === option} 
                    className="hidden" 
                  />
                  <label 
                    htmlFor={option} 
                    className="flex items-center p-4 border-2 border-neutral-700 hover:border-amber-400/50 rounded-lg cursor-pointer transition-all duration-300 hover:bg-neutral-800/50 group"
                  >
                    <span className="w-5 h-5 border-2 border-neutral-600 group-hover:border-amber-400 rounded-full mr-4 flex items-center justify-center">
                      {formData.description === option && <span className="w-2.5 h-2.5 bg-amber-400 rounded-full"></span>}
                    </span>
                    <span className="text-white group-hover:text-amber-400 font-semibold">{option}</span>
                  </label>
                </div>
              ))}
            </div>
            {errors.description && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-red-400 text-sm mt-4"
              >
                {errors.description}
              </motion.p>
            )}
          </Step>

          {/* Step 2: Name */}
          <Step>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <User className="mr-3 text-amber-400" size={28} />
              What&apos;s your name?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="text-neutral-300 mb-2 block font-medium">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. John"
                  className="w-full p-4 bg-neutral-900/80 border-2 border-neutral-700 focus:border-amber-400 rounded-lg text-white transition-all duration-300 placeholder-neutral-500 backdrop-blur-sm"
                />
                {errors.firstName && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-red-400 text-sm mt-2"
                  >
                    {errors.firstName}
                  </motion.p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="text-neutral-300 mb-2 block font-medium">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Doe"
                  className="w-full p-4 bg-neutral-900/80 border-2 border-neutral-700 focus:border-amber-400 rounded-lg text-white transition-all duration-300 placeholder-neutral-500 backdrop-blur-sm"
                />
                {errors.lastName && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-red-400 text-sm mt-2"
                  >
                    {errors.lastName}
                  </motion.p>
                )}
              </div>
            </div>
          </Step>

          {/* Step 3: Contact Info */}
          <Step>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Mail className="mr-3 text-amber-400" size={28} />
              How can we reach you?
            </h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="text-neutral-300 mb-2 block font-medium">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full p-4 bg-neutral-900/80 border-2 border-neutral-700 focus:border-amber-400 rounded-lg text-white transition-all duration-300 placeholder-neutral-500 backdrop-blur-sm"
                />
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-red-400 text-sm mt-2"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="text-neutral-300 mb-2 block font-medium">Phone Number</label>
                <PhoneInput
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(value) => setFormData({...formData, phone: value})}
                  className="w-full p-4 bg-neutral-900/80 border-2 border-neutral-700 focus:border-amber-400 rounded-lg text-white transition-all duration-300 placeholder-neutral-500 backdrop-blur-sm"
                  defaultCountry="US"
                />
                {errors.phone && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-red-400 text-sm mt-2"
                  >
                    {errors.phone}
                  </motion.p>
                )}
              </div>
            </div>
          </Step>

          {/* Step 4: Social Link */}
          <Step>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <LinkIcon className="mr-3 text-amber-400" size={28} />
              Your main social media or website link?
            </h3>
            <p className="text-neutral-400 mb-6">e.g., Instagram, TikTok, or your website.</p>
            <input
              type="url"
              name="socialLink"
              value={formData.socialLink}
              onChange={handleChange}
              placeholder="https://instagram.com/yourbrand"
              className="w-full p-4 bg-neutral-900/80 border-2 border-neutral-700 focus:border-amber-400 rounded-lg text-white transition-all duration-300 placeholder-neutral-500 backdrop-blur-sm"
            />
            {errors.socialLink && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-red-400 text-sm mt-4"
              >
                {errors.socialLink}
              </motion.p>
            )}
          </Step>

          {/* Step 5: Online Sales */}
          <Step>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Building className="mr-3 text-amber-400" size={28} />
              Do you currently sell products/services online?
            </h3>
            <div className="space-y-4">
              {['Yes', 'No'].map(option => (
                <div key={option}>
                  <input 
                    type="radio" 
                    id={`sellsOnline-${option}`} 
                    name="sellsOnline" 
                    value={option} 
                    onChange={handleChange} 
                    checked={formData.sellsOnline === option} 
                    className="hidden" 
                  />
                  <label 
                    htmlFor={`sellsOnline-${option}`} 
                    className="flex items-center p-4 border-2 border-neutral-700 hover:border-amber-400/50 rounded-lg cursor-pointer transition-all duration-300 hover:bg-neutral-800/50 group"
                  >
                    <span className="w-5 h-5 border-2 border-neutral-600 group-hover:border-amber-400 rounded-full mr-4 flex items-center justify-center">
                      {formData.sellsOnline === option && <span className="w-2.5 h-2.5 bg-amber-400 rounded-full"></span>}
                    </span>
                    <span className="text-white group-hover:text-amber-400 font-semibold">{option}</span>
                  </label>
                </div>
              ))}
            </div>
            {errors.sellsOnline && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-red-400 text-sm mt-4"
              >
                {errors.sellsOnline}
              </motion.p>
            )}
          </Step>

          {/* Step 6: Revenue */}
          <Step>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <BarChart2 className="mr-3 text-amber-400" size={28} />
              What&apos;s your current average monthly revenue?
            </h3>
            <div className="space-y-4">
              {['Under $10K', '$10K - $50K', '$50K - $100K', '$100K - $500K', '$500K+'].map(option => (
                <div key={option}>
                  <input 
                    type="radio" 
                    id={option.replace(/\s/g, '')} 
                    name="monthlyRevenue" 
                    value={option} 
                    onChange={handleChange} 
                    checked={formData.monthlyRevenue === option} 
                    className="hidden" 
                  />
                  <label 
                    htmlFor={option.replace(/\s/g, '')} 
                    className="flex items-center p-4 border-2 border-neutral-700 hover:border-amber-400/50 rounded-lg cursor-pointer transition-all duration-300 hover:bg-neutral-800/50 group"
                  >
                    <span className="w-5 h-5 border-2 border-neutral-600 group-hover:border-amber-400 rounded-full mr-4 flex items-center justify-center">
                      {formData.monthlyRevenue === option && <span className="w-2.5 h-2.5 bg-amber-400 rounded-full"></span>}
                    </span>
                    <span className="text-white group-hover:text-amber-400 font-semibold">{option}</span>
                  </label>
                </div>
              ))}
            </div>
            {errors.monthlyRevenue && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-red-400 text-sm mt-4"
              >
                {errors.monthlyRevenue}
              </motion.p>
            )}
          </Step>

          {/* Step 7: Bottlenecks */}
          <Step>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Zap className="mr-3 text-amber-400" size={28} />
              What are your biggest bottlenecks right now?
            </h3>
            <p className="text-neutral-400 mb-6">Select all that apply.</p>
            <div className="space-y-4">
              {['Getting new customers', 'Creating content consistently', 'Low engagement/views', 'Converting followers to customers', 'Not enough time'].map(option => (
                <div key={option}>
                  <input 
                    type="checkbox" 
                    id={option.replace(/\s/g, '')} 
                    name="bottlenecks" 
                    value={option} 
                    onChange={handleChange} 
                    checked={formData.bottlenecks.includes(option)} 
                    className="hidden" 
                  />
                  <label 
                    htmlFor={option.replace(/\s/g, '')} 
                    className="flex items-center p-4 border-2 border-neutral-700 hover:border-amber-400/50 rounded-lg cursor-pointer transition-all duration-300 hover:bg-neutral-800/50 group"
                  >
                    <span className="w-5 h-5 border-2 border-neutral-600 group-hover:border-amber-400 rounded mr-4 flex items-center justify-center">
                      {formData.bottlenecks.includes(option) && <Check className="text-amber-400" size={16} />}
                    </span>
                    <span className="text-white group-hover:text-amber-400 font-semibold">{option}</span>
                  </label>
                </div>
              ))}
              <div>
                <input 
                  type="checkbox" 
                  id="customBottleneck" 
                  name="bottlenecks" 
                  value="Custom" 
                  onChange={handleChange} 
                  checked={formData.bottlenecks.includes('Custom')} 
                  className="hidden" 
                />
                <label 
                  htmlFor="customBottleneck" 
                  className="flex items-center p-4 border-2 border-neutral-700 hover:border-amber-400/50 rounded-lg cursor-pointer transition-all duration-300 hover:bg-neutral-800/50 group"
                >
                  <span className="w-5 h-5 border-2 border-neutral-600 group-hover:border-amber-400 rounded mr-4 flex items-center justify-center">
                    {formData.bottlenecks.includes('Custom') && <Check className="text-amber-400" size={16} />}
                  </span>
                  <span className="text-white group-hover:text-amber-400 font-semibold">Other (please specify)</span>
                </label>
                {formData.bottlenecks.includes('Custom') && (
                  <div className="mt-4">
                    <textarea
                      name="customBottleneck"
                      value={formData.customBottleneck}
                      onChange={handleChange}
                      placeholder="Please describe your specific challenge..."
                      maxLength={200}
                      className="w-full p-4 bg-neutral-900/80 border-2 border-neutral-700 focus:border-amber-400 rounded-lg text-white transition-all duration-300 placeholder-neutral-500 backdrop-blur-sm resize-none"
                      rows={3}
                    />
                    <p className="text-xs text-neutral-500 mt-2">{formData.customBottleneck.length}/200 characters</p>
                  </div>
                )}
              </div>
            </div>
            {errors.bottlenecks && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-red-400 text-sm mt-4"
              >
                {errors.bottlenecks}
              </motion.p>
            )}
          </Step>

          {/* Step 8: Agreement */}
          <Step>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <AlertTriangle className="mr-3 text-amber-400" size={28} />
              A quick heads-up...
            </h3>
            <div className="bg-gradient-to-r from-neutral-900/80 to-neutral-800/60 border border-amber-400/30 p-6 rounded-xl space-y-4 text-neutral-300 backdrop-blur-sm mb-6">
              <p className="leading-relaxed">This is a strategy call to see if we&apos;re a good fit. We&apos;ll explore your goals and see how our system can help you achieve them.</p>
              <p className="leading-relaxed">This is NOT a free coaching call. Please only book if you are serious about growing your brand with a dedicated partner.</p>
            </div>
            <div>
              <input 
                type="checkbox" 
                id="agreement" 
                name="agreement" 
                checked={formData.agreement} 
                onChange={handleChange} 
                className="hidden" 
              />
              <label 
                htmlFor="agreement" 
                className="flex items-center p-4 border-2 border-neutral-700 hover:border-amber-400/50 rounded-lg cursor-pointer transition-all duration-300 hover:bg-neutral-800/50 group"
              >
                <span className="w-5 h-5 border-2 border-neutral-600 group-hover:border-amber-400 rounded mr-4 flex items-center justify-center">
                  {formData.agreement && <Check className="text-amber-400" size={16} />}
                </span>
                <span className="text-white group-hover:text-amber-400 font-semibold">I understand and agree.</span>
              </label>
            </div>
            {errors.agreement && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-red-400 text-sm mt-4"
              >
                {errors.agreement}
              </motion.p>
            )}
          </Step>

          {/* Step 9: Investment */}
          <Step>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <DollarSign className="mr-3 text-amber-400" size={28} />
              Are you ready to invest in a solution?
            </h3>
            <p className="text-neutral-400 mb-6">Our services start at $2,500/month. This helps us ensure we can dedicate the resources needed for significant growth.</p>
            <div className="space-y-4">
              {['Yes, I can invest $2,500+/month', 'No, not at this time'].map(option => (
                <div key={option}>
                  <input 
                    type="radio" 
                    id={option.replace(/\s/g, '')} 
                    name="canInvest" 
                    value={option} 
                    onChange={handleChange} 
                    checked={formData.canInvest === option} 
                    className="hidden" 
                  />
                  <label 
                    htmlFor={option.replace(/\s/g, '')} 
                    className="flex items-center p-4 border-2 border-neutral-700 hover:border-amber-400/50 rounded-lg cursor-pointer transition-all duration-300 hover:bg-neutral-800/50 group"
                  >
                    <span className="w-5 h-5 border-2 border-neutral-600 group-hover:border-amber-400 rounded-full mr-4 flex items-center justify-center">
                      {formData.canInvest === option && <span className="w-2.5 h-2.5 bg-amber-400 rounded-full"></span>}
                    </span>
                    <span className="text-white group-hover:text-amber-400 font-semibold">{option}</span>
                  </label>
                </div>
              ))}
            </div>
            {errors.canInvest && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-red-400 text-sm mt-4"
              >
                {errors.canInvest}
              </motion.p>
            )}
          </Step>

          {/* Step 10: Calendar */}
          <Step>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <CalendarIcon className="mr-3 text-amber-400" size={28} />
              Schedule Your Call
            </h3>
            <p className="text-neutral-400 mb-6">Select a date and time that works for you. We&apos;ll send a calendar invite to confirm.</p>
            <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/60 border border-amber-400/30 p-6 rounded-xl flex justify-center backdrop-blur-sm">
              <DatePicker
                selected={formData.meetingTime}
                onChange={(date) => setFormData({...formData, meetingTime: date})}
                showTimeSelect
                inline
                minDate={new Date()}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="!bg-transparent"
              />
            </div>
            {errors.meetingTime && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-red-400 text-sm mt-4 text-center"
              >
                {errors.meetingTime}
              </motion.p>
            )}
          </Step>
        </Stepper>
      </div>
    </section>
  );
};

export default BookingForm;
