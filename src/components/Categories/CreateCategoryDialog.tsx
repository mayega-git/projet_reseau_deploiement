/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CustomButton from '../ui/customButton';
import { createCategory } from '@/actions/education';
import { useRouter } from 'next/navigation';
import { GlobalNotifier } from '../ui/GlobalNotifier';
import TextArea from '../ui/textarea';

export type Domain = 'TAXI' | 'AGRICULTURE';

export interface CreateCategoryInterface {
  name: string;
  description: string;
  domain: Domain;
}

interface CreateCategoryDialogProps {
  showTagDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateCategoryDialog: React.FC<CreateCategoryDialogProps> = ({
  showTagDialog,
  setShowDialog,
}) => {
  const [form, setFormData] = useState<CreateCategoryInterface>({
    name: '',
    description: '',
    domain: 'TAXI',
  });

  const [error, setError] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleOnChange = (name: keyof CreateCategoryInterface, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const ok = await createCategory(form);

      if (ok) {
        GlobalNotifier('Category created successfully', 'success');
        setShowDialog(false);
        window.location.reload();
      } else {
        GlobalNotifier('Failed to create category', 'error');
      }
    } catch (err) {
      GlobalNotifier('Failed to create category', 'error');
    }
  };

  return (
    <Dialog open={showTagDialog} onOpenChange={() => setShowDialog(!showTagDialog)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Category</DialogTitle>
          <div style={{ borderBottom: '1px solid var(--grey-300) !important' }} />
        </DialogHeader>
        <form className="flex flex-col gap-4">
          {/* Name */}
          <div className="grid flex-1 gap-2">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={(e) => handleOnChange('name', e.target.value)}
              className="custom-input"
            />
            {error.name && <p className="text-redTheme paragraph-xmedium-medium">{error.name}</p>}
          </div>

          {/* Domain */}
          <div className="grid flex-1 gap-2">
            <label className="form-label" htmlFor="domain">
              Domain
            </label>
            <select
              id="domain"
              value={form.domain}
              onChange={(e) => handleOnChange('domain', e.target.value)}
              className="custom-input"
            >
              <option value="TAXI">TAXI</option>
              <option value="AGRICULTURE">AGRICULTURE</option>
            </select>
          </div>

          {/* Description */}
          <div className="grid flex-1 gap-2">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <TextArea
              value={form.description}
              label="Description"
              height="80px"
              placeholder=""
              maxWords={50}
              onChange={(value) => handleOnChange('description', value)}
            />
            {error.description && (
              <p className="text-redTheme paragraph-xmedium-medium">{error.description}</p>
            )}
          </div>
        </form>

        <DialogFooter className="mt-4 justify-end">
          <DialogClose asChild />
          <CustomButton type="button" variant="primary" onClick={handleSubmit}>
            Create
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
