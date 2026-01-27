import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../../constants/icons';

const CATEGORIES = [
    'CV & Cover Letter',
    'Intersnships & Volunteering',
    'Job Search',
    'Career Guidance & Appointment',
    'Workshops & Events',
    "General",
]

interface CategoryDropdownProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function CategoryDropdown({ value, onChange, placeholder = 'Choose category' }: CategoryDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (category: string) => {
        onChange(category);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-sm lg:btn-md w-full justify-between bg-white shadow-none hover:bg-gray-50"
            >
                <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value || placeholder}</span>
                <FontAwesomeIcon
                    icon={icons.icon.downChevron}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <ul
                    className="absolute z-10 mt-2 w-full bg-white border border-gray-200 
                    rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                    {CATEGORIES.map((category) => (
                        <li key={category}>
                            <button
                                type="button"
                                onClick={() => handleSelect(category)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 
                                    transition-colors ${value === category ? 'bg-blue-100 text-blue-900 font-medium' : 'text-gray-700'}`}
                            >
                                {category}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
