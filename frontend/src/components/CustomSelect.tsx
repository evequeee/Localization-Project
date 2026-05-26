import { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (name: string, value: string) => void;
}

export const CustomSelect = ({ label, name, value, options, onChange }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const currentLabel = options.find(opt => opt.value === value)?.label || value;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(name, optionValue);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col relative z-50" ref={selectRef}>
      <label className="text-p4-yellow font-black uppercase tracking-widest text-sm mb-3">
        {label}
      </label>
      
      {/* Main select trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        className={`bg-p4-bg text-p4-white border-4 border-black p-3 font-bold 
                    cursor-pointer outline-none transition-all duration-200 flex justify-between 
                    items-center relative z-20
                    ${isOpen 
                      ? 'bg-p4-yellow text-p4-bg border-p4-yellow shadow-p4' 
                      : 'hover:shadow-p4 focus:shadow-p4 focus:border-p4-yellow'}`}
      >
        <span className="font-black">{currentLabel}</span>
        {/* Arrow icon */}
        <span className={`text-sm transform transition-transform duration-300 
                        ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      </div>

      {/* Dropdown options */}
      <div className={`absolute top-full left-0 w-full mt-2 border-4 border-p4-yellow 
                      bg-p4-bg shadow-p4-xl z-30 transition-all duration-300 
                      ease-in-out origin-top transform
                      ${isOpen 
                        ? 'opacity-100 scale-y-100 visible translate-y-0' 
                        : 'opacity-0 scale-y-0 invisible -translate-y-2'}`}>
        <ul className="max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <li 
              key={index}
              onClick={() => handleSelect(option.value)}
              className={`p-3 font-black uppercase tracking-wider cursor-pointer 
                          transition-all duration-150
                          ${value === option.value 
                            ? 'bg-p4-yellow text-p4-bg border-l-4 border-p4-white' 
                            : 'text-p4-white bg-p4-bg hover:bg-p4-dark hover:text-p4-yellow'}`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};