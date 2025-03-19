import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { SectionEntity } from './section.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from 'src/course/course.module';

@Module({
  imports: [TypeOrmModule.forFeature([SectionEntity]), CoursesModule],
  providers: [SectionService],
  controllers: [SectionController]
})
export class SectionModule {}
