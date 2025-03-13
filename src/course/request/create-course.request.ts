import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { IsNotNullOrUndefined } from "src/validator/Is-not-null-or-undefined.decorator";
import { DifficultyLevel } from "../enum/level.enum";

export class CreateCourseRequest {
    @IsNotNullOrUndefined()
    @IsString()
    title: string;

    @IsNotNullOrUndefined()
    @IsString()
    description: string;

    @IsNotNullOrUndefined()
    @IsEnum(DifficultyLevel)
    difficultyLevel: DifficultyLevel;

    @IsNotNullOrUndefined()
    @IsNumber()
    @Min(0)
    price: number;
}