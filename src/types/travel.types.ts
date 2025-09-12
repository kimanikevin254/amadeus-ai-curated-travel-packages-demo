export interface SearchParams {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    budget?: number;
    travelStyle: 'luxury' | 'budget' | 'family' | 'adventure' | 'business';
}

