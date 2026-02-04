/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import TextArea from '../ui/textarea';
import CustomButton from '../ui/customButton';
import { rateApplication } from '@/actions/education';
import { GlobalNotifier } from '../ui/GlobalNotifier';

interface RatingModalProps {
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const RatingModal: React.FC<RatingModalProps> = ({
  showDialog,
  setShowDialog,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [textValue, setTextValue] = useState({
    value: '',
  });

  const handleRatingClick = (selectedRating: number) => {
    console.log('Selected Rating:', selectedRating);
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (user && rating) {
      try {
        const ok = await rateApplication(
          user.id,
          '309e9fde-5f29-4c31-b515-ce54de2e4223',
          rating,
          textValue.value,
        );
        if (ok) {
          GlobalNotifier('Thank you for rating us', 'success');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setShowDialog(false);
      }
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Rate Our App</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {/* Star Rating Section */}
          <div className="flex justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRatingClick(star)}
                className="p-2 rounded-full transition-colors"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Feedback TextArea Section */}
          <div>
            <p className="form-label mb-3">
              Leave a feedback{' '}
              <span className="paragraph-small-medium text-black-300">
                (Optional)
              </span>
            </p>
            <TextArea
              label="Feedback"
              height="90px"
              value={textValue.value}
              placeholder="Share your feedback..."
              maxWords={50}
              onChange={(value) => setTextValue({ ...textValue, value })}
            />
          </div>
        </div>

        {/* Dialog Footer with Submit Button */}
        <DialogFooter className="mt-4 justify-end">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <CustomButton
            disabled={rating === 0}
            type="button"
            variant="primary"
            onClick={handleSubmit}
          >
            Submit
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
