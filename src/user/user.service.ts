import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNotFoundException } from './exception/user-not-found.exception';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    async findByEmail(email: string): Promise<UserEntity> {
        const user = this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new UserNotFoundException(email);
        }

        return user;
    }

    async findById(id: number): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            throw new UserNotFoundException(id);
        }

        return user;
    }

    async create(user: any) {
        return await this.userRepository.save(user);
    }
}
