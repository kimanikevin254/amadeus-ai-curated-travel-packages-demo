"use client";

import { useState, useEffect, useRef } from 'react';
import { MapPin, Plane } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { Location } from '@/types';
import { apiClient } from '@/lib/axios';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string, location?: Location) => void;
  placeholder: string;
  label: string;
}

export function LocationAutocomplete({ value, onChange, placeholder, label }: LocationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [justSelected, setJustSelected] = useState(false);

  const debouncedValue = useDebounce(value, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (justSelected) return;

    if (debouncedValue.length >= 3) {
      searchLocations(debouncedValue);
    } else {
      setOptions([]);
      setIsOpen(false);
    }
  }, [debouncedValue, justSelected]);

  const searchLocations = async (query: string) => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/city-search?keyword=${encodeURIComponent(query)}`);
       
      setOptions(data.data);
      setIsOpen(true);
    } catch (error) {
      console.error('Error searching locations:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (location: Location) => {
    setJustSelected(true);
    onChange(location.name, location);
    setIsOpen(false);
    setOptions([]);
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={value}
          onChange={(e) => { setJustSelected(false); onChange(e.target.value) }}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          onFocus={() => setIsOpen(options.length > 0)}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {isOpen && options.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((location) => (
            <button
              key={location.iataCode ? location.iataCode : `${location.name}-${location.geoCode.latitude}-${location.geoCode.longitude}`}
              onClick={() => handleSelect(location)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start space-x-3 border-b border-gray-100 last:border-b-0"
            >
              <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">
                  {location.name}
                </div>
                <div className="text-sm text-gray-500">
                  {location.address.countryCode}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}