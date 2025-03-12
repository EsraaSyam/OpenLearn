import { CourseResponse } from "./course.response";

export class FindCoursesResponse {
    courses: CourseResponse[];
    total: number;
    page: number;
    limit: number;
    numberOfPages: number;
    isLast: boolean;
  
    constructor(courses: any, total: number, page: number, limit: number) {
      this.courses = courses.map((course) => new CourseResponse(course));
      this.total = total;
      this.page = page;
      this.limit = limit;
      this.numberOfPages = Math.ceil(total / limit);
      this.isLast = page === this.numberOfPages;
    }

  }
