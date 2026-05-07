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
    <div className="flex flex-col relative" ref={selectRef}>
      <label className="text-p4yellow font-bold uppercase tracking-widest text-sm mb-2">{label}</label>
      

      <div 
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0} // Щоб можна було фокусуватися табом
        className={`bg-p4black text-white border-2 border-gray-600 p-3 font-bold cursor-pointer outline-none transition-all duration-300 flex justify-between items-center relative z-20 
          ${isOpen ? 'border-p4yellow bg-p4yellow text-black' : 'focus:border-p4yellow focus:bg-p4yellow focus:text-black'}
        `}
      >
        <span>{currentLabel}</span>
        {/* Іконка стрілочки */}
        <span className={`text-xs transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>▼</span>
      </div>

      {/* Випадаючий список варіантів */}
      <div className={`absolute top-full left-0 w-full mt-1 border-2 border-p4yellow bg-p4black shadow-2xl z-30 transition-all duration-300 ease-in-out origin-top 
        ${isOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-0 invisible'}
      `}>
        <ul className="max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <li 
              key={index}
              onClick={() => handleSelect(option.value)}
              className={`p-3 font-bold cursor-pointer transition-colors duration-200 
                ${value === option.value 
                  ? 'bg-p4yellow text-p4black' // Активний вибір
                  : 'text-white bg-p4black hover:bg-p4yellow hover:text-p4black'} // Наведення на інші
              `}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};