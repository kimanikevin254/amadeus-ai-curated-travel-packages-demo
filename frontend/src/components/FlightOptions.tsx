import { Plane, Clock, ArrowRight } from 'lucide-react';
import { FlightOffer } from '@/types';

interface FlightOptionsProps {
  flights: FlightOffer[];
}

export function FlightOptions({ flights }: FlightOptionsProps) {
  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return duration;
    
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (flights.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <Plane className="w-5 h-5 text-blue-600" />
          <span>Flight Options</span>
        </h3>
        <p className="text-gray-500">No flights available for your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
        <Plane className="w-5 h-5 text-blue-600" />
        <span>Flight Options</span>
      </h3>
      
      <div className="space-y-4">
        {flights.slice(0, 3).map((flight) => (
          <div key={flight.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plane className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-800">
                    ${flight.price.total} {flight.price.currency}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(flight.itineraries[0].duration)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">
                  {flight.oneWay ? 'One Way' : 'Round Trip'}
                </div>
                <div className="text-sm font-medium text-blue-600">
                  {flight.itineraries[0].segments.length} stop{flight.itineraries[0].segments.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            {/* Flight segments */}
            <div className="space-y-3">
              {flight.itineraries[0].segments.map((segment, index) => (
                <div key={index} className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="text-gray-800 font-medium">
                      {segment.departure.iataCode}
                    </div>
                    <div className="text-gray-500">
                      {formatTime(segment.departure.at)}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {formatDate(segment.departure.at)}
                    </div>
                  </div>
                  
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-gray-800 font-medium">
                      {segment.arrival.iataCode}
                    </div>
                    <div className="text-gray-500">
                      {formatTime(segment.arrival.at)}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {formatDate(segment.arrival.at)}
                    </div>
                  </div>
                  
                  <div className="text-gray-500 text-xs ml-auto">
                    {segment.carrierCode} • {formatDuration(segment.duration)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}