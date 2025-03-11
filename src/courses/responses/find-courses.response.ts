import { CourseEntity } from "../course.entity";

export class FindCoursesResponse {
    courses: CourseEntity[];
    total: number;
    page: number;
    limit: number;
    numberOfPages: number;
    isLast: boolean;
  
    constructor(courses: any, total: number, page: number, limit: number) {
      this.courses = courses.map((course) => this.mapToCourseResponse(course));
      this.total = total;
      this.page = page;
      this.limit = limit;
      this.numberOfPages = Math.ceil(total / limit);
      this.isLast = page === this.numberOfPages;
    }
  
    private mapToCourseResponse(course: any): CourseEntity {
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        price: course.price,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      };
    }
  }
