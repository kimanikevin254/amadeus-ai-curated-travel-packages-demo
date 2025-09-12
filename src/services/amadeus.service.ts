import { amadeus } from "../config/amadeus";
import { FlightOffer, SearchParams } from "../types/travel.types";
import { logger } from "../utils/logger";

export class AmadeusService {
    async searchFlights(searchParams: SearchParams): Promise<FlightOffer[]> {
        try {
            const params = {
                originLocationCode: searchParams.origin,
                destinationLocationCode: searchParams.destination,
                departureDate: searchParams.departureDate,
                adults: searchParams.adults,
            };

            if (searchParams.returnDate) {
                Object.assign(params, { returnDate: searchParams.returnDate });
            }

            const response = await amadeus.shopping.flightOffersSearch.get({
                ...params,
                max: 5,
                currencyCode: 'USD'
            })

            return response.data;
        } catch (error) {
            logger.error('Flight search failed', error);
            throw new Error('Flight search failed');
        }
    }

    async searchHotels(destination: string, checkInDate: string, checkOutDate?: string) {
        try {
            // First, get hotel IDs in the traveller's destination
            const hotelIds = await amadeus.referenceData.locations.hotels.byCity.get({
                cityCode: destination,
            });

            if (!hotelIds.data || hotelIds.data.length === 0) {
                return [];
            }

            // Get hotel IDs for the first 3 hotels
            const selectedHotelIds = hotelIds.data.slice(0, 3).map((hotel: any) => hotel.hotelId).join(',');

            // Now, search for hotel offers using the retrieved hotel IDs
            const response = await amadeus.shopping.hotelOffersSearch.get({
                hotelIds: selectedHotelIds,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
            });

            return response.data;
        } catch (error) {
            logger.error('Hotel search failed', error);
            throw new Error('Hotel search failed');
        }
    }
}

export const amadeusService = new AmadeusService();