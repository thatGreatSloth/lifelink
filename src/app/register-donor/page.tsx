'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type BloodType = 'A_POS' | 'A_NEG' | 'B_POS' | 'B_NEG' | 'AB_POS' | 'AB_NEG' | 'O_POS' | 'O_NEG';

interface DonorFormData {
  // User fields
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  
  // Donor profile fields
  bloodType: BloodType | '';
  location: string;
  latitude?: number;
  longitude?: number;
  lastDonationDate?: string;
  medicalNotes?: string;
  
  // Terms and conditions
  agreedToTerms: boolean;
}

export default function RegisterDonor() {
  const router = useRouter();
  const [formData, setFormData] = useState<DonorFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    bloodType: '',
    location: '',
    medicalNotes: '',
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof DonorFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const bloodTypes: BloodType[] = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'];

  const bloodTypeLabels: Record<BloodType, string> = {
    A_POS: 'A+',
    A_NEG: 'A-',
    B_POS: 'B+',
    B_NEG: 'B-',
    AB_POS: 'AB+',
    AB_NEG: 'AB-',
    O_POS: 'O+',
    O_NEG: 'O-',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof DonorFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getCurrentLocation = () => {
    setUseCurrentLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          // Optionally, reverse geocode to get address
          reverseGeocode(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setErrors(prev => ({ ...prev, location: 'Unable to get current location' }));
          setUseCurrentLocation(false);
        }
      );
    } else {
      setErrors(prev => ({ ...prev, location: 'Geolocation is not supported by your browser' }));
      setUseCurrentLocation(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Using a free geocoding service (you may want to use Google Maps API with your key)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.display_name) {
        setFormData(prev => ({
          ...prev,
          location: data.display_name,
        }));
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DonorFormData, string>> = {};

    // User fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Donor profile validation
    if (!formData.bloodType) newErrors.bloodType = 'Blood type is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement API call to register donor
      const response = await fetch('/api/register/donor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          bloodType: formData.bloodType,
          location: formData.location,
          latitude: formData.latitude,
          longitude: formData.longitude,
          lastDonationDate: formData.lastDonationDate,
          medicalNotes: formData.medicalNotes,
        }),
      });

      if (response.ok) {
        // Registration successful
        router.push('/login?registered=true');
      } else {
        const error = await response.json();
        setErrors({ email: error.message || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ email: 'An error occurred during registration' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-red-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Become a Blood Donor
            </h1>
            <p className="text-gray-600">
              Register to save lives by donating blood
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-red-200'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-red-200'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Contact Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-red-200'
                    }`}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.phoneNumber ? 'border-red-500' : 'border-red-200'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Security
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-red-200'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-500' : 'border-red-200'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Donor Information Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Donor Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.bloodType ? 'border-red-500' : 'border-red-200'
                    }`}
                  >
                    <option value="">Select your blood type</option>
                    {bloodTypes.map((type) => (
                      <option key={type} value={type}>
                        {bloodTypeLabels[type]}
                      </option>
                    ))}
                  </select>
                  {errors.bloodType && (
                    <p className="mt-1 text-sm text-red-500">{errors.bloodType}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.location ? 'border-red-500' : 'border-red-200'
                      }`}
                      placeholder="City, State, Country"
                    />
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={useCurrentLocation}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      📍 Current
                    </button>
                  </div>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastDonationDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Donation Date (Optional)
                  </label>
                  <input
                    type="date"
                    id="lastDonationDate"
                    name="lastDonationDate"
                    value={formData.lastDonationDate || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    If you've donated blood before, please provide the date
                  </p>
                </div>

                <div>
                  <label htmlFor="medicalNotes" className="block text-sm font-medium text-gray-700 mb-1">
                    Medical Notes (Optional)
                  </label>
                  <textarea
                    id="medicalNotes"
                    name="medicalNotes"
                    value={formData.medicalNotes || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Any medical conditions or notes we should be aware of..."
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Include any allergies, medications, or conditions relevant to blood donation
                  </p>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="border-t pt-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="agreedToTerms"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleInputChange}
                    className={`w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 ${
                      errors.agreedToTerms ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="agreedToTerms" className="text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="/terms" className="text-red-600 hover:text-red-700 font-medium">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-red-600 hover:text-red-700 font-medium">
                      Privacy Policy
                    </a>
                    <span className="text-red-500"> *</span>
                  </label>
                  {errors.agreedToTerms && (
                    <p className="mt-1 text-sm text-red-500">{errors.agreedToTerms}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 focus:ring-4 focus:ring-red-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Registering...' : 'Register as Donor'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-red-600 hover:text-red-700 font-medium">
                Sign in here
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
