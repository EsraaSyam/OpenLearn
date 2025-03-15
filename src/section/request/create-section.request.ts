import { IsNumber, IsPositive, IsString } from "class-validator";
import { IsNotNullOrUndefined } from "src/validator/Is-not-null-or-undefined.decorator";

export class CreateSectionRequest {
    @IsNotNullOrUndefined()
    @IsString()
    title: string;

    @IsNumber()
    @IsPositive()
    order: number;
}