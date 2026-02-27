/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/customButton';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface Errors {
  email: string;
  password: string;
  fullName: string;
}
const Signup = () => {
  const { signup } = useAuth();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const router = useRouter();
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [error, setError] = useState<{ [key: string]: string }>({});
  const handlePasswordVisibility = () => {
    setPasswordIsVisible(!passwordIsVisible);
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Initialize error object
    const newError: { [key: string]: string } = {};

    // Validate form fields
    if (formData.firstName === '') {
      newError.firstName = 'First name is required';
    }
    if (formData.lastName === '') {
      newError.lastName = 'Last name is required';
    }

    if (formData.email === '') {
      newError.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newError.email = 'Invalid email format';
    }

    if (formData.password === '') {
      newError.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newError.password = 'Password must be at least 6 characters long';
    }

    setError(newError);

    return Object.keys(newError).length === 0;

    // // Check if there are any errors
    // const hasErrors = Object.values(newError).some((error) => error !== '');

    // if (hasErrors) {
    //   // Update state with errors
    //   setError(newError);
    //   return; // Exit early if there are errors
    // }
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    //validate form
    if (!validateForm()) return;

    // If no errors, proceed with form submission
    try {
      const result = await signup(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
      );
      if (!result.success) {
        alert(result.error ?? 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup');
    }
  };

  return (
    <div className="main-layout w-full min-h-screen bg-secondaryGreen-500 flex flex-col items-center">
      <main className="flex flex-col items-center mt-10 sm:mt-20 gap-8 sm:gap-14 w-full px-4">
        <Image alt="logo" width={110} height={52} src="/logoBlack.png" />
        <form
          onSubmit={handleSubmit}
          className="py-6 sm:py-8 w-full max-w-[460px] border border-grey-300 bg-white rounded-[8px] px-4 sm:px-8 flex justify-center flex-col gap-8 sm:gap-10"
        >
          <h4 className="h4-bold">Create your account</h4>
          <div className="flex flex-col gap-8">
            <div className="w-full h-full flex flex-col gap-2">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <Input
                type="text"
                placeholder=""
                name="email"
                className={`${
                  error.email && `border-redTheme focus-visible:ring-0`
                }`}
                value={formData.email}
                onChange={handleInputChange}
              />
              {error.email && (
                <p className="text-redTheme paragraph-xmedium-medium">
                  {error.email}
                </p>
              )}
            </div>
            <div className="w-full h-full flex flex-col gap-2">
              <label htmlFor="firstName" className="form-label">
                First name
              </label>
              <Input
                type="text"
                placeholder=""
                name="firstName"
                className={`${
                  error.firstName && `border-redTheme focus-visible:ring-0`
                }`}
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {error.firstName && (
                <p className="text-redTheme paragraph-xmedium-medium">
                  {error.firstName}
                </p>
              )}
            </div>

            <div className="w-full h-full flex flex-col gap-2">
              <label htmlFor="lastName" className="form-label">
                Last name
              </label>
              <Input
                type="text"
                placeholder=""
                name="lastName"
                className={`${
                  error.lastName && `border-redTheme focus-visible:ring-0`
                }`}
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {error.lastName && (
                <p className="text-redTheme paragraph-xmedium-medium">
                  {error.lastName}
                </p>
              )}
            </div>

            <div className="w-full h-full flex flex-col gap-2 relative">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <Input
                type={passwordIsVisible ? 'text' : 'password'}
                //placeholder="Password"
                name="password"
                className={`${
                  error.password && `border-redTheme focus-visible:ring-0`
                }`}
                value={formData.password}
                onChange={handleInputChange}
              />
              {passwordIsVisible && (
                <div className="absolute right-3 top-11">
                  <Eye
                    color="#6C757D"
                    size={20}
                    onClick={handlePasswordVisibility}
                  />
                </div>
              )}
              {!passwordIsVisible && (
                <div className="absolute right-3 top-11">
                  <EyeOff
                    size={20}
                    color="#6C757D"
                    onClick={handlePasswordVisibility}
                  />
                </div>
              )}
              {error.password && (
                <p className="text-redTheme paragraph-xmedium-medium">
                  {error.password}
                </p>
              )}
            </div>

            <Button type="submit" className="primary">
              Create account
            </Button>
            <p
              onClick={() => router.push('/auth/login')}
              className="paragraph-small-medium text-center text-black-300"
            >
              Already have an account ?
              <span className="cursor-pointer text-primaryPurple-500 hover:underline transition duration-300">
                {' '}
                Sign in
              </span>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Signup;
