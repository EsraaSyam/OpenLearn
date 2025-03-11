import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IsNotNullOrUndefined } from "src/validators/Is-not-null-or-undefined.decorator";
import { CourseLevel } from "../enums/level.enum";

export class CreateCourseRequest {
    @IsNotNullOrUndefined()
    @IsString()
    title: string;

    @IsNotNullOrUndefined()
    @IsString()
    description: string;

    @IsNotNullOrUndefined()
    @IsEnum(CourseLevel)
    level: CourseLevel;

    @IsNotNullOrUndefined()
    @IsNumber()
    price: number;
}