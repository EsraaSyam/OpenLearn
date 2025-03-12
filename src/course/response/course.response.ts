export class CourseResponse {
    id: number;
    title: string;
    description: string;
    difficultyLevel: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;


    constructor(course: any) {
        this.id = course.id;
        this.title = course.title;
        this.description = course.description;
        this.difficultyLevel = course.difficultyLevel;
        this.price = course.price;
        this.createdAt = course.createdAt;
        this.updatedAt = course.updatedAt;
    }
}