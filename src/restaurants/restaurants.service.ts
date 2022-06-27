import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import * as mongoose from 'mongoose';
import APIFeatures from '../utils/apiFeature.utils';
import { Restaurant } from './schemas/restaurant.schema';
// import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
// import { Readable } from 'stream';
// import toStream = require('buffer-to-stream');

@Injectable()
export class RestaurantsService {

    constructor(
        @InjectModel(Restaurant.name)
        private restaurantModel: mongoose.Model<Restaurant>
    ){}

    async findAll(query: Query) : Promise<Restaurant[]> {
        const resPerPage = Number(query.paginate) || 10;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        const keyword = query.keyword
        ? {
            name: {
                $regex: query.keyword,
                $options: 'i',
            },
            }
        : {};

        const restaurants = await this.restaurantModel
        .find({ ...keyword })
        .limit(resPerPage)
        .skip(skip);

        return restaurants;
    }

    async create(restaurant: Restaurant) : Promise<Restaurant> {
        const location = await APIFeatures.getRestaurantLocation(restaurant.address);
        const data = Object.assign(restaurant, { location });
        const res = await this.restaurantModel.create(data);
        return res;
    }

    async findById(id: string) : Promise<Restaurant>{
        const isValidId = mongoose.isValidObjectId(id);
        if (!isValidId) {
            throw new BadRequestException('Invalid param :id');
        }
        const restaurant = await this.restaurantModel.findById(id);
        if (!restaurant) {
            throw new NotFoundException('Restaurant Not Found');
        }
        return restaurant;
    }

    async updateById(id: string, restaurant: Restaurant) : Promise<Restaurant> {
        return await this.restaurantModel.findByIdAndUpdate(id, restaurant, {
            new: true,
            runValidators : true,
        })
    }

    async deleteById(id: string) : Promise<Restaurant> {
        return await this.restaurantModel.findByIdAndDelete(id);
    }

//     async uploadImages(id, file): Promise<UploadApiResponse | UploadApiErrorResponse> {
//         v2.config({
//             cloud_name: process.env.CLOUDINARY_NAME,
//             api_key: process.env.CLOUDINARY_API_KEY,
//             api_secret: process.env.CLOUDINARY_API_SECRET,
//         });
//         return new Promise((resolve, reject) => {
//             const upload = v2.uploader.upload_stream((error, result) => {
//                 if (error) return reject(error);
//                 resolve(result);
//             });
//             //   console.log('hello', upload);
//             //   Readable.from(files.buffer).pipe(upload); // covert buffer to readable stream and pass to upload
//             toStream(file.buffer).pipe(upload);
//             //  files.createReadStream().pipe(upload);
//         });
//   }

    // Upload Images  =>  PUT /restaurants/upload/:id
  async uploadImages(id, file) {
    const images = await APIFeatures.upload(file);
    const restaurant = await this.restaurantModel.findByIdAndUpdate(
      id,
      {images: images as Object[],},
      {new: true,runValidators: true,},
    );

    return restaurant;
  }



}
