import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterRequest } from './requests/register.request';
import { UserAlreadyExistException } from './exceptions/user-is-already-exist.exception';
import * as bcrypt from 'bcrypt';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService
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

}
