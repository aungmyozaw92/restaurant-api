import { Location } from "../restaurants/schemas/restaurant.schema";
import { v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { Readable } from "stream";
import { JwtService } from "@nestjs/jwt";

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

  static async upload(file) {
     v2.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
            //   Readable.from(files.buffer).pipe(upload); // covert buffer to readable stream and pass to upload
            toStream(file.buffer).pipe(upload);
        });
  }

  static async assignJwtToken(userId: string, jwtService: JwtService): Promise<string>{
    const payload = { id: userId };
    const token = await jwtService.sign(payload);
    return token;
  }
   // Upload images
  // static async upload(files) {
  //   return new Promise((resolve, reject) => {
  //     const s3 = new S3({
  //       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //       secretAccessKey: process.env.AWS_SECRET_KEY,
  //     });

  //     let images = [];

  //     files.forEach(async (file) => {
  //       const splitFile = file.originalname.split('.');
  //       const random = Date.now();

  //       const fileName = `${splitFile[0]}_${random}.${splitFile[1]}`;

  //       const params = {
  //         Bucket: `${process.env.AWS_S3_BUCKET_NAME}/restaurants`,
  //         Key: fileName,
  //         Body: file.buffer,
  //       };

  //       const uploadResponse = await s3.upload(params).promise();

  //       images.push(uploadResponse);

  //       if (images.length === files.length) {
  //         resolve(images);
  //       }
  //     });
  //   });
  // }

}

