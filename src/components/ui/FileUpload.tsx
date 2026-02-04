/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useId, useState } from 'react';
import { Minus, CircleMinus } from 'lucide-react';

interface FileUploadProps {
  type: 'Image' | 'Audio' | 'File';
  onFileSelect: (fileData: {
    name: string;
    size: number;
    data: string;
  }) => void;
  // Function to handle file selection
  maxSizeMB?: number; // Maximum file size in MB (default: 5)
  acceptedFormats?: string[]; // Allowed audio formats (default: MP3 & WAV)
  id: string; // Unique identifier for the input
}



const FileUpload: React.FC<FileUploadProps> = ({
  id,
  type,
  onFileSelect,
  maxSizeMB = 5,
  acceptedFormats = ['audio/mpeg', 'audio/wav'],
}) => {
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    data: string;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Ensure a file is selected

    if (!file) return;

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      setError(
        `Invalid file format. Only ${acceptedFormats.join(', ')} are allowed.`
      );
      setSelectedFile(null);
      return;
    }

    // Validate file size (Convert MB to bytes)
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit.`);
      setSelectedFile(null);
      return;
    }

    // If all validations pass
    // Read file and pass data
    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      const fileData = {
        name: file.name,
        size: file.size,
        data: reader.result as string, // Convert to base64 or URL
      };

      setSelectedFile(fileData); // Update state
      onFileSelect(fileData); // Immediately pass the data to parent
    };

    reader.readAsDataURL(file);
  };

  // useEffect(() => {
  //   console.log(selectedFile, 'selectedFile');
  // }, [selectedFile]);

  const handleDelete = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full">
      <div
        // style={{ backgroundColor: 'rgba(239, 235, 255, .1)' }}
        className="w-full h-[100px] rounded-md bg-gray-50 border-dashed border-2 border-grey-300 flex items-center flex-col justify-center gap-6"
      >
        <div className="flex flex-col gap-2 items-center">
          <input
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleFileChange}
            className="hidden"
            id={id} // Unique ID per instance
          />
          <label
            htmlFor={id}
            className="cursor-pointer paragraph-medium-medium text-primaryPurple-500"
          >
            + Upload {type}
          </label>
          <p className="paragraph-xsmall-normal text-black-300">
            Accepted formats: {acceptedFormats.join(', ')} | Max size:{' '}
            {maxSizeMB}
            MB
          </p>
        </div>
      </div>

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="flex items-center gap-1 my-2">
          <div className=" paragraph-xmedium-normal text-black-500">
            <span className="paragraph-xmedium-medium">Selected File:</span>{' '}
            {selectedFile.name}
          </div>
          <CircleMinus
            onClick={handleDelete}
            size={20}
            className="text-redTheme cursor-pointer"
          />
        </div>
      )}

      {error && <p className="mt-2 text-redTheme text-sm">{error}</p>}
    </div>
  );
};

export default FileUpload;
