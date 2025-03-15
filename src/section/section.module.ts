import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionEntity } from './section.entity';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';
import { CoursesModule } from 'src/course/course.module';

@Module({
    imports: [TypeOrmModule.forFeature([SectionEntity]), CoursesModule],
    controllers: [SectionController],
    providers: [SectionService],
})
export class SectionModule {}
