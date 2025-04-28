import { useState, ChangeEvent } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
    onSearch: (value: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [searchInput, setSearchInput] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);
        onSearch(value);
    };

    return (
        <div className="relative">
        <input
            type="text"
            placeholder="Search events..."
            className="w-full px-4 py-3 pl-12 rounded-lg border border-black text-black "
            value={searchInput}
            onChange={handleChange}
        />
        <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        </div>
    );
}