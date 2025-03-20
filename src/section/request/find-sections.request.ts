import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class FindSectionRequest {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    page: number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    limit: number;

    @IsString()
    orderBy: string;

    @IsString()
    orderDirection: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    courseId?: number;
}