import React, { useState } from 'react';
import { Applicant } from '../types';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import FormSubmissionFeedback from './FormSubmissionFeedback';

interface ApplyFormProps {
  onSubmit: (data: Omit<Applicant, 'id' | 'status' | 'submissionDate' | 'score'>) => void;
  onCancel: () => void;
}

const ApplyForm: React.FC<ApplyFormProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '',
    dateOfBirth: '',
    gender: '',
    country: '',
    address: '',
    gpa: '', 
    university: '', 
    major: '', 
    academicYear: '',
    financialNeed: '',
    parentIncome: '',
    essay: '',
    careerGoals: '',
    references: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = 'Please enter a valid email';
    if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth?.trim()) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender?.trim()) newErrors.gender = 'Gender is required';
    if (!formData.country?.trim()) newErrors.country = 'Country is required';
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.university?.trim()) newErrors.university = 'University name is required';
    if (!formData.gpa) newErrors.gpa = 'GPA is required';
    else if (parseFloat(formData.gpa) < 2.0 || parseFloat(formData.gpa) > 4.0) newErrors.gpa = 'GPA must be between 2.0 and 4.0';
    if (!formData.major?.trim()) newErrors.major = 'Field of study is required';
    if (!formData.academicYear?.trim()) newErrors.academicYear = 'Academic year is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.careerGoals?.trim()) newErrors.careerGoals = 'Career goals are required';
    if (!formData.essay?.trim()) newErrors.essay = 'Essay is required';
    else if (formData.essay.trim().length < 50) newErrors.essay = `Essay must be at least 50 characters (${formData.essay.trim().length} now)`;
    if (!formData.references?.trim()) newErrors.references = 'References are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.essay?.trim()) newErrors.essay = 'Essay is required';
    else if (formData.essay.trim().length < 50) newErrors.essay = `Essay must be at least 50 characters (${formData.essay.trim().length} now)`;
    if (!formData.references?.trim()) newErrors.references = 'References are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    else if (step === 2) isValid = validateStep2();
    else if (step === 3) isValid = validateStep3();

    if (isValid) {
      if (step === 3) {
        console.log('✅ All validations passed! Moving to review...');
        setStep(4);
      } else {
        console.log(`✅ Step ${step} validated successfully`);
        setStep(step + 1);
      }
      setErrors({});
    } else {
      console.warn(`❌ Step ${step} validation failed`);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    // Final validation
    if (!validateStep3()) {
      console.error('❌ Validation failed at final step');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const submitFormData = new FormData();
      
      // Personal Information
      submitFormData.append('firstName', formData.firstName);
      submitFormData.append('lastName', formData.lastName);
      submitFormData.append('email', formData.email);
      submitFormData.append('phone', formData.phone);
      submitFormData.append('dateOfBirth', formData.dateOfBirth);
      submitFormData.append('gender', formData.gender);
      submitFormData.append('country', formData.country);
      submitFormData.append('address', formData.address);
      
      // Academic Information
      submitFormData.append('university', formData.university);
      submitFormData.append('gpa', formData.gpa);
      submitFormData.append('major', formData.major);
      submitFormData.append('academicYear', formData.academicYear);
      
      // Financial & Career Information
      submitFormData.append('financialNeed', formData.financialNeed);
      submitFormData.append('parentIncome', formData.parentIncome);
      submitFormData.append('careerGoals', formData.careerGoals);
      
      // Essay & References
      submitFormData.append('essay', formData.essay);
      submitFormData.append('references', formData.references);
      
      // Form metadata
      submitFormData.append('formType', 'Scholarship Application');
      submitFormData.append('timestamp', new Date().toISOString());
      
      // Create a formatted email body
      const emailBody = `
SCHOLARSHIP APPLICATION SUBMISSION
====================================

PERSONAL INFORMATION
--------------------
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}
Date of Birth: ${formData.dateOfBirth}
Gender: ${formData.gender}
Country: ${formData.country}
Address: ${formData.address}

ACADEMIC INFORMATION
--------------------
University: ${formData.university}
GPA: ${formData.gpa}
Field of Study: ${formData.major}
Academic Year: ${formData.academicYear}

FINANCIAL & CAREER INFORMATION
------------------------------
Financial Need: ${formData.financialNeed}
Annual Household Income: ${formData.parentIncome}
Career Goals: ${formData.careerGoals}

PERSONAL ESSAY
--------------
${formData.essay}

REFERENCES
----------
${formData.references}

Submitted on: ${new Date().toLocaleString()}
      `;
      
      submitFormData.append('message', emailBody);
      
      // Formspree special fields for proper email handling
      submitFormData.append('_subject', `New Scholarship Application from ${formData.firstName} ${formData.lastName}`);
      submitFormData.append('_replyto', formData.email);
      submitFormData.append('_gotcha', '');
      submitFormData.append('_to', 'ogunderosamson3@gmail.com');
      
      // Submit using fetch with no-cors to avoid CORS issues
      const response = await fetch('https://formspree.io/f/xqepwydl', {
        method: 'POST',
        body: submitFormData,
        mode: 'no-cors' // This prevents CORS preflight request
      });
      
      setShowFeedback(true);
      setIsLoading(false);
      
      // Wait 5 seconds before navigating away to let user see the success message
      setTimeout(() => {
        onSubmit({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          university: formData.university,
          gpa: parseFloat(formData.gpa),
          major: formData.major,
          essay: formData.essay
        });
      }, 5000);
    } catch (error) {
      setErrors({ submit: `Failed to submit: ${error instanceof Error ? error.message : 'Please try again.'}` });
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Personal Information</h2>
            <p className="text-slate-600 dark:text-slate-400">Let's start with your basic information</p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="First Name *"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-all ${
                      errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600'
                    }`}
                  />
                  {errors.firstName && <p className="text-red-600 text-sm font-semibold mt-1 px-2">{errors.firstName}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Last Name *"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-all ${
                      errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600'
                    }`}
                  />
                  {errors.lastName && <p className="text-red-600 text-sm font-semibold mt-1 px-2">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address *"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-all ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600'
                  }`}
                />
                {errors.email && <p className="text-red-600 text-sm font-semibold mt-1 px-2">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-all ${
                      errors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600'
                    }`}
                  />
                  {errors.phone && <p className="text-red-600 text-sm font-semibold mt-1 px-2">{errors.phone}</p>}
                </div>

                <div>
                  <input
                    type="date"
                    placeholder="Date of Birth *"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-all ${
                      errors.dateOfBirth ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-red-600 text-sm font-semibold mt-1 px-2">{errors.dateOfBirth}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-all ${
                      errors.gender ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600'
                    }`}
                  >
                    <option value="">Select Gender *</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-600 text-sm font-semibold mt-1 px-2">{errors.gender}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Country *"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-all ${
                      errors.country ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600'
                    }`}
                  />
                  {errors.country && <p className="text-red-600 text-sm font-semibold mt-1 px-2">{errors.country}</p>}
                </div>
              </div>

              <div>
                <textarea
                  placeholder="Full Address *"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-all resize-none ${
                    errors.address ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600'
                  }`}
                />
                {errors.address && <p className="text-red-600 text-sm font-semibold mt-1 px-2">{errors.address}</p>}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onCancel}
                className="flex-1 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white py-3 rounded-xl font-black hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-black transition-all flex items-center justify-center gap-2"
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Academic Information</h2>
            <p className="text-slate-600 dark:text-slate-400">Tell us about your academics and achievements</p>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="University Name *"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-all ${
                    errors.university ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600'
                  }`}
                />
                {errors.university && <p className="text-red-600 text-sm font-semibold mt-1 px-2">{errors.university}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    placeholder="GPA (2.0-4.0) *"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-all ${
                      errors.gpa ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600'
                    }`}
                  />
                  {errors.gpa && <p className="text-red-600 text-sm font-semibold mt-1 px-2">{errors.gpa}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Field of Study *"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-all ${
                      errors.major ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600'
                    }`}
                  />
                  {errors.major && <p className="text-red-600 text-sm font-semibold mt-1 px-2">{errors.major}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-all ${
                      errors.academicYear ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600'
                    }`}
                  >
                    <option value="">Select Academic Year *</option>
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Fourth Year">Fourth Year</option>
                    <option value="Masters">Masters</option>
                    <option value="PhD">PhD</option>
                  </select>
                  {errors.academicYear && <p className="text-red-600 text-sm font-semibold mt-1 px-2">{errors.academicYear}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleBack}
                className="flex-1 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white py-3 rounded-xl font-black hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-black transition-all flex items-center justify-center gap-2"
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Final Information & Essay</h2>
            <p className="text-slate-600 dark:text-slate-400">Share your story and help us understand your needs</p>

            <div className="space-y-4">
              <div>
                <textarea
                  placeholder="Career Goals - What are your professional aspirations? *"
                  name="careerGoals"
                  value={formData.careerGoals}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-all resize-none ${
                    errors.careerGoals ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600'
                  }`}
                />
                {errors.careerGoals && <p className="text-red-600 text-sm font-semibold mt-1 px-2">{errors.careerGoals}</p>}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900 dark:text-white mb-2 block">Personal Essay *</label>
                <textarea
                  placeholder="Share your story and why you deserve this scholarship (Minimum 50 characters)"
                  name="essay"
                  value={formData.essay}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-all resize-none ${
                    errors.essay ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600'
                  }`}
                />
                {errors.essay && <p className="text-red-600 text-sm font-semibold mt-1 px-2">{errors.essay}</p>}
                <p className={`text-xs font-semibold mt-2 ${formData.essay.length >= 50 ? 'text-emerald-600' : 'text-slate-500'}`}>
                  Characters: {formData.essay.length} / 50 (minimum)
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900 dark:text-white mb-2 block">References *</label>
                <textarea
                  placeholder="Provide 2-3 references (name, email, relationship). Example: Dr. John Smith, john@university.edu, Counselor"
                  name="references"
                  value={formData.references}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-all resize-none ${
                    errors.references ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600'
                  }`}
                />
                {errors.references && <p className="text-red-600 text-sm font-semibold mt-1 px-2">{errors.references}</p>}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleBack}
                className="flex-1 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white py-3 rounded-xl font-black hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-black transition-all flex items-center justify-center gap-2"
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Review & Submit</h2>
            <p className="text-slate-600 dark:text-slate-400">Please review your information before submitting</p>

            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl space-y-6 max-h-96 overflow-y-auto">
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase">First Name</p>
                    <p className="text-slate-900 dark:text-white font-semibold mt-1">{formData.firstName}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase">Last Name</p>
                    <p className="text-slate-900 dark:text-white font-semibold mt-1">{formData.lastName}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase">Email</p>
                    <p className="text-slate-900 dark:text-white font-semibold mt-1 text-sm">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase">Phone</p>
                    <p className="text-slate-900 dark:text-white font-semibold mt-1">{formData.phone}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase">Date of Birth</p>
                    <p className="text-slate-900 dark:text-white font-semibold mt-1">{formData.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase">Gender</p>
                    <p className="text-slate-900 dark:text-white font-semibold mt-1">{formData.gender}</p>
                  </div>
                </div>
              </div>

              <hr className="border-slate-200 dark:border-slate-700" />

              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Academic Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <p className="text-slate-500 text-xs font-bold uppercase">University</p>
                    <p className="text-slate-900 dark:text-white font-semibold mt-1">{formData.university}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase">GPA</p>
                    <p className="text-slate-900 dark:text-white font-semibold mt-1">{formData.gpa}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase">Field of Study</p>
                    <p className="text-slate-900 dark:text-white font-semibold mt-1">{formData.major}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase">Academic Year</p>
                    <p className="text-slate-900 dark:text-white font-semibold mt-1">{formData.academicYear}</p>
                  </div>
                </div>
              </div>

              <hr className="border-slate-200 dark:border-slate-700" />

              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Financial & Career</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase">Financial Need</p>
                    <p className="text-slate-900 dark:text-white font-semibold mt-1">{formData.financialNeed}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase">Household Income</p>
                    <p className="text-slate-900 dark:text-white font-semibold mt-1">{formData.parentIncome}</p>
                  </div>
                </div>
              </div>

              <hr className="border-slate-200 dark:border-slate-700" />

              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Personal Essay</h3>
                <p className="text-slate-900 dark:text-white font-semibold mt-1 text-sm whitespace-pre-wrap line-clamp-4">{formData.essay}</p>
              </div>
            </div>

            {errors.submit && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-xl">
                <p className="text-red-700 dark:text-red-400 text-sm font-bold">❌ {errors.submit}</p>
              </div>
            )}

            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl">
              <p className="text-indigo-700 dark:text-indigo-300 text-xs font-bold">✓ All information has been filled correctly. Click Submit to complete your application.</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white py-3 rounded-xl font-black hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {isLoading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 md:py-24 px-4">
      <FormSubmissionFeedback 
        isVisible={showFeedback}
        isLoading={false}
        onClose={() => {
          setShowFeedback(false);
          onCancel();
        }}
        title="Application Received!"
        message="Thank you for submitting your scholarship application. We have received your message and will contact you within 3-5 working days via email or iMessage. You can also join our Telegram community for updates: t.me/+Jg4s7pDS731mOTJh"
      />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Apply for Scholarship</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Step {step} of 4</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 flex gap-2">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-2 flex-grow rounded-full transition-all ${
                step >= s ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 md:p-12">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default ApplyForm;
