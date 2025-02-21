import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from './requests/register.request';
import { Response } from 'express';
import { UserResponse } from './responses/user.response';
import { LoginRequest } from './requests/login.request';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() data: RegisterRequest, @Res() res: Response) {
        const user = await this.authService.registerUser(data);
        return res.status(201).json({
            message: 'User has been created successfully',
            data: new UserResponse(user),
        });
    }

    @Post('login')
    async login(@Body() data: LoginRequest, @Res() res: Response) {
        const userData = await this.authService.login(data);
        return res.status(200).json({
            message: 'User has been logged in successfully',
            data: new UserResponse(userData.data),
            token: userData.token,
        });
    }

}
