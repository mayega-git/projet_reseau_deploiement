/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/customButton';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRoutes } from '@/lib/server/services';
import TextArea from '../ui/textarea';
import { GlobalNotifier } from '../ui/GlobalNotifier';
import { updateUser } from '@/actions/user';

interface Errors {
  email: string;
  password: string;
  fullName: string;
}
const UpdateUserForm = () => {
  const { login } = useAuth();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const router = useRouter();
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [bio, setBio] = useState(
    ' Software Engineer | Open Source Enthusiast | Cat Lover'
  );
  const [confirmPasswordIsVisible, setConfirmPasswordIsVisible] =
    useState(false);
  const [error, setError] = useState<{ [key: string]: string }>({});
  const handlePasswordVisibility = () => {
    setPasswordIsVisible(!passwordIsVisible);
  };
  const handleConfirmPasswordVisibility = () => {
    setConfirmPasswordIsVisible(!confirmPasswordIsVisible);
  };
  const { user, role } = useAuth();
  const [formData, setFormData] = useState({
    email: user?.sub,
    password: '',
    firstName: user?.firstName,
    lastName: user?.lastName,
    confirmPassword: '',
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
    } else if (formData.email && !emailRegex.test(formData.email)) {
      newError.email = 'Invalid email format';
    }

    if (formData.password !== formData.confirmPassword) {
      newError.confirmPassword = 'Passwords do not match';
    } else if (formData.confirmPassword) {
      newError.confirmPassword = 'Password must be at least 6 characters long';
    }
    setError(newError);

    return Object.keys(newError).length === 0;
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    //validate form
    if (!validateForm()) return;

    // If no errors, proceed with form submission
    // If no errors, proceed with form submission
    try {
      if (!user?.id) throw new Error('User ID missing');
      
      const payload = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password || undefined, // Only send if set
          role: role ?? undefined,
      };

      const updatedUser = await updateUser(user.id, payload);

      if (updatedUser) {
        GlobalNotifier('User updated successfully', 'success');
        // Reload to ensure everything is fresh and context is updated from server
        window.location.reload(); 
      } else {
         GlobalNotifier('Failed to update user', 'error');
         setError({ form: 'Failed to update user' });
      }

    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during update');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="  flex justify-center flex-col gap-10 w-[80%]"
    >
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

        <div className="w-full h-full flex flex-col gap-2">
          <label className="form-label">Bio</label>
          <TextArea
            value={bio}
            label="Blog Description"
            height="60px"
            placeholder=""
            maxWords={50}
            onChange={(value) => setBio(value)}
          />
        </div>

        <div className="w-full h-full flex flex-col gap-2 relative">
          <label htmlFor="password" className="form-label">
            New password
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

        <div className="w-full h-full flex flex-col gap-2 relative">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm new password
          </label>
          <Input
            type={confirmPasswordIsVisible ? 'text' : 'password'}
            //placeholder="Password"
            name="confirmPassword"
            className={`${
              error.confirmPassword && `border-redTheme focus-visible:ring-0`
            }`}
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          {confirmPasswordIsVisible && (
            <div className="absolute right-3 top-11">
              <Eye
                color="#6C757D"
                size={20}
                onClick={handleConfirmPasswordVisibility}
              />
            </div>
          )}
          {!confirmPasswordIsVisible && (
            <div className="absolute right-3 top-11">
              <EyeOff
                size={20}
                color="#6C757D"
                onClick={handleConfirmPasswordVisibility}
              />
            </div>
          )}
          {error.confirmPassword && (
            <p className="text-redTheme paragraph-xmedium-medium">
              {error.confirmPassword}
            </p>
          )}
        </div>

        <div className="w-full flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </div>
    </form>
  );
};

export default UpdateUserForm;
