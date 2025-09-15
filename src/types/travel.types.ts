export interface SearchParams {
    origin: {
        iataCode: string;
    };
    destination: {
        iataCode: string;
        latitude: number;
        longitude: number;
    };
    departureDate: string;
    returnDate?: string;
    adults: number;
    budget?: number;
    travelStyle: 'luxury' | 'budget' | 'family' | 'adventure' | 'business';
}

export interface FlightOffer {
    id: string;
    oneWay: boolean;
    price: {
        total: string;
        currency: string;
    };
    itineraries: {
        duration: string;
        segments: {
            departure: {
                iataCode: string;
                at: string;
            };
            arrival: {
                iataCode: string;
                at: string;
            };
            carrierCode: string;
            aircraft: { code: string };
            duration: string;
        }[];
    }[];
}

export interface HotelOffer {
    hotel: {
        hotelId: string;
        name: string;
    };
    offers: {
        id: string;
        price: {
            currency: string;
            total: string;
        };
        room: {
            type: string;
            typeEstimated: { category: string; beds: number; bedType: string; }
            description: { text: string; }
        };
    }[];
}

export interface Activity {
    id: string;
    name: string;
    shortDescription: string;
    price: {
        amount: string;
        currencyCode: string;
    };
    pictures: string[];
}