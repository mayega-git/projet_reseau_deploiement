/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

interface TextAreaProps {
  label?: string; // Label for the textarea (optional)
  placeholder?: string; // Placeholder text
  maxWords?: number; // Maximum word count limit
  rows?: number; // Number of visible rows
  height?: string; // Height of the textarea
  id?: string;
  value: string; // Controlled value
  onChange: (value: string) => void; // Function to handle text input changes
}

const TextArea: React.FC<TextAreaProps> = ({
  height = '',
  placeholder = 'Type here...',
  maxWords = 100,
  rows = 5,
  id,
  value, // Now the component accepts a value prop
  onChange,
}) => {
  const [error, setError] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    const wordsArray = inputText.trim().split(/\s+/).filter(Boolean); // Split text into words and filter out empty strings
    const currentWordCount = wordsArray.length;

    // if (currentWordCount > maxWords) {
    //   setError(`Maximum word limit of ${maxWords} exceeded!`);
    //   return; // Prevent updating state if over limit
    // }

    // setError('');
    // setWordCount(currentWordCount);
    onChange(inputText); // Update parent state
  };

  return (
    <div className="w-full">
      <textarea
        id={id}
        value={value}
        onChange={handleChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full custom-input"
        style={{ minHeight: height }}
      />

      {/* Word Count and Error Message */}
      {/* <div className="flex justify-between items-center mt-1 text-sm">
        <span
          className={wordCount > maxWords ? 'text-red-500' : 'text-black-300'}
        >
          {wordCount} / {maxWords} words
        </span>
        {error && <p className="text-red-500">{error}</p>}
      </div> */}
    </div>
  );
};

export default TextArea;
