import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import APIFeatures from 'src/utils/apiFeature.utils';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
    ){}

    async singUp(signUpDto: SignUpDto): Promise<{ token: string }> {
        
        const { name, email, password } = signUpDto;

        const hashPassword = await bcrypt.hash(password, 10);
        
        try {
            const user = await this.userModel.create({
                name, 
                email, 
                password: hashPassword,
            });
            const token = await APIFeatures.assignJwtToken(user._id, this.jwtService);

            return {token};
            // return user;
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('Email is already exit!');
            }
        }
    }

    async login(loginDto: LoginDto): Promise<{ token: string }>{
        const { email, password } = loginDto;

        const user = await this.userModel.findOne({ email }).select('+password');
        if (!user) {
            throw new UnauthorizedException('Invalid email and password');
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            throw new UnauthorizedException('Invalid email and password');
        }

        const token = await APIFeatures.assignJwtToken(user._id, this.jwtService);

        return {token};

        // return user;
    }
}
