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
}
const Login = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [error, setError] = useState<{ [key: string]: string }>({});
  const handlePasswordVisibility = () => {
    setPasswordIsVisible(!passwordIsVisible);
  };
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    const newErrors: { [key: string]: string } = {};

    // Validate form fields
    if (formData.password === '') {
      newErrors.password = 'Password is required';
    }

    if (formData.email === '') {
      newErrors.email = 'Email is required';
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    //formvalidation
    if (!validateForm()) return;

    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        alert(result.error ?? 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
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
          <h4 className="h4-bold">Log in to your account</h4>
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
              Sign in
            </Button>
            <p
              onClick={() => router.push('/auth/signup')}
              className="paragraph-small-medium text-center text-black-300"
            >
              New to Let&apos;sGo?{' '}
              <span className="cursor-pointer text-primaryPurple-500 hover:underline transition duration-300">
                Create account
              </span>{' '}
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;
