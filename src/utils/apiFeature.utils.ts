import { Location } from "../restaurants/schemas/restaurant.schema";

const nodeGeoCoder = require('node-geocoder');

export default class APIFeatures {
  static async getRestaurantLocation(address) {
    try {
      const options = {
        provider: process.env.GEO_PROVIDER,
        httpAdapter: 'https',
        apiKey: process.env.GEO_API_KEY,
        formatter: null,
      };


      const geoCoder = nodeGeoCoder(options);

      const loc = await geoCoder.geocode(address);

      const location: Location = {
          type: 'Point',
          coordinates: [loc[0].longitude, loc[0].latitude],
          formattedAddress: loc[0].formattedAddress,
          city: loc[0].city,
          state: loc[0].stateCode,
          zipcode: loc[0].zipcode,
          country: loc[0].countryCode,
      }

      return location;

      
    } catch (error) {
      console.log(error.message);
    }
  }

}