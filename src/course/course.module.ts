import { Module } from '@nestjs/common';
import { CoursesService } from './course.service';
import { CoursesController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity])],
  providers: [CoursesService],
  controllers: [CoursesController]
})
export class CoursesModule {}
