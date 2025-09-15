'use client";'

import { Location, SearchParams } from "@/types";
import { useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { Calendar, DollarSign, Users } from "lucide-react";
import { LocationAutocomplete } from "./LocationAutocomplete";

interface SearchFormProps {
    onSearch: (params: SearchParams) => void;
    loading?: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        adults: 1,
        budget: '',
        travelStyle: 'budget' as const,
        interests: [] as string[]
    });

    const [selectedLocations, setSelectedLocations] = useState<{
        origin?: Location;
        destination?: Location;
      }>({});

    const travelStyles = [
        { value: 'luxury', label: 'Luxury' },
        { value: 'budget', label: 'Budget' },
        { value: 'family', label: 'Family' },
        { value: 'adventure', label: 'Adventure' },
        { value: 'business', label: 'Business' }
    ];
    
    const interestOptions = [
        'culture', 'food', 'museums', 'nightlife', 'shopping', 'nature', 'history', 'art'
    ];
    
    const handleInterestChange = (interest: string) => {
        setFormData(prev => ({
          ...prev,
          interests: prev.interests.includes(interest)
            ? prev.interests.filter(i => i !== interest)
            : [...prev.interests, interest]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.origin || !formData.destination || !formData.departureDate || !selectedLocations.destination) {
          alert('Please fill in all required fields');
          return;
        }
    
        const searchParams: SearchParams = {
            origin: {
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                iataCode: selectedLocations.origin?.iataCode!,
            },
            destination: {
                iataCode: selectedLocations.destination.iataCode,
                longitude: selectedLocations.destination.geoCode.longitude,
                latitude: selectedLocations.destination.geoCode.latitude
            },
            departureDate: formData.departureDate,
            returnDate: formData.returnDate || undefined,
            adults: formData.adults,
            travelStyle: formData.travelStyle,
            interests: formData.interests.length > 0 ? formData.interests : undefined,
            budget: formData.budget ? parseInt(formData.budget) : undefined
        };
    
        onSearch(searchParams);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Find Your Perfect Travel Package
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Origin & Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LocationAutocomplete
            value={formData.origin}
            onChange={(value, location) => {
              setFormData(prev => ({ ...prev, origin: value }));
              setSelectedLocations(prev => ({ ...prev, origin: location }));
            }}
            placeholder="Enter origin city or airport code"
            label="From"
          />
          
          <LocationAutocomplete
            value={formData.destination}
            onChange={(value, location) => {
              setFormData(prev => ({ ...prev, destination: value }));
              setSelectedLocations(prev => ({ ...prev, destination: location }));
            }}
            placeholder="Enter destination city or airport code"
            label="To"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Return Date (optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData(prev => ({ ...prev, returnDate: e.target.value }))}
                min={formData.departureDate || new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Adults & Travel Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Adults
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={formData.adults}
                onChange={(e) => setFormData(prev => ({ ...prev, adults: parseInt(e.target.value) }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Travel Style
            </label>
            <select
              value={formData.travelStyle}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => setFormData(prev => ({ ...prev, travelStyle: e.target.value as any }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {travelStyles.map(style => (
                <option key={style.value} value={style.value}>{style.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget (optional)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              placeholder="Enter your budget in USD"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Interests
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {interestOptions.map(interest => (
              <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.interests.includes(interest)}
                  onChange={() => handleInterestChange(interest)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">{interest}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Searching...</span>
            </>
          ) : (
            <span>Search Travel Packages</span>
          )}
        </button>
      </form>
    </div>
    );
}