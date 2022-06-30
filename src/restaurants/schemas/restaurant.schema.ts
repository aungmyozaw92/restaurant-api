import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/auth/schemas/user.schema";
import { Meal } from "src/meal/schemas/meal.schema";

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

@Schema({
    timestamps: true
})
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

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }])
    menu?: Meal[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
