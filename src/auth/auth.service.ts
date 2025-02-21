import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterRequest } from './requests/register.request';
import { UserAlreadyExistException } from './exceptions/user-is-already-exist.exception';
import * as bcrypt from 'bcrypt';
import { ConfigService } from "@nestjs/config";
import { LoginRequest } from './requests/login.request';
import { UserNotFoundException } from 'src/user/exceptions/user-not-found.exception';
import { NotValidEmailOrPasswordException } from './exceptions/not-valid-email-or-pass.exception';
import { JwtService } from '@nestjs/jwt';

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

    async login(data: LoginRequest): Promise<{ token: string, data: any }> {
        const user = await this.userService.findByEmail(data.email);
        const isPasswordMatches = await this.isPasswordMatches(data.password, user.password);

        if (!user || !isPasswordMatches) {
            throw new NotValidEmailOrPasswordException();
        }

        const token = this.jwtService.sign({ id: user.id, email: user.email });

        return {
            token,
            data: user,
        }
    }

}
