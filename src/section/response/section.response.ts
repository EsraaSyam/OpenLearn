export class SectionResponse {
    id: number;
    title: string;
    order: number;
    courseId: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(section: any) {
        this.id = section.id;
        this.title = section.title;
        this.order = section.order;
        this.courseId = section.course.id;
        this.createdAt = section.createdAt;
        this.updatedAt = section.updatedAt;
    }

}