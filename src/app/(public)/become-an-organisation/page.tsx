/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/become-an-organization.tsx
'use client';
import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Image from 'next/image';
import { createOrganisation } from '@/actions/organisation';
import { assignRole } from '@/actions/user';
import { AppRoles } from '@/constants/roles';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

// Define the form schema using Yup
const schema = yup.object().shape({
  longName: yup.string().required('Long Name is required'),
  shortName: yup.string().required('Short Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  orgDescription: yup.string().required('Organization Description is required'),
  logoUrl: yup.string().url('Invalid URL').required('Logo URL is required'),
  businessDomain: yup.string().required('Business Domain is required'),
  type: yup.string().required('Type is required'),
  isActive: yup.boolean().required('Active status is required'),
  webSiteUrl: yup
    .string()
    .url('Invalid URL')
    .required('Website URL is required'),
  orgContact: yup.string().required('Organization Contact is required'),
  socialNetwork: yup.string().required('Social Network is required'),
  businessRegistrationNumber: yup
    .string()
    .required('Business Registration Number is required'),
  taxNumber: yup.string().required('Tax Number is required'),
  capitalShare: yup
    .number()
    .required('Capital Share is required')
    .positive('Capital Share must be positive'),
  registrationDate: yup
    .date()
    .required('Registration Date is required')
    .transform((curr, original) => {
      // If the input is a valid date string, return a Date object
      if (original && !isNaN(new Date(original).getTime())) {
        return new Date(original);
      }
      // Otherwise, return the current value (curr)
      return curr;
    }),
  ceoName: yup.string().required('CEO Name is required'),
  yearFounded: yup
    .date()
    .required('Year Founded is required')
    .transform((curr, original) => {
      // If the input is a valid date string, return a Date object
      if (original && !isNaN(new Date(original).getTime())) {
        return new Date(original);
      }
      // Otherwise, return the current value (curr)
      return curr;
    }),
  keywords: yup
    .array()
    .of(yup.string())
    .min(1, 'At least one keyword is required'),
  numberOfEmployees: yup
    .number()
    .required('Number of Employees is required')
    .positive('Number of Employees must be positive'),
});

type FormData = yup.InferType<typeof schema>;

const BecomeAnOrganizationPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { user, refreshUser } = useAuth();

  useEffect(() => {
    console.log(errors); // Check if there are validation errors
  }, [errors]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log('entering SubmitHandler');
    console.log('Form Data:', data);

    // Ensure user and user.id are defined
    if (!user || !user.id) {
      console.error('User or user ID is undefined');
      return;
    }

    // Construct the data to send
    const dataToSend: Record<string, unknown> = {
      organisationId: user.id,
      businessActorId: user.id,
      ...data,
    };
    console.log('Data to Send:', dataToSend);

    try {
      // Make the API call via server action
      const apiResponse = await createOrganisation(dataToSend);
      console.log('API Response:', apiResponse);

      // Upgrade role after successful creation
      await assignRole(user.id, AppRoles.ADMIN);
      refreshUser({ ...user, roles: [...(user.roles ?? []), AppRoles.ADMIN] });
      alert('Organization created successfully!');
    } catch (err) {
      console.error('An error occurred', err);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <Image alt="logo" width={110} height={52} src="/logoBlack.png" />
          <h1 className="text-3xl font-bold text-center mb-8">
            Become an Organization
          </h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Long Name */}
          <div>
            <label htmlFor="longName" className="form-label">
              Long Name
            </label>
            <input
              id="longName"
              type="text"
              {...register('longName')}
              className="custom-input"
            />
            {errors.longName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.longName.message}
              </p>
            )}
          </div>

          {/* Short Name */}
          <div>
            <label htmlFor="shortName" className="form-label">
              Short Name
            </label>
            <input
              id="shortName"
              type="text"
              {...register('shortName')}
              className="custom-input"
            />
            {errors.shortName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.shortName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="custom-input"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Organization Description */}
          <div>
            <label htmlFor="orgDescription" className="form-label">
              Organization Description
            </label>
            <textarea
              id="orgDescription"
              {...register('orgDescription')}
              className="custom-input"
            />
            {errors.orgDescription && (
              <p className="text-red-500 text-sm mt-1">
                {errors.orgDescription.message}
              </p>
            )}
          </div>

          {/* Logo URL */}
          <div>
            <label htmlFor="logoUrl" className="form-label">
              Logo URL
            </label>
            <input
              id="logoUrl"
              type="url"
              {...register('logoUrl')}
              className="custom-input"
            />
            {errors.logoUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.logoUrl.message}
              </p>
            )}
          </div>

          {/* Business Domain */}
          <div>
            <label htmlFor="businessDomain" className="form-label">
              Business Domain
            </label>
            <select
              id="businessDomain"
              {...register('businessDomain')}
              className="custom-input"
            >
              <option value="TRANSPORT">AGRICULTURE</option>
              <option value="TECHNOLOGY">TRANSPORT</option>
              <option value="HEALTHCARE">TECHNOLOGY</option>
            </select>
            {errors.businessDomain && (
              <p className="text-red-500 text-sm mt-1">
                {errors.businessDomain.message}
              </p>
            )}
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="form-label">
              Type
            </label>
            <input
              id="type"
              type="text"
              {...register('type')}
              className="custom-input"
            />
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Active Status */}
          <div>
            <label htmlFor="isActive" className="form-label">
              Active Status
            </label>
            <input
              id="isActive"
              type="checkbox"
              {...register('isActive')}
              className="mt-1 block"
            />
            {errors.isActive && (
              <p className="text-red-500 text-sm mt-1">
                {errors.isActive.message}
              </p>
            )}
          </div>

          {/* Website URL */}
          {/* Website URL */}
          <div>
            <label htmlFor="webSiteUrl" className="form-label">
              Website URL
            </label>
            <input
              id="webSiteUrl"
              type="text"
              {...register('webSiteUrl')}
              className="custom-input"
            />
            {errors.webSiteUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.webSiteUrl.message}
              </p>
            )}
          </div>

          {/* Organization Contact */}
          <div>
            <label htmlFor="orgContact" className="form-label">
              Organization Contact
            </label>
            <input
              id="orgContact"
              type="text"
              {...register('orgContact')}
              className="custom-input"
            />
            {errors.orgContact && (
              <p className="text-red-500 text-sm mt-1">
                {errors.orgContact.message}
              </p>
            )}
          </div>

          {/* Social Network */}
          <div>
            <label htmlFor="socialNetwork" className="form-label">
              Social Network
            </label>
            <input
              id="socialNetwork"
              type="text"
              {...register('socialNetwork')}
              className="custom-input"
            />
            {errors.socialNetwork && (
              <p className="text-red-500 text-sm mt-1">
                {errors.socialNetwork.message}
              </p>
            )}
          </div>

          {/* Business Registration Number */}
          <div>
            <label htmlFor="businessRegistrationNumber" className="form-label">
              Business Registration Number
            </label>
            <input
              id="businessRegistrationNumber"
              type="text"
              {...register('businessRegistrationNumber')}
              className="custom-input"
            />
            {errors.businessRegistrationNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.businessRegistrationNumber.message}
              </p>
            )}
          </div>

          {/* Tax Number */}
          <div>
            <label htmlFor="taxNumber" className="form-label">
              Tax Number
            </label>
            <input
              id="taxNumber"
              type="text"
              {...register('taxNumber')}
              className="custom-input"
            />
            {errors.taxNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.taxNumber.message}
              </p>
            )}
          </div>

          {/* Registration Date */}
          <div>
            <label htmlFor="registrationDate" className="form-label">
              Registration Date
            </label>
            <input
              id="registrationDate"
              type="date"
              {...register('registrationDate')}
              className="custom-input"
            />
            {errors.registrationDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.registrationDate.message}
              </p>
            )}
          </div>

          {/* CEO Name */}
          <div>
            <label htmlFor="ceoName" className="form-label">
              CEO Name
            </label>
            <input
              id="ceoName"
              type="text"
              {...register('ceoName')}
              className="custom-input"
            />
            {errors.ceoName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.ceoName.message}
              </p>
            )}
          </div>

          {/* Year Founded */}
          <div>
            <label htmlFor="yearFounded" className="form-label">
              Year Founded
            </label>
            <input
              id="yearFounded"
              type="date"
              {...register('yearFounded')}
              className="custom-input"
            />
            {errors.yearFounded && (
              <p className="text-red-500 text-sm mt-1">
                {errors.yearFounded.message}
              </p>
            )}
          </div>

          {/* Keywords */}
          {/* Keywords */}
          <div>
            <label htmlFor="keywords" className="form-label">
              Keywords
            </label>
            <input
              id="keywords"
              type="text"
              {...register('keywords', {
                setValueAs: (value) =>
                  value
                    ? value.split(',').map((keyword: string) => keyword.trim())
                    : [],
              })}
              className="custom-input"
              placeholder="Enter keywords separated by commas"
            />
            {errors.keywords && (
              <p className="text-red-500 text-sm mt-1">
                {errors.keywords.message}
              </p>
            )}
          </div>
          {/* Capital share */}
          <div>
            <label htmlFor="capitalShare" className="form-label">
              Capital Share
            </label>
            <input
              id="capitalShare"
              type="number"
              {...register('capitalShare')}
              className="custom-input"
            />
            {errors.capitalShare && (
              <p className="text-red-500 text-sm mt-1">
                {errors.capitalShare.message}
              </p>
            )}
          </div>
          {/* Number of Employees */}
          <div>
            <label htmlFor="numberOfEmployees" className="form-label">
              Number of Employees
            </label>
            <input
              id="numberOfEmployees"
              type="number"
              {...register('numberOfEmployees')}
              className="custom-input"
            />
            {errors.numberOfEmployees && (
              <p className="text-red-500 text-sm mt-1">
                {errors.numberOfEmployees.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeAnOrganizationPage;
