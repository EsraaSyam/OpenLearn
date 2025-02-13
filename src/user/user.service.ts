import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserNotFoundException } from './exceptions/user-not-found.exception';

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

    async create(data: any) {
        const user = this.userRepository.create(data);
        return await this.userRepository.save(user);
    }
}
