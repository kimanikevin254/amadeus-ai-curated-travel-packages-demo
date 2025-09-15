import { Calendar, Users, MapPin } from 'lucide-react';
import { TravelPackage, SearchParams } from '@/types';
import { AIRecommendation } from './AIRecommendation';
import { FlightOptions } from './FlightOptions';
import { HotelOptions } from './HotelOptions';
import { ActivityList } from './ActivityList';

interface PackageResultsProps {
  package: TravelPackage;
  searchParams?: SearchParams;
}

export function PackageResults({ package: travelPackage, searchParams }: PackageResultsProps) {
  console.log(travelPackage);
  const calculateTotalPrice = () => {
    const flightPrice = travelPackage.flights.length > 0 
      ? parseFloat(travelPackage.flights[0].price.total) * searchParams!.adults
      : 0;
    
    const hotelPrice = travelPackage.hotels.length > 0
      ? parseFloat(travelPackage.hotels[0].offers[0].price.total) * 5 // Assuming 5 nights
      : 0;
    
    const activityPrice = travelPackage.activities.slice(0, 3).reduce((sum, activity) => 
      sum + parseFloat(activity.price.amount) * searchParams!.adults, 0
    );
    
    return (flightPrice + hotelPrice + activityPrice).toLocaleString();
  };

  const calculateDuration = () => {
    if (searchParams!.returnDate && searchParams!.departureDate) {
      const start = new Date(searchParams!.departureDate);
      const end = new Date(searchParams!.returnDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    }
    return 'Open-ended';
  };

  return (
    <div className="space-y-8">
      {/* Package Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-6">Your Travel Package</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6" />
            <div>
              <div className="text-sm opacity-90">Destination</div>
              <div className="text-lg font-semibold">{searchParams!.destination.iataCode}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6" />
            <div>
              <div className="text-sm opacity-90">Duration</div>
              <div className="text-lg font-semibold">{calculateDuration()}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6" />
            <div>
              <div className="text-sm opacity-90">Travelers</div>
              <div className="text-lg font-semibold">
                {searchParams!.adults} Adult{searchParams!.adults > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Estimated Total</div>
              <div className="text-2xl font-bold">${calculateTotalPrice()}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Travel Style</div>
              <div className="text-lg font-semibold capitalize">{searchParams!.travelStyle}</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation - Most Prominent */}
      <AIRecommendation recommendation={travelPackage.aiRecommendation} />

      {/* Travel Options */}
      <div className="grid grid-cols-1 gap-8">
        <FlightOptions flights={travelPackage.flights} />
        <HotelOptions hotels={travelPackage.hotels} />
        <ActivityList activities={travelPackage.activities} />
      </div>
    </div>
  );
}