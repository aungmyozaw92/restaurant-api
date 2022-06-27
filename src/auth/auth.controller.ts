import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { User } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
    
    constructor(private authService: AuthService){}

    @Post('/signup')
    singUp(@Body() signUpDto: SignUpDto): Promise<{token: string}>{
        return this.authService.singUp(signUpDto);
    }

    @Post('/login')
    login(@Body() loginDto: LoginDto): Promise<{ token: string }>{
        return this.authService.login(loginDto);
    }
}