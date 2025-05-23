import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterRequest } from './request/register.request';
import { UserAlreadyExistException } from './exception/user-is-already-exist.exception';
import * as bcrypt from 'bcrypt';
import { ConfigService } from "@nestjs/config";
import { LoginRequest } from './request/login.request';
import { UserNotFoundException } from 'src/user/exception/user-not-found.exception';
import { JwtService } from '@nestjs/jwt';
import { InvalidPasswordException } from './exception/invalid-password.exception';
import { EmailNotFoundException } from './exception/email-not-found.exception';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) { }

    async registerUser(data: RegisterRequest) {
        const existingUser = await this.userService.findByEmail(data.email);

        if (existingUser) {
            throw new UserAlreadyExistException(data.email);
        }

        const hashedPassword = await this.hashPassword(data.password);

        return await this.userService.create({
            ...data,
            password: hashedPassword,
        });
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = Number(this.configService.get("SALT_ROUNDS"));
        return await bcrypt.hash(password, saltRounds);
    }

    async isPasswordMatches(password: string, storedHashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, storedHashedPassword);
    }

    createToken(id: number, email: string): string {
        return this.jwtService.sign({ id, email });
    }

    async login(data: LoginRequest): Promise<string> {
        const user = await this.userService.findByEmail(data.email);

        if (!user) {
            throw new EmailNotFoundException();
        }

        if (!user.password) {
            throw new UnauthorizedException('User registered with Google, please login with Google or reset your password');
        }

        const isPasswordMatches = await this.isPasswordMatches(data.password, user.password);

        if (!isPasswordMatches) {
            throw new InvalidPasswordException();
        }
        
        return this.createToken(user.id, user.email);
    }

    async handleGoogleUser(user: RegisterRequest): Promise<string> {
        const existingUser = await this.userService.findByEmail(user.email);

        if (existingUser) {
            return this.createToken(existingUser.id, existingUser.email);
        }

        return this.createToken((await this.userService.create(user)).id, user.email);
    }

    async getProfile(email: string) {
        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new UserNotFoundException(email);
        }

        return user;
    }


}
