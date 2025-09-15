import { Camera, DollarSign } from 'lucide-react';
import { Activity } from '@/types';

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <Camera className="w-5 h-5 text-orange-600" />
          <span>Activities & Experiences</span>
        </h3>
        <p className="text-gray-500">No activities available for your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
        <Camera className="w-5 h-5 text-orange-600" />
        <span>Activities & Experiences</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map((activity) => (
          <div key={activity.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {activity.pictures && activity.pictures.length > 0 && (
              <div className="aspect-video bg-gray-200">
                <img
                  src={activity.pictures[0]}
                  alt={activity.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                {activity.name}
              </h4>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-orange-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">
                    {activity.price.amount} {activity.price.currencyCode}
                  </span>
                </div>
              </div>
              
              {/* <div
                className="text-gray-600 text-sm mb-4 line-clamp-3"
                dangerouslySetInnerHTML={{ 
                  __html: activity.shortDescription.replace(/<[^>]*>/g, '') 
                }}
              /> */}
              
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}