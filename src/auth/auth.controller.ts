import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from './request/register.request';
import { Response } from 'express';
import { UserResponse } from './response/user.response';
import { LoginRequest } from './request/login.request';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 404, description: 'Not found' })
    async register(@Body() data: RegisterRequest, @Res() res: Response) {
        const user = await this.authService.registerUser(data);
        return res.status(201).json({
            message: 'User has been created successfully',
            data: new UserResponse(user),
        });
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'User logged in successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async login(@Body() data: LoginRequest, @Res() res: Response) {
        const token = await this.authService.login(data);

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: 'User has been logged in successfully',
        });
    }

    @Get('google/login')
    @UseGuards(AuthGuard('google'))
    async googleAuth() { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthCallback(@Req() req, @Res() res: Response) {
        const token = await this.authService.handleGoogleUser(req.user);

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        console.log("FRONT_URL:", this.configService.get<string>('FRONT_URL'));

        res.redirect(this.configService.get<string>('FRONT_URL'));
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Req() req) {
        const user = await this.authService.getProfile(req.user.email);

        return new UserResponse(user);
    }
}
