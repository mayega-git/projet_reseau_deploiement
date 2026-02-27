/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { GlobalNotifier } from '../ui/GlobalNotifier';
import TextArea from '../ui/textarea';

interface RefuseDialogProps {
  type: string;
  id: string;
  description: string;
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const RefuseDialog: React.FC<RefuseDialogProps> = ({
  type,
  id,
  description,

  showDialog,
  setShowDialog,
}) => {
  const [textValue, setTextValue] = useState({
    value: '',
  });
  //   const handleDelete = async (id: string) => {
  //     if (type === 'blog') {
  //       try {
  //         const response = await fetch(
  //           `${EducationServiceRoutes.category}/${id}`,
  //           {
  //             method: 'DELETE',
  //             headers: { 'Content-Type': 'application/json' },
  //             body: JSON.stringify({ tagId: id }),
  //           }
  //         );

  //         if (response.ok) {
  //           GlobalNotifier('Blog archived successfully', 'success');
  //           setShowDialog(false);
  //           window.location.reload();
  //         }
  //       } catch (err) {
  //         console.error('Error archiving post', err);
  //       } finally {
  //         setShowDialog(false);
  //       }
  //     } else if (type === 'podcast') {
  //       try {
  //         const response = await fetch(
  //           `${EducationServiceRoutes.podcasts}/${id}`,
  //           {
  //             method: 'DELETE',
  //             headers: { 'Content-Type': 'application/json' },
  //             body: JSON.stringify({ tagId: id }),
  //           }
  //         );

  //         if (response.ok) {
  //           GlobalNotifier('Podcast archived successfully', 'success');
  //           setShowDialog(false);
  //           window.location.reload();
  //         }
  //       } catch (err) {
  //         console.error('Error archiving post', err);
  //       } finally {
  //         setShowDialog(false);
  //       }
  //     }
  //   };

  return (
    <>
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)] z-50">
          <div className="flex flex-col gap-6 bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6">
            {/* Dialog Header */}
            <div className="flex flex-col gap-0">
              <h2 className="paragraph-large-medium font-semibold">
                Decline publication
              </h2>
              <p className="text-small-paragraph text-black-300">
                {description}
              </p>
            </div>

            <div>
              <TextArea
                label="Refusal motif"
                height="90px"
                value={textValue.value}
                placeholder=""
                maxWords={50}
                onChange={(value) =>
                  setTextValue({ ...textValue, value: value })
                }
              />
            </div>

            {/* Dialog Footer */}
            <div className="flex justify-end gap-2">
              <Button
                variant={'outline'}
                className="order rounded-md text-gray-700"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>

              <Button
                className=" bg-red-600 hover:bg-red-700 text-white rounded-md"
                // onClick={() => handleDelete(id)}
              >
                Decline publication
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RefuseDialog;
