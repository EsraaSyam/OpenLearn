import { Module } from '@nestjs/common';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionEntity } from './section.entity';
import { CoursesModule } from 'src/course/course.module';

@Module({
  imports: [TypeOrmModule.forFeature([SectionEntity]), CoursesModule],
  controllers: [SectionController],
  providers: [SectionService],
})
export class SectionModule { }
