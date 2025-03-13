import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { DifficultyLevel } from "../enum/level.enum";

export class UpdateCourseRequest {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(DifficultyLevel)
    difficultyLevel?: DifficultyLevel;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;
}