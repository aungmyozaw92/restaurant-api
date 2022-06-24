import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum Category {
    FAST_FOOD = 'Fast Food',
    CAFE = 'Cafe',
    FIND_DINING = 'Find Dining'
}

@Schema()
export class Restaurant {

    @Prop()
    name: string

    @Prop()
    email: string

    @Prop()
    description: string

    @Prop()
    phoneNo: number

    @Prop()
    address: string

    @Prop()
    category: Category

    @Prop()
    image?: object[]

}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
