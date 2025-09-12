export interface SearchParams {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    budget?: number;
    travelStyle: 'luxury' | 'budget' | 'family' | 'adventure' | 'business';
}

export interface FlightOffer {
    type: string;
    id: string;
    source: string;
    instantTicketingRequired: boolean;
    nonHomogeneous: boolean;
    oneWay: boolean;
    lastTicketingDate: string;
    lastTicketingDateTime: string;
    numberOfBookableSeats: number;
    itineraries: Itinerary[];
    price: Price;
    pricingOptions: PricingOptions;
    validatingAirlineCodes: string[];
    travelerPricings: TravelerPricing[];
}

export interface Itinerary {
    duration: string;
    segments: Segment[];
}

export interface Segment {
    departure: LocationInfo;
    arrival: LocationInfo;
    carrierCode: string;
    number: string;
    aircraft: { code: string };
    operating?: { carrierCode: string };
    duration: string;
    id: string;
    numberOfStops: number;
    blacklistedInEU: boolean;
}

export interface LocationInfo {
    iataCode: string;
    terminal?: string;
    at: string; // ISO 8601 date-time string
}

export interface Price {
    currency: string;
    total: string;
    base: string;
    fees?: { amount: string; type: string }[];
    grandTotal?: string;
}

export interface PricingOptions {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
}

export interface TravelerPricing {
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: Price;
    fareDetailsBySegment: FareDetailsBySegment[];
}

export interface FareDetailsBySegment {
    segmentId: string;
    cabin: string;
    fareBasis: string;
    brandedFare?: string;
    class: string;
    includedCheckedBags?: { weight: number; weightUnit: string; quantity: number };
}