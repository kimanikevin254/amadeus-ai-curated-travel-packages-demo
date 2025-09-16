import { amadeus } from "../config/amadeus";
import { Activity, CitySearch, FlightOffer, HotelOffer, SearchParams } from "../types";
import { logger } from "../utils/logger";

export class AmadeusService {
    async searchCities(keyword: string): Promise<CitySearch[]> {
        try {
            const response = await amadeus.referenceData.locations.cities.get({
                keyword,
                max: 10,
            });

            return response.data || [];
        } catch (error) {
            logger.error('City search failed', error);
            throw new Error('City search failed');
        }
    }

    async searchFlights(searchParams: SearchParams): Promise<FlightOffer[]> {
        try {
            const params = {
                originLocationCode: searchParams.origin.iataCode,
                destinationLocationCode: searchParams.destination.iataCode,
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

            return response.data ?
            response.data.map((flight: FlightOffer) => ({
                id: flight.id,
                oneWay: !searchParams.returnDate,
                price: {
                    total: flight.price.total,
                    currency: flight.price.currency,
                },
                itineraries: flight.itineraries.map((itinerary) => ({
                    duration: itinerary.duration,
                    segments: itinerary.segments.map((segment) => ({
                        departure: {
                            iataCode: segment.departure.iataCode,
                            at: segment.departure.at,
                        },
                        arrival: {
                            iataCode: segment.arrival.iataCode,
                            at: segment.arrival.at,
                        },
                        carrierCode: segment.carrierCode,
                        aircraft: { code: segment.aircraft.code },
                        duration: segment.duration,
                    })),
                })),
            })) :
            [];
        } catch (error) {
            logger.error('Flight search failed', error);
            throw new Error('Flight search failed');
        }
    }

    async searchHotels(destination: string, checkInDate: string, checkOutDate?: string): Promise<HotelOffer[]> {
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

            return response.data ?            
            response.data.map((hotelOffer: HotelOffer) => ({
                hotel: {
                    hotelId: hotelOffer.hotel.hotelId,
                    name: hotelOffer.hotel.name,
                },
                offers: hotelOffer.offers.map((offer) => ({
                    id: offer.id,
                    price: {
                        currency: offer.price.currency,
                        total: offer.price.total,
                    },
                    room: {
                        type: offer.room.type,
                        typeEstimated: offer.room.typeEstimated,
                        description: offer.room.description,
                    },
                })),
            })) :
            [];
        } catch (error) {
            logger.error('Hotel search failed', error);
            throw new Error('Hotel search failed');
        }
    }

    async searchActivities(latitude: number, longitude: number): Promise<Activity[]> {
        try {
            const response = await amadeus.shopping.activities.get({
                latitude,
                longitude,
            });

            // Limit to top 20 activities
            return response.data ? 
            response.data.slice(0, 20).map((activity: Activity) => ({
                id: activity.id,
                name: activity.name,
                shortDescription: activity.shortDescription,
                price: {
                    amount: activity.price.amount,
                    currencyCode: activity.price.currencyCode,
                },
                pictures: activity.pictures,
            })) : 
            [];
        } catch (error) {
            logger.error('Activity search failed', error);
            throw new Error('Activity search failed');
        }
    }
}

export const amadeusService = new AmadeusService();