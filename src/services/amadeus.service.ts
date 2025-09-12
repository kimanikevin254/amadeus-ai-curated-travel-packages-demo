import { amadeus } from "../config/amadeus";
import { SearchParams } from "../types/travel.types";
import { logger } from "../utils/logger";

export class AmadeusService {
    async searchFlights(searchParams: SearchParams): Promise<any> {
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
}

export const amadeusService = new AmadeusService();