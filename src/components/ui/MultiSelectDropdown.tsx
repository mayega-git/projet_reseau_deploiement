import { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { TagInterface } from '@/types/tag';

interface MultiSelectDropdownProps {
  choices: TagInterface[]; // Array of options to choose from
  selectedChoices: string[]; // Selected items state from parent (now using the tag names)
  setSelectedChoices: (choices: string[]) => void; // State setter function now expects an array of tag names (strings)
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  choices = [],
  selectedChoices = [],
  setSelectedChoices,
}) => {
  const [isOpen, setIsOpen] = useState(false); // Dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for click detection

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Handle selection/deselection of choices
  const toggleChoice = (choiceName: string) => {
    if (selectedChoices.includes(choiceName)) {
      // If the tag is already selected, remove it from the list
      setSelectedChoices(selectedChoices.filter((item) => item !== choiceName));
    } else {
      // If the tag is not selected, add it to the list
      setSelectedChoices([...selectedChoices, choiceName]);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown Input */}
      <div
        className="custom-input p-3 border h-[48px] cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex flex-wrap gap-2">
          {selectedChoices.length > 0 ? (
            selectedChoices.map((choice) => (
              <span
                key={choice} // Use the choice name as the key
                className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
              >
                {choice}
                <X
                  size={14}
                  className="ml-1 cursor-pointer hover:text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent dropdown toggle on remove
                    toggleChoice(choice); // Passing the choice name to remove it
                  }}
                  aria-label={`Remove ${choice}`}
                />
              </span>
            ))
          ) : (
            <span className="text-gray-400 paragraph-small-normal">
              Select options...
            </span>
          )}
        </div>
        <ChevronDown size={20} className="text-gray-500" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul
          className="absolute left-0 mt-1 w-full border border-gray-300 bg-white shadow-lg rounded-lg max-h-60 overflow-y-auto z-10"
          role="listbox"
          aria-multiselectable="true"
        >
          {choices.map((choice) => (
            <li
              key={choice.id} // Use choice.id for the key
              className="px-4 py-2 paragraph-xmedium-normal flex justify-between items-center cursor-pointer hover:bg-gray-100"
              onClick={() => toggleChoice(choice.name)} // Passing the choice name to toggle
              role="option"
              aria-selected={selectedChoices.includes(choice.name)} // Check if name is in selectedChoices
            >
              <div className="flex flex-col ">
                <p className="paragraph-medium-regular">{choice.name}</p>
                <p className="paragraph-small-regular text-black-300">
                  {choice.description}
                </p>
              </div>
              {selectedChoices.includes(choice.name) && (
                <Check size={16} className="text-blue-600" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
