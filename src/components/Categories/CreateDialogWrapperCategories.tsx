'use client';
import { Plus } from 'lucide-react';

import { Button } from '../ui/button';
import { useState } from 'react';
import CreateCategoryDialog from './CreateCategoryDialog';

const CreateDialogWrapperCategories = () => {
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
        Create new Category
      </Button>

      <CreateCategoryDialog
        showTagDialog={showTagDialog}
        setShowDialog={setShowDialog}
      />
    </>
  );
};

export default CreateDialogWrapperCategories;
