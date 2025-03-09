export class CourseResponse {
    id: number;
    title: string;
    description: string;
    level: string;
    createdAt: Date;
    updatedAt: Date;


    constructor(course: any) {
        this.id = course.id;
        this.title = course.title;
        this.description = course.description;
        this.level = course.level;
        this.createdAt = course.createdAt;
        this.updatedAt = course.updatedAt;
    }
}