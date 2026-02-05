'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CustomButton from '../ui/customButton';
import { createTag, fetchAllDomains } from '@/actions/education';
import { useRouter } from 'next/navigation';
import { GlobalNotifier } from '../ui/GlobalNotifier';
import TextArea from '../ui/textarea';

export interface CreateTagInterface {
  name: string;
  description: string;
  domain: string;
}

interface CreateTagDialogProps {
  showTagDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateTagDialog: React.FC<CreateTagDialogProps> = ({
  showTagDialog,
  setShowDialog,
}) => {
  const [domains, setDomains] = useState<string[]>([]);
  const [loadingDomains, setLoadingDomains] = useState(true);
  const [form, setFormData] = useState<CreateTagInterface>({
    name: '',
    description: '',
    domain: '',
  });
  const [error, setError] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  // Fetch domains on mount
  useEffect(() => {
    const loadDomains = async () => {
      try {
        const fetchedDomains = await fetchAllDomains();
        setDomains(fetchedDomains);
        // Set default domain to first value if available
        if (fetchedDomains.length > 0) {
          setFormData((prev) => ({ ...prev, domain: fetchedDomains[0] }));
        }
      } catch (err) {
        console.error('Failed to fetch domains:', err);
      } finally {
        setLoadingDomains(false);
      }
    };
    loadDomains();
  }, []);

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
    if (!form.domain) newErrors.domain = 'Domain is required';
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
              disabled={loadingDomains}
            >
              {loadingDomains ? (
                <option value="">Loading domains...</option>
              ) : domains.length === 0 ? (
                <option value="">No domains available</option>
              ) : (
                domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))
              )}
            </select>
            {error.domain && <p className="text-redTheme paragraph-xmedium-medium">{error.domain}</p>}
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

