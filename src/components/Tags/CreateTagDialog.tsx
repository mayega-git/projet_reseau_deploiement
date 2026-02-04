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
import { createTag } from '@/actions/education';
import { useRouter } from 'next/navigation';
import { GlobalNotifier } from '../ui/GlobalNotifier';
import TextArea from '../ui/textarea';

// Définir le type Domain correspondant à l'enum Java
export type Domain = 'TAXI' | 'AGRICULTURE';

export interface CreateTagInterface {
  name: string;
  description: string;
  domain: Domain;
}

interface CreateTagDialogProps {
  showTagDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateTagDialog: React.FC<CreateTagDialogProps> = ({
  showTagDialog,
  setShowDialog,
}) => {
  const [form, setFormData] = useState<CreateTagInterface>({
    name: '',
    description: '',
    domain: 'TAXI',
  });
  const [error, setError] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleOnChange = (name: keyof CreateTagInterface, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.description) newErrors.description = 'Description is required';
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await createTag(form);

      if (result.ok) {
        GlobalNotifier('Tag created successfully', 'success');
        setShowDialog(false);
        router.refresh();
      } else {
        GlobalNotifier(`Failed to create tag: ${result.error || 'Unknown error'}`, 'error');
      }
    } catch (err) {
      GlobalNotifier('Failed to create tag', 'error');
    }
  };

  return (
    <Dialog open={showTagDialog} onOpenChange={() => setShowDialog(!showTagDialog)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Tag</DialogTitle>
          <div style={{ borderBottom: '1px solid var(--grey-300) !important' }} />
        </DialogHeader>

        <form className="flex flex-col gap-4">
          {/* Name */}
          <div className="grid flex-1 gap-2">
            <label className="form-label" htmlFor="name">Name</label>
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
            <label className="form-label" htmlFor="domain">Domain</label>
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
            <label className="form-label" htmlFor="description">Description</label>
            <TextArea
              value={form.description}
              label="Description"
              height="80px"
              maxWords={50}
              onChange={(value) => handleOnChange('description', value)}
            />
            {error.description && <p className="text-redTheme paragraph-xmedium-medium">{error.description}</p>}
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

export default CreateTagDialog;
