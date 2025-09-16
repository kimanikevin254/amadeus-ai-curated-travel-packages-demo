'use client';

import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PackageResults } from "@/components/PackageResults";
import SearchForm from "@/components/SearchForm";
import { apiClient } from "@/lib/axios";
import { SearchParams, TravelPackage } from "@/types";
import { Compass, Heart, Plane } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TravelPackage | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams | undefined>(undefined);

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.post('/packages', params);

      setResults(data.data);
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : 'An error occurred while searching for travel packages'); 
    } finally {
      setLoading(false);
      setSearchParams(params);
    }
  }

  const handleRetry = () => {
    if (searchParams) {
      handleSearch(searchParams);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Amadeus AI-Powered Travel Packages</h1>
              <p className="text-gray-600">Discover personalized travel experiences powered by Amadeus and AI</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!results && !loading && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex justify-center space-x-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Plane className="w-6 h-6 text-blue-600" />
                </div>
                <div className="bg-teal-100 p-3 rounded-full">
                  <Heart className="w-6 h-6 text-teal-600" />
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Compass className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Your Perfect Journey Awaits
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Let our AI create personalized travel packages tailored to your preferences, 
                budget, and travel style. From flights to hotels to unique experiences, 
                we&apos;ve got everything covered.
              </p>
            </div>

            <SearchForm onSearch={handleSearch} loading={loading} />
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Plane className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Flight Search</h3>
                <p className="text-gray-600">Find the best flights with optimal timing and pricing for your travel style.</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="bg-teal-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Recommendations</h3>
                <p className="text-gray-600">Get personalized suggestions based on your interests and preferences.</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Compass className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Complete Packages</h3>
                <p className="text-gray-600">Everything you need in one place: flights, hotels, and unique experiences.</p>
              </div>
            </div>
          </>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size="lg" />
            <h3 className="text-lg font-semibold text-gray-700 mt-4">Searching for your perfect trip...</h3>
            <p className="text-gray-500 mt-2">Our AI is analyzing available options to create your personalized package</p>
          </div>
        )}

        {error && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}

        {results && (
          <PackageResults 
            package={results} 
          />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Compass className="w-6 h-6" />
            <span className="text-lg font-semibold">AI Travel Packages</span>
          </div>
          <p className="text-gray-400">
            Discover the world with personalized AI-powered travel recommendations
          </p>
        </div>
      </footer>
    </main>
  );
}
