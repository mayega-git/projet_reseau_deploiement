/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import CustomButton from '@/components/ui/customButton';

import { Plus } from 'lucide-react';
import CreateTagDialog from '@/components/Tags/CreateTagDialog';
import { Button } from '../ui/button';

const CreateTagDialogWrapper = () => {
  const [showTagDialog, setShowDialog] = useState(false);

  const ToggleTagDialog = () => {
    setShowDialog((prev) => !prev);
  };

  return (
    <>
      <Button
        onClick={ToggleTagDialog}
        
        // variant="primary"
        className="w-fit"
      >
        <Plus />
        Create new Tag
      </Button>

      <CreateTagDialog
        showTagDialog={showTagDialog}
        setShowDialog={setShowDialog}
      />
    </>
  );
};

export default CreateTagDialogWrapper;
