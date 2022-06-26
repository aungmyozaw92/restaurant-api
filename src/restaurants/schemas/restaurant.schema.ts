import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Location {
  @Prop({ type: String, enum: ['Point'] })
  type: string;

  @Prop({ index: '2dsphere' })
  coordinates: Number[];

  formattedAddress: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

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

    @Prop({ type: Object, ref: 'Location' })
    location?: Location;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
