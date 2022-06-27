import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/schemas/user.schema';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('restaurants')
export class RestaurantsController {

    constructor(private restaurantService: RestaurantsService){

    }

    @Get()
    // @UseGuards(AuthGuard())
    async getAllRestaurants(
        @Query() query: ExpressQuery,
        // @CurrentUser() user: User
    ) : Promise<Restaurant[]> {
        return this.restaurantService.findAll(query);
    }

    @Post()
    @UseGuards(AuthGuard(), RolesGuard)
    @Roles('admin','user')
    async createRestaurant(
        @Body() restaurant: CreateRestaurantDto,
         @CurrentUser() user: User
    ) : Promise<Restaurant> {
        return this.restaurantService.create(restaurant, user);
    }

    @Get(':id')
    async getRestaurant(@Param('id') id: string) : Promise<Restaurant> {
        return this.restaurantService.findById(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async updateRestaurant(
            @Param('id') id: string, 
            @Body() restaurant: UpdateRestaurantDto,
            @CurrentUser() user: User
        ) : Promise<Restaurant> 
    {
        const res = await this.restaurantService.findById(id);
        if (res.user.toString() !== user._id.toString()) {
            throw new ForbiddenException('You cannot access this restaurant');
        }
        return this.restaurantService.updateById(id, restaurant);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async deleteRestaurant(
        @Param('id') id: string,
        @CurrentUser() user: User
        ) : Promise<{ deleted: Boolean }>
    {
        const restaurant = await this.restaurantService.findById(id);
        if (restaurant.user.toString() !== user._id.toString()) {
            throw new ForbiddenException('You cannot access this restaurant');
        }
        const idDeleted = this.restaurantService.deleteById(id);
        if (idDeleted) {
            return {
                deleted: true
            }
        }
    }

    @Put('upload/:id')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('files'))
    async uploadFile(
        @Param('id') id: string, 
        @UploadedFile() file: Array<Express.Multer.File>)
    {
        await this.restaurantService.findById(id);
        const res = await this.restaurantService.uploadImages(id, file);
        return res;
    }
}
