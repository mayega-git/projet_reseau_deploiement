/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CreateTagInterface } from '@/types/tag';
import { Description } from '@radix-ui/react-dialog';
import CustomButton from '../ui/customButton';
import { useRouter } from 'next/navigation';
import { GlobalNotifier } from '../ui/GlobalNotifier';
import TextArea from '../ui/textarea';

const schema = yup
  .object({
    lastName: yup
      .string()
      .min(2, 'Last Name must be at least 2 characters')
      .required('Last Name is required'),
    firstName: yup
      .string()
      .min(2, 'First Name must be at least 2 characters')
      .required('First Name is required'),
    department: yup
      .string()
      .min(3, 'Department must be at least 3 characters')
      .required('Department is required'),
    employeeRole: yup
      .string()
      .oneOf(['OWNER', 'EMPLOYEE'], 'Invalid Role')
      .required('Employee Role is required'),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

interface CreateAuthorDialogProps {
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  orgId: string;
}

const CreateNewAuthor: React.FC<CreateAuthorDialogProps> = ({
  setShowDialog,
  showDialog,
  orgId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  return (
    <Dialog open={showDialog} onOpenChange={() => setShowDialog(!showDialog)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="">
          <DialogTitle className="my-1">Create a New Author</DialogTitle>
          {/* <DialogDescription>
              Une fois créée, le système sera initialisé
            </DialogDescription> */}
          <div
            style={{
              borderBottom: '1px solid var(--grey-300) !important',
            }}
          />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Last Name */}
          <div className="mb-4">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              className={`custom-input ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* First Name */}
          <div className="mb-4">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              className={`custom-input ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Department */}
          <div className="mb-4">
            <label htmlFor="department" className="form-label">
              Department
            </label>
            <input
              id="department"
              type="text"
              className={`custom-input ${
                errors.department ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('department')}
            />
            {errors.department && (
              <p className="text-red-500 text-sm mt-1">
                {errors.department.message}
              </p>
            )}
          </div>

          {/* Employee Role */}
          <div className="mb-4">
            <label htmlFor="employeeRole" className="form-label">
              Employee Role
            </label>
            <select
              id="employeeRole"
              className={`custom-input ${
                errors.employeeRole ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('employeeRole')}
            >
              <option value="OWNER">Owner</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
            {errors.employeeRole && (
              <p className="text-red-500 text-sm mt-1">
                {errors.employeeRole.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 w-full">
            <CustomButton className="w-full" type="submit">
              Submit
            </CustomButton>
          </div>
        </form>
        <DialogFooter className="">
          <DialogClose className="" asChild></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewAuthor;
