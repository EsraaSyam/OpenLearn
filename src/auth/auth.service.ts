import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterRequest } from './requests/register.request';
import { UserAlreadyExistException } from './exceptions/user-is-already-exist.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) { }

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
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

}
