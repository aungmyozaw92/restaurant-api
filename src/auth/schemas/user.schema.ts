import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum UserRoles {
    ADMIN = 'admin',
    USER = 'user',
}

@Schema()
export class User extends Document {

    @Prop()
    name: string;

    @Prop({ unique: [true, 'Email is already exit'] })
    email: string;

    @Prop({ select: false })
    password: string;

    @Prop({
        enum: UserRoles,
        default: UserRoles.USER
    })
    role: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);