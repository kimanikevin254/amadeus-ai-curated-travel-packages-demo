import { TravelPackage, SearchParams } from '@/types';
import { AIRecommendation } from './AIRecommendation';
import { FlightOptions } from './FlightOptions';
import { HotelOptions } from './HotelOptions';
import { ActivityList } from './ActivityList';

interface PackageResultsProps {
  package: TravelPackage;
  searchParams?: SearchParams;
}

export function PackageResults({ package: travelPackage }: PackageResultsProps) {
  return (
    <div className="space-y-8">

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