import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class FindCoursesRequest {
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
  }
  