import { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { CategoryInterface } from '@/types/category';

interface SingleSelectDropdownProps {
  choices: CategoryInterface[] | string[]; // Peut accepter des objets ou des strings
  selectedChoiceId: string; // Selected choice (ID ou string)
  setSelectedChoiceId: (id: string) => void; // State setter function
}

const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  choices = [],
  selectedChoiceId = '',
  setSelectedChoiceId,
}) => {
  const [isOpen, setIsOpen] = useState(false); // Dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for click detection

  // Fonction helper pour normaliser les choix
  const normalizeChoices = (): CategoryInterface[] => {
    if (choices.length === 0) return [];
    
    // Vérifier si c'est un array de strings
    if (typeof choices[0] === 'string') {
      return (choices as string[]).map((choice) => ({
        id: choice,
        name: choice,
        description: '',
        domain: '',
        createdAt: '',
        updatedAt: '',
      }));
    }
    
    // Sinon, c'est un array de CategoryInterface
    return choices as CategoryInterface[];
  };

  const normalizedChoices = normalizeChoices();

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Handle selection of a choice
  const handleChoiceSelect = (category: CategoryInterface) => {
    setSelectedChoiceId(category.id); // Set the selected category ID
    setIsOpen(false); // Close the dropdown after selection
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
          {selectedChoiceId ? (
            <span
              key={selectedChoiceId} // Use selectedChoiceId for the key
              className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
            >
              {
                normalizedChoices.find((category) => category.id === selectedChoiceId)
                  ?.name
              }
              <X
                size={14}
                className="ml-1 cursor-pointer hover:text-blue-600"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent dropdown toggle on remove
                  setSelectedChoiceId(''); // Deselect choice
                }}
                aria-label="Remove selected category"
              />
            </span>
          ) : (
            <span className="text-gray-400 paragraph-small-normal">
              Select a options...
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
          aria-multiselectable="false"
        >
          {normalizedChoices.map((category) => (
            <li
              key={category.id} // Use category.id for the key
              className="px-4 py-2 paragraph-xmedium-normal flex justify-between items-center cursor-pointer hover:bg-gray-100"
              onClick={() => handleChoiceSelect(category)} // Set selected choice on click
              role="option"
              aria-selected={selectedChoiceId === category.id}
            >
              <div className="flex flex-col gap-1">
                <p className="paragraph-medium-regular">{category.name}</p>
                {category.description && (
                  <p className="paragraph-small-regular text-black-300">
                    {category.description}
                  </p>
                )}
              </div>
              {selectedChoiceId === category.id && (
                <Check size={16} className="text-blue-600" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SingleSelectDropdown;