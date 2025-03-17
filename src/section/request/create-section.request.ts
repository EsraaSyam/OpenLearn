import { IsNumber, IsPositive, IsString, MaxLength } from "class-validator";
import { IsNotNullOrUndefined } from "src/validator/Is-not-null-or-undefined.decorator";

export class CreateSectionRequest {
    @IsNotNullOrUndefined()
    @IsString()
    @MaxLength(80)
    title: string;

    @IsNumber()
    @IsPositive()
    courseId: number;
}