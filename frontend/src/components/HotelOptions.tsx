import { Building2, Bed, MapPin } from 'lucide-react';
import { HotelOffer } from '@/types';

interface HotelOptionsProps {
  hotels: HotelOffer[];
}

export function HotelOptions({ hotels }: HotelOptionsProps) {
  if (hotels.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-teal-600" />
          <span>Hotel Options</span>
        </h3>
        <p className="text-gray-500">No hotels available for your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
        <Building2 className="w-5 h-5 text-teal-600" />
        <span>Hotel Options</span>
      </h3>
      
      <div className="space-y-4">
        {hotels.map((hotel) => (
          <div key={hotel.hotel.hotelId} className="border border-gray-200 rounded-lg p-6 hover:border-teal-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {hotel.hotel.name}
                </h4>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>Hotel ID: {hotel.hotel.hotelId}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-teal-600">
                  €{hotel.offers[0].price.total}
                </div>
                <div className="text-sm text-gray-500">per night</div>
              </div>
            </div>
            
            {/* Room details */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Bed className="w-4 h-4" />
                    <span>
                      {hotel.offers[0]?.room?.typeEstimated?.beds} 
                      {hotel.offers[0]?.room?.typeEstimated?.bedType?.toLowerCase()} bed
                      {hotel.offers[0]?.room?.typeEstimated?.beds > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {hotel.offers[0]?.room?.typeEstimated?.category?.replace(/_/g, ' ')?.toLowerCase()}
                  </div>
                </div>
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}