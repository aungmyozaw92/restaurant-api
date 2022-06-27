import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto{

    @IsNotEmpty()
    @IsEmail({} , {message: 'please enter invalid email address'})
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;
}