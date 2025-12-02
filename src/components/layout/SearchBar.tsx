import { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search by Title or Publisher...",
  className = "",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          relative flex items-center gap-3 px-4 py-3 rounded-xl
          bg-white border-2 transition-all duration-200
          ${isFocused ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-gray-200'}
          ${value ? 'pr-12' : ''}
        `}
      >
        <Search
          className={`w-5 h-5 transition-colors ${
            isFocused || value ? 'text-blue-600' : 'text-gray-400'
          }`}
        />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full outline-none text-gray-900 placeholder-gray-500 text-base font-medium"
        />

        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
}
